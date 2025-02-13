const express = require("express");
const orderRouter = express.Router();
const {createOrder, getAllOrders, getTotalOrder, getOrderById, updateOrderStatus, deleteOrder} = require("./../controllers/orderController")
const {createOrderItem} = require("./../controllers/orderItemsController");
const verifyToken = require("../middlewares/verifyToken");

orderRouter.post('/', createOrder);

orderRouter.get('/', getAllOrders);

orderRouter.get('/totalOrder',verifyToken, getTotalOrder);

orderRouter.get('/viewOrderDetails/:orderId', getOrderById);

orderRouter.put('/updateOrderStatus/:orderId', updateOrderStatus);

orderRouter.delete('/deleteOrder/:orderId', deleteOrder);

// orderRouter.post("/order-items", createOrderItem);

module.exports = orderRouter;
