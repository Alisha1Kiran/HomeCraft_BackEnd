const express = require("express");
const cartRouter = express.Router();
const {
  addCart,
  viewCart,
  deleteCartItem,
} = require("./../controllers/cartController");

// add to cart
cartRouter.post("/addToCart", addCart);

cartRouter.get("/:user_id", viewCart);

cartRouter.get("/guest/:guest_id", viewCart);

cartRouter.delete("/deleteCartItem", deleteCartItem);

module.exports = cartRouter;
