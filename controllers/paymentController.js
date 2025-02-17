const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPayment = async (req, res) => {
    try {
      const { amount } = req.body; // Get the total price from the frontend
  
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Amount is in the smallest unit (cents for USD)
        currency: 'usd', // Change to your currency
        metadata: { integration_check: 'accept_a_payment' },
      });
  
      res.json({ clientSecret: paymentIntent.client_secret }); // Send the client secret to frontend
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  module.exports = {createPayment}