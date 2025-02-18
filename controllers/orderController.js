const { sendSuccess, sendError } = require("../utils/apiUtils");
const Order = require("../models/OrderModel");
const Cart = require("./../models/CartModel");
const mongoose = require("mongoose");

// Create order
const createOrder = async (req, res) => {
  try {
    const { user_id, guest_id, shippingAddress} = req.body;

    if (!user_id && !guest_id) {
        return res.status(400).json({ message: "User ID or Guest ID is required." });
    }

    const cart = await Cart.findOne({ $or: [{ user_id }, { guest_id }] }).populate("items.product_id");

    if (!cart || cart.items.length === 0) {
        return res.status(400).json({ message: "Cart is empty. Cannot place an order." });
    }

    // Extract items and calculate total price
    const items = cart.items.map(item => ({
        product_id: item.product_id._id,
        quantity: item.quantity,
        price_at_purchase: item.product_id.price, // Store product price at purchase
    }));

    const totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.product_id.price, 0);

    // Create new order
    const newOrder = new Order({
        user_id: user_id || null,
        guest_id: guest_id || null,
        shippingAddress,
        items,
        totalPrice,
        status: "Pending",
    });

    await newOrder.save();

    // Clear the cart after order is placed
    await Cart.findOneAndDelete({ $or: [{ user_id }, { guest_id }] });

    // Send success response with order details
    sendSuccess(
      res,
      201,
      "Order created successfully and cart cleared.",
      newOrder
    );
  } catch (error) {
    sendError(res, 500, `Error creating order: ${error.message}`);
  }
};

//Fetch Orders for a Specific User
const getUserOrders = async (req, res) => {
    try {
      const { user_id } = req.params;
      const orders = await Order.find({ user_id }).populate("items.product_id");
  
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// get all orders
const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin")
        return sendError(res, 403, "Access denied: Admins only");

    const orders = await Order.find().populate("items.product_id user_id");
    sendSuccess(
      res,
      200,
      "Orders retrieved successfully",
      orders
    );
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

//get all orders
const getTotalOrder = async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return sendError(res, 403, "Access denied: Admins only");

    const totalOrders = await Order.countDocuments();
    sendSuccess(res, 200, "Total orders count retrieved", { totalOrders });
  } catch (error) {
    sendError(res, 500, `Error fetching order count: ${error.message}`);
  }
};

// update order status
const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin")
        return sendError(res, 403, "Access denied: Admins only");

    const order_id = req.params.orderId;
    const { status } = req.body;

    const order = await Order.findById(order_id);
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      order.status = status;
      order.updatedAt = Date.now();
      await order.save();

    sendSuccess(res, 200, "Order status updated successfully", order);
  } catch (error) {
    sendError(res, 500, error.message);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
  getTotalOrder,
  updateOrderStatus
};
