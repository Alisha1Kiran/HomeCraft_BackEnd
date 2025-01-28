const User = require("./../models/UserModel");
const bcrypt = require("bcryptjs");
const generateToken = require("./../utils/generateToken");
const {sendSuccess, sendError} = require("./../utils/apiUtils")

const createUser = async (req, res) => {
  try {
    const { fullName, email, password, address, contactNumber } = req.body;

    if (!fullName || !email || !password) {
      return sendError(res, 400, "Full name, email, and password are required.");
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

        // Send the user details as the response
        sendSuccess(res, 201, "User created successfully", {
          id: savedUser.id,
          fullName: savedUser.fullName,
          email: savedUser.email,
          role: savedUser.role,
        });
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

    const usersList = await User.find();
    sendSuccess(res, 200, "User list retrieved successfully", usersList);
  } catch (err) {
    sendError(res, 500, `Failed to retrieve users. Error: ${err.message}`);
  }
}

// get user by id
const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const userDetails = await User.findOne({id : userId});

    if (!userDetails)
      return sendError(res, 404, "User not found");

    sendSuccess(res, 200, "User found successfully", userDetails);
  } catch (error) {
    sendError(res, 500, `Error finding user. Details: ${error.message}`);
  }
};

// Modify user details
const updateUserData = async (req, res) => {
  const userId = req.params.id; // User ID from URL
  const userDataToUpdate = req.body; // Fields to update

  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: userId },
      userDataToUpdate,
      { new: true, runValidators: true } // Return updated document and validate changes
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
    if(!(req.user.id == userId || req.user.role === 'admin'))
      return sendError(res, 403, "You are not authorized to perform this operation.");

    const deleteUser = await User.findOneAndDelete({ id: userId });

    if (!deleteUser) return sendError(res, 404, "User not found.");

    sendSuccess(res, 200, "User deleted successfully", deletedUser);
  } catch (error) {
    sendError(res, 500, `Error deleting user. Details: ${error.message}`);
  }
};

module.exports = { createUser, getAllUsers, updateUserData, getUserById, deleteUser };
