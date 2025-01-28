const express = require("express");
const apiRouter = express.Router();
const userRouter = require("./userRouter");
const productsRouter = require("./productsRouter");
const reviewRouter = require("./reviewRouter");
const orderRouter = require("./orderRouter");
const lookupRouter = require("./lookupRouter");

// apiRouter.use("/auth");
apiRouter.use("/user", userRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/review", reviewRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/lookup", lookupRouter);

module.exports = apiRouter;