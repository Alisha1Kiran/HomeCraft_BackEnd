const express = require("express");
const apiRouter = express.Router();
const userRouter = require("./userRouter");
const productsRouter = require("./productsRouter");
const reviewRouter = require("./reviewRouter");
const orderRouter = require("./orderRouter");
const lookupRouter = require("./lookupRouter");
const searchRouter = require("./searchRouter");
const uploadImage = require("../controllers/uploadImage");
const { upload } = require("../config/cloudninary");

// apiRouter.use("/auth");
apiRouter.use("/user", userRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/review", reviewRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/lookup", lookupRouter);
apiRouter.use("/search", searchRouter);
apiRouter.post("/upload-image", upload.single("image"), uploadImage);

module.exports = apiRouter;