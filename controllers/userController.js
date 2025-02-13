const User = require("./../models/UserModel");
const bcrypt = require("bcryptjs");
const generateToken = require("./../utils/generateToken");
const { sendSuccess, sendError } = require("./../utils/apiUtils");

const createUser = async (req, res) => {
  try {
    const { fullName, email, password, address, contactNumber } = req.body;

    if (!fullName || !email || !password) {
      return sendError(
        res,
        400,
        "Full name, email, and password are required."
      );
    }

    // Hashing the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      address,
      contactNumber,
      role: "user",
    });

    // Check if its an existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("existingUser : ", existingUser);
      return sendError(res, 409, "Account exists with the given email ID.");
    }

    await newUser
      .save()
      .then((savedUser) => {
        // Generate a JWT token
        const token = generateToken({
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role,
        });

        // Set the JWT token in an HTTP-only cookie
        res.cookie("authToken", token, {
          httpOnly: true, // Prevent access to cookies via JavaScript
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          maxAge: 60 * 60 * 1000, // Cookie expiry time (1 hour)
        });
        // Convert user document to object & remove password
        const userWithoutPassword = savedUser.toObject();
        delete userWithoutPassword.password;

        // Send the user details as the response
        sendSuccess(res, 201, "User created successfully", userWithoutPassword);
      })
      .catch((error) => {
        sendError(res, 500, `Error adding user: ${error.message}`);
      });
  } catch (error) {
    sendError(res, 500, `Failed to create user. Error: ${error.message}`);
  }
};

// View all users
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return sendError(res, 403, "Access denied: Admins only");

    const { page = 1, limit = 10, search = "" } = req.query; // Read query params
    const regex = new RegExp(search, "i"); // Case-insensitive search

    // Fetch users with pagination and search filter
    const usersList = await User.find({
      $or: [{ fullName: regex }, { email: regex }], // Search by name or email
    })
      .skip((page - 1) * limit) // Pagination: skip the previous page
      .limit(Number(limit)); // Limit results per page

    // Get total user count for pagination info
    const totalUsers = await User.countDocuments({
      $or: [{ fullName: regex }, { email: regex }],
    });

    sendSuccess(res, 200, "User list retrieved successfully", {
      usersList,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    sendError(res, 500, `Failed to retrieve users. Error: ${err.message}`);
  }
};

// Total user
const getTotalUser = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return sendError(res, 403, "Access denied: Admins only");

    const totalUsers = await User.countDocuments();
    sendSuccess(res, 200, "Total users count retrieved", { totalUsers });
  } catch (error) {
    sendError(res, 500, `Error fetching user count: ${error.message}`);
  }
};

// get user by id
const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const userDetails = await User.findOne({ id: userId });

    if (!userDetails) return sendError(res, 404, "User not found");

    sendSuccess(res, 200, "User found successfully", userDetails);
  } catch (error) {
    sendError(res, 500, `Error finding user. Details: ${error.message}`);
  }
};

// Modify user details
const updateUserData = async (req, res) => {
  const userId = req.params.id;
  const { role, ...userDataToUpdate } = req.body; // Extract role from body if it's being updated

  if (role && req.user.role !== "admin") {
    return sendError(res, 403, "Only admins can change user roles.");
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      { ...userDataToUpdate, role }, // If role is passed, update it
      { new: true, runValidators: true }
    );

    if (!updatedUser) return sendError(res, 404, "User not found");

    sendSuccess(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    sendError(res, 500, `Error updating user details. Details: ${error.message}`);
  }
};


// Delete user account
const deleteUser = async (req, res) => {
  const userId = req.params.id; // User ID from URL
  try {
    if (!(req.user.id == userId || req.user.role === "admin"))
      return sendError(
        res,
        403,
        "You are not authorized to perform this operation."
      );

    const deleteUser = await User.findOneAndDelete({ id: userId });

    if (!deleteUser) return sendError(res, 404, "User not found.");

    sendSuccess(res, 200, "User deleted successfully", deleteUser);
  } catch (error) {
    sendError(res, 500, `Error deleting user. Details: ${error.message}`);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getTotalUser,
  updateUserData,
  getUserById,
  deleteUser,
};
