const express = require('express');
const paymentRouter = express.Router();
const {createPayment, confirmPayment} = require("./../controllers/paymentController");

// Route to create a payment intent
paymentRouter.post('/create-payment', createPayment);

paymentRouter.post('/confirm-payment', confirmPayment);

module.exports = paymentRouter;
