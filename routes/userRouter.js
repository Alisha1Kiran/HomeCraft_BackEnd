const express = require("express");
const userRouter = express.Router();
const validateAddress = require("./../middlewares/validateAddress");
const {
  createUser,
  getAllUsers,
  getTotalUser,
  updateUserData,
  getUserById,
  deleteUser,
} = require("./../controllers/userController");
const { userLogin, userLogout } = require("../controllers/sessionController");
const verifyToken = require("./../middlewares/verifyToken");
const cartRouter = require("./cartRoutes");

userRouter.post("/register", validateAddress, createUser);

userRouter.post("/login", userLogin);

userRouter.post("/logout", userLogout);

userRouter.get("/viewAllUsers", verifyToken, getAllUsers);

userRouter.get("/totalUser", verifyToken, getTotalUser);

userRouter.get("/getUserData/:id", getUserById);

userRouter.put("/updateUserData/:id", verifyToken, updateUserData);

userRouter.delete("/deleteAccount/:id", verifyToken, deleteUser);

userRouter.use("/cart", cartRouter);

module.exports = userRouter;
