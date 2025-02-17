const Cart = require("../models/CartModel");
const Product = require("../models/ProductModel");
const { sendSuccess, sendError } = require("./../utils/apiUtils");
const { v4: uuidv4 } = require("uuid"); // For generating unique guest IDs

const addCart = async (req, res) => {
  const { user_id, product_id, quantity, guest_id } = req.body;
  try {
    // Validate quantity
    if (!quantity || quantity < 1) {
      return sendError(res, 400, "Quantity must be at least 1.");
    }

    // Get product price (for calculating total)
    const product = await Product.findById(product_id);

    let cart;

    if (user_id) {
      // For authenticated users
      cart = await Cart.findOne({ user_id });
    } else {
      // For guests, check by guest_id
      if (!guest_id) {
        return sendError(
          res,
          400,
          "Guest ID is required for unauthenticated users."
        );
      }
      cart = await Cart.findOne({ guest_id });
    }

    if (!product) return sendError(res, 404, "Product not found.");

    if (!cart) {
      // Create a new cart (user or guest)
      cart = new Cart({
        user_id: user_id || null,
        guest_id: guest_id || uuidv4(), // Generate a unique ID if not provided
        items: [{ product_id, quantity }],
        total_price: product.price * quantity,
      });
    } else {
      // Update existing cart
      const cartItemIndex = cart.items.findIndex(
        (item) => item.product_id.toString() === product_id
      );

      if (cartItemIndex > -1) {
        // Update quantity
        cart.items[cartItemIndex].quantity += quantity;
      } else {
        // Add new product
        cart.items.push({ product_id, quantity });
      }

      // Recalculate total price
      cart.total_price = cart.items.reduce((total, item) => {
        return total + item.quantity * product.price;
      }, 0);
    }

    await cart.save();
    sendSuccess(res, 200, "Cart updated successfully.", cart);
  } catch (error) {
    sendError(res, 500, `An error occurred: ${error.message}`);
  }
};

// View user cart
const viewCart = async (req, res) => {
  try {
    const { user_id, guest_id } = req.params;
    let cart;
    if (user_id) {
      cart = await Cart.findOne({ user_id }).populate("items.product_id");
    } else if (guest_id) {
      cart = await Cart.findOne({ guest_id }).populate("items.product_id");
    } else {
      return sendError(
        res,
        400,
        "No valid user or guest information provided."
      );
    }

    if (!cart) return sendError(res, 404, "Cart not found.");
    sendSuccess(res, 200, "Cart retrieved successfully.", cart);
  } catch (error) {
    sendError(res, 500, `An error occurred: ${error.message}`);
  }
};

// Delete from cart
const deleteCartItem = async (req, res) => {
  try {
    const { user_id, product_id, guest_id } = req.body;

    // Validate input
    if (!product_id) return sendError(res, 400, "Product ID is required.");

    let cart;
    if (user_id) {
      cart = await Cart.findOne({ user_id }).populate("items.product_id");
    } else if (guest_id) {
      cart = await Cart.findOne({ guest_id }).populate("items.product_id");
    } else {
      return sendError(
        res,
        400,
        "No valid user or guest information provided."
      );
    }

    if (!cart) return sendError(res, 404, "Cart not found.");

    // Find the product in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product_id._id.toString() === product_id
    );
    if (itemIndex === -1)
      return sendError(res, 404, "Product not found in the cart.");

    // Remove the product from cart
    cart.items.splice(itemIndex, 1);

    // Recalculate total price
    cart.total_price = cart.items.reduce(
      (sum, item) => sum + item.quantity * item.product_id.price,
      0
    );

    // If the cart is empty, remove it
    if (cart.items.length === 0) {
      await Cart.findByIdAndDelete(cart._id);
      return sendSuccess(res, 200, "Cart is empty now.", {});
    }

    await cart.save();
    sendSuccess(res, 200, "Item deleted successfully from the cart.", cart);
  } catch (error) {
    sendError(res, 500, `An error occurred: ${error.message}`);
  }
};

module.exports = { addCart, viewCart, deleteCartItem };
