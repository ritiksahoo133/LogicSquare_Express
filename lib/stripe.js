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

  //delete customer
  async retrieveCustomer(req, res) {
    const { customerId } = req.body;
    try {
      const customer = await stripe.customers.retrieve(customerId);
      return res.status(200).json(customer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  //create payment
  async cardAdd(req, res) {
    const { customerId, token } = req.body;
    try {
      const stripeResponse = await stripe.customers.createSource(customerId, {
        source: token,
      });
      return res.status(200).json(stripeResponse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  //delete card
  async deleteCard(req, res) {
    const { customerId, paymentSourceId } = req.body;
    try {
      const deletedSource = await stripe.customers.deleteSource(
        customerId,
        paymentSourceId
      );
      return res.status(200).json(deletedSource);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  //update payment method
  async updateCard(req, res) {
    const { paymentMethodId, customerId } = req.body;
    try {
      const stripeResponse = await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      return res.status(200).json(stripeResponse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // remove card
  async removeCard(req, res) {
    const { paymentMethodId } = req.body;
    try {
      const paymentMethod = await stripe.paymentMethods.detach(paymentMethodId);
      return res.status(200).json(paymentMethod);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  //create charge-->collect payment from customer
  async createCharge(req, res) {
    try {
      const stripeResponse = await stripe.charges.create({
        amount: 50,
        currency: "usd",
        customer: "cus_QkctKx34cQXjEB", // Customer ID
        description: "Charge for customer@example.com",
      });
      return res.status(200).json(stripeResponse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  //create paymentIntent
  async paymentIntent(req, res) {
    const { paymentMethodId, customerId } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: "usd",
        payment_method: paymentMethodId,
        customer: customerId,
        metadata: {
          pname: "Tshirt",
          order_id: "4534",
        },
        description: "create for test purpose",
      });
      return res.status(200).json(paymentIntent);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async confirmpayment(req, res) {
    const { paymentMethodId } = req.body;
    try {
      const stripeResponse = await stripe.paymentIntents.confirm(
        paymentMethodId,
        {
          payment_method: "pm_card_visa",
          return_url: "https://www.example.com",
        }
      );
      return res.status(200).json(stripeResponse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
};
