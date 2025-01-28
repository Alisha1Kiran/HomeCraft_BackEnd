const { sendSuccess, sendError } = require('../utils/apiUtils');
const OrderItems = require('../models/OrderItemModel');

// create order items
const createOrderItem = async (req, res) => {
    try {
        const { order_id, product_id, quantity, price } = req.body;

        const newOrderItem = new OrderItems({
            order_id,
            product_id,
            quantity,
            price
        });

        await newOrderItem.save();
        sendSuccess(res, 201, 'Order item created successfully', newOrderItem);
    } catch (error) {
        sendError(res, 500, error.message);
    }
};

module.exports = {createOrderItem};