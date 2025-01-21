const express = require("express");
const apiRouter = express.Router();
const userRouter = require("./userRouter");


// apiRouter.use("/auth");
apiRouter.use("/user", userRouter);
// apiRouter.use("/products");

module.exports = apiRouter;