
const { sendSuccess, sendError } = require('../utils/apiUtils');
const Orders = require('../models/OrderModel');
const Cart = require("./../models/CartModel");
const mongoose = require('mongoose');

// Create order
const createOrder = async (req, res) => {
    try {
        const { user_id, guest_id, shippingAddress, totalPrice } = req.body;

        // Ensure either user_id or guest_id is provided
        if (!user_id && !guest_id) {
            return sendError(res, 400, "Either user_id (for logged-in users) or guest_id (for guest users) is required.");
        }

        // Determine the final user identifier (either logged-in user or guest)
        const finalUserId = user_id || guest_id;

        // Fetch the cart based on user_id or guest_id
        let cartQuery = user_id ? { user_id } : { guest_id };
        const cart = await Cart.findOne(cartQuery).populate('items.product_id');

        if (!cart) {
            return sendError(res, 404, "Cart not found.");
        }

        // Prepare the items for the order
        const orderItems = cart.items.map(item => ({
            product_id: item.product_id._id,
            quantity: item.quantity,
            price_at_purchase: item.product_id.price // Store the price at the time of purchase
        }));

        // Create the order
        const newOrder = new Orders({
            user_id: finalUserId, 
            shippingAddress,
            totalPrice,
            items: orderItems,
        });

        // Save the order to the database
        await newOrder.save();

        // Clear the cart after successful order creation
        cart.items = [];
        cart.total_price = 0;
        await cart.save();

        // Send success response with order details
        sendSuccess(res, 201, 'Order created successfully and cart cleared.', newOrder);
    } catch (error) {
        sendError(res, 500, `Error creating order: ${error.message}`);
    }
};


// get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Orders.find();

        // For each order, check if the user_id is a valid ObjectId (registered user) or a guest
        const ordersWithUserDetails = await Promise.all(
            orders.map(async (order) => {
                // If the user_id is a valid ObjectId, populate user details
                if (mongoose.Types.ObjectId.isValid(order.user_id)) {
                    // Populate user details (only for registered users)
                    const populatedOrder = await order.populate('user_id', 'name email');
                    return populatedOrder;
                } else {
                    // For guest users, return the order without user details
                    return order;
                }
            })
        );

        sendSuccess(res, 200, 'Orders retrieved successfully', ordersWithUserDetails);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

//get all orders
const getTotalOrder = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return sendError(res, 403, "Access denied: Admins only");

        const totalOrders = await Orders.countDocuments();
        sendSuccess(res, 200, "Total orders count retrieved", { totalOrders });
    } catch (error) {
        sendError(res, 500, `Error fetching order count: ${error.message}`);
    }
}

// get order by id
const getOrderById = async (req, res) => {
    try {
        const id = req.params.orderId;
        // Find the order by ID
        const order = await Orders.findById(id);
        if (!order) return sendError(res, 404, 'Order not found');

        // Check if the user_id is a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(order.user_id)) {
            // Populate user details for registered users
            await order.populate('user_id', 'name email');
        }

        // Get the total count of orders
        const totalOrders = await Orders.countDocuments();

        sendSuccess(res, 200, 'Order retrieved successfully', {
            totalOrders,
            order,
        });
    } catch (error) {
        sendError(res, 500, error.message);
    }
};


// update order status
const updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.orderId;
        const { status } = req.body;

        // Validate `status` against allowed values
        const allowedStatuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
        if (!allowedStatuses.includes(status)) {
            return sendError(res, 400, `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`);
        }

        const order = await Orders.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!order) return sendError(res, 404, 'Order not found');
        sendSuccess(res, 200, 'Order status updated successfully', order);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

// delete an order
const deleteOrder = async (req, res) => {
    try {
        const id = req.params.orderId;
        const order = await Orders.findByIdAndDelete(id);
        if (!order) return sendError(res, 404, 'Order not found');
        sendSuccess(res, 200, 'Order deleted successfully');
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {createOrder, getAllOrders, getTotalOrder, getOrderById, updateOrderStatus, deleteOrder}

