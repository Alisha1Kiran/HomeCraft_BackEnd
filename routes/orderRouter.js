const express = require("express");
const orderRouter = express.Router();
const {createOrder, getUserOrders, getAllOrders, getTotalOrder, updateOrderStatus} = require("./../controllers/orderController")
const {createOrderItem} = require("./../controllers/orderItemsController");
const verifyToken = require("../middlewares/verifyToken");

orderRouter.post('/', createOrder);

orderRouter.get('/', verifyToken, getAllOrders);

orderRouter.get('/totalOrder',verifyToken, getTotalOrder);

orderRouter.get("/:user_id", verifyToken, getUserOrders);

orderRouter.put('/:orderId', verifyToken, updateOrderStatus);

// orderRouter.get('/viewOrderDetails/:orderId', getOrderById);

// orderRouter.delete('/deleteOrder/:orderId', deleteOrder);

// orderRouter.post("/order-items", createOrderItem);

module.exports = orderRouter;
