const express = require("express");
const wishlistRouter = express.Router();
const { addToWishlist, removeFromWishlist, getWishlist } = require("../controllers/wishlistController");
const verifyToken = require("./../middlewares/verifyToken")

wishlistRouter.post("/add", verifyToken, addToWishlist);
wishlistRouter.post("/remove", verifyToken, removeFromWishlist);
wishlistRouter.get("/",verifyToken, getWishlist);

module.exports = wishlistRouter;