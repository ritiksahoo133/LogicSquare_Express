const stripe = require("stripe")(
  "sk_test_51Pt2xx1xyS6eHcGHSrfLdSfyQQESKMatwXTA28TYmUMCXpnI2zjv1auMtdIZSyV771lqArWjZlXzFXE9yt87mbdS00ypiNeR0x"
);

module.exports = {
  //create customer
  async createCustomer(req, res) {
    const { username, useremail } = req.body;
    try {
      const customer = await stripe.customers.create({
        name: username,
        email: useremail,
      });
      return res.status(200).json({ customerId: customer.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async createPayment(req, res) {
    const { paymentMethodId, customerId } = req.body;

    try {
      // Attach the payment method to the customer
      const info = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
      });

      res.status(200).json(info);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
