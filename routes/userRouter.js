const express = require("express");
const userRouter = express.Router();
const validateAddress = require("./../middlewares/validateAddress");
const { createUser, getAllUsers, updateUserData, getUserById, deleteUser } = require("./../controllers/userController");
const {userLogin, userLogout} = require("../controllers/sessionController");
const verifyToken = require("./../middlewares/verifyToken")

userRouter.post("/register", validateAddress, createUser);

userRouter.post("/login", userLogin);

userRouter.post("/logout", userLogout);

userRouter.get("/viewAllUsers", verifyToken, getAllUsers);

userRouter.get("/getUserData/:id", getUserById);

userRouter.put("/updateUserData/:id", updateUserData);

userRouter.delete("/deleteAccount/:id", verifyToken, deleteUser);

module.exports = userRouter;
