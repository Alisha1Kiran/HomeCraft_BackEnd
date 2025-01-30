const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// Login
const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Using email whether user exists in DB
    const user = await User.findOne({ email });
    console.log(`User with email ${email} exists`);
    console.log(`User : ${user}`);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // Generate a JWT token
    const token = generateToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    // Set the JWT token in an HTTP-only cookie
    res.cookie("authToken", token, {
      httpOnly: true, // Prevent access to cookies via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 1000, // Cookie expiry time (1 hour)
    });

    // Convert user document to object & remove password
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    // Send the token to the client
    res.status(200).json({
      message: "Loggedin successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(`Error is : ${error}`);
    res.status(500).send("Internal Server Error");
  }
};

// Logout
const userLogout = async (req, res) => {
  try {
    // Clear the 'authToken' cookie
    res.clearCookie("authToken", {
      httpOnly: true, // Ensure the cookie is inaccessible via JavaScript
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Protect against CSRF
    });

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    res.status(500).json({ message: "Logout failed.", error: error.message });
  }
};

module.exports = {userLogin, userLogout};
