const express = require("express");
const orderRouter = express.Router();
const {createOrder, getAllOrders, getOrderById, updateOrderStatus, deleteOrder} = require("./../controllers/orderController")
const {createOrderItem} = require("./../controllers/orderItemsController")

orderRouter.post('/', createOrder);

orderRouter.get('/', getAllOrders);

orderRouter.get('/viewOrderDetails/:orderId', getOrderById);

orderRouter.put('/updateOrderStatus/:orderId', updateOrderStatus);

orderRouter.delete('/deleteOrder/:orderId', deleteOrder);

// orderRouter.post("/order-items", createOrderItem);

module.exports = orderRouter;
