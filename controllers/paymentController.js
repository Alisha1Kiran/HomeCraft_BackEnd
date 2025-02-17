const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("./../models/OrderModel");
const Cart = require("./../models/CartModel");

const createPayment = async (req, res) => {
  try {
    const { amount } = req.body; // Get the total price from the frontend

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount is in the smallest unit (cents for USD)
      currency: "usd", // Change to your currency
      metadata: { integration_check: "accept_a_payment" },
    });

    res.json({ clientSecret: paymentIntent.client_secret }); // Send the client secret to frontend
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, user_id, guest_id, shippingAddress } = req.body;

    // Get the payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      let cartItems = [];

      if (user_id) {
        cartItems = await Cart.findOne({ user_id }).populate(
          "items.product_id"
        );
      } else if (guest_id) {
        cartItems = await Cart.findOne({ guest_id }).populate(
          "items.product_id"
        );
      }

      // Map cart items to the format required for the order
      const orderItems = cartItems.items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.product_id.price,
      }));

      const totalPrice = cartItems.items.reduce(
        (total, item) => total + item.quantity * item.product_id.price,
        0
      );

      // Create the order in your database
      const newOrder = new Order({
        user_id: user_id || null,
        guest_id: guest_id || null,
        shippingAddress,
        totalPrice,
        items: orderItems,
        status: "Pending",
      });

      // Save the order to the database
      await newOrder.save();

      // Clear the cart after order is placed
    await Cart.findOneAndDelete({ $or: [{ user_id }, { guest_id }] });

      // Return success response
      res.json({ message: "Order placed successfully", order: newOrder });
    } else {
      res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment, confirmPayment };
