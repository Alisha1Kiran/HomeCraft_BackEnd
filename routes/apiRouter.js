const express = require("express");
const apiRouter = express.Router();
const userRouter = require("./userRouter");
const productsRouter = require("./productsRouter");
const reviewRouter = require("./reviewRouter");
const orderRouter = require("./orderRouter");
const lookupRouter = require("./lookupRouter");
const searchRouter = require("./searchRouter");
const wishlistRouter = require("./wishlistRoutes");
const uploadImage = require("../controllers/uploadImage");
const { upload } = require("../config/cloudninary");
const verifyToken = require("../middlewares/verifyToken");
const statisticsRouter = require("./statisticsRouter");

// apiRouter.use("/auth");
apiRouter.use("/user", userRouter);
apiRouter.use("/products", productsRouter);
apiRouter.use("/review", reviewRouter);
apiRouter.use("/order", orderRouter);
apiRouter.use("/lookup", lookupRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/wishlist", wishlistRouter);
apiRouter.post("/upload-image", upload.single("image"), uploadImage);
apiRouter.use("/statistics", statisticsRouter);

apiRouter.get("/auth/checkAuth", (req, res) => {
  const token = req.cookies.authToken;

  // If the token is available, verify it
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json({
        isAuthenticated: true,
        userId: decoded.userId,
        message: "Authenticated",
      });
    } catch (error) {
      return res.status(403).json({
        isAuthenticated: false,
        message: "Invalid or expired token",
      });
    }
  }

  // If no token is available, generate a guest ID
  return res.status(200).json({
    isAuthenticated: false,
    message: "Guest user",
  });
});

module.exports = apiRouter;
