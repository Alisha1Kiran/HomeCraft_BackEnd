const express = require('express');
const paymentRouter = express.Router();
const {createPayment} = require("./../controllers/paymentController");

// Route to create a payment intent
paymentRouter.post('/create-payment', createPayment);

module.exports = paymentRouter;
