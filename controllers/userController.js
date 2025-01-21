const User = require("./../models/UserModel");
const bcrypt = require("bcryptjs");
const generateToken = require("./../utils/generateToken")

const createUser = async (req, res) => {
  try {
    const { fullName, email, password, address, contactNumber } = req.body;

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Full name, email, and password are required." });
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
      return res
        .status(409)
        .json({ message: "Account exits with the given email id" });
    }

    await newUser
      .save()
      .then((savedUser) => {
        // Generate a JWT token
        const token = generateToken({
          id: savedUser.id,
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
        res.status(201).json({
          message: "User created successfully",
          user: {
            id: savedUser.id,
            fullName: savedUser.fullName,
            email: savedUser.email,
            role: savedUser.role,
          },
        });
      })
      .catch((error) => {
        res.status(500).json({
          message: "Error adding user",
          error: error.message, // Send the error message in the response
        });
      });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to create user.", details: error.message });
  }
};

// View all users
const getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ message: "Access denied: Admins only" });

    const usersList = await User.find();
    res.json(usersList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// get user by id
const getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const userDetails = await User.findOne({id : userId});

    if (!userDetails)
      return res.status(402).json({
        message: "User not found",
      });

    res.status(200).json({
      message: "User found successfully",
      user: userDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error finding user",
      error: error.message, // Send the error message in the response
    });
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

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user details",
      error: error.message,
    });
  }
};

// Delete user account
const deleteUser = async (req, res) => {
  const userId = req.params.id; // User ID from URL
  try {
    if(!(req.user.id == userId || req.user.role === 'admin'))
      return res.status(403).json({ message: "You are not authorized to perform this operation." });

    const deleteUser = await User.findOneAndDelete({ id: userId });

    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
      deleteUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

module.exports = { createUser, getAllUsers, updateUserData, getUserById, deleteUser };
