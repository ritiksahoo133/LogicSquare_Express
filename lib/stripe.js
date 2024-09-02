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
        customer: "cus_Qm1SzK4ccKxHTR", // Customer ID
        description: "Charge for ritiksahoo133@gmail.com",
        transfer_data: {
          destination: "",
        },
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
        confirm: true,
        payment_method: paymentMethodId,
        customer: customerId,

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

  async createAccount(req, res) {
    try {
      const account = await stripe.accounts.create({
        email: "ritik@logic-square.com",
        country: "US",
        controller: {
          fees: {
            payer: "application",
          },
          losses: {
            payments: "application",
          },
          stripe_dashboard: {
            type: "express",
          },
        },
        capabilities: {
          transfers: {
            requested: true,
          },
          card_payments: { requested: true },
        },
      });
      return res.status(200).json(account);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async deleteAccount(req, res) {
    const { accountId } = req.body;
    try {
      await stripe.accounts.del(accountId);
      return res.status(200).json("account deleted");
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async accountLinkFunc(req, res) {
    const { accountID } = req.body;
    try {
      const accountLink = await stripe.accountLinks.create({
        account: accountID,
        refresh_url: "http://localhost:3000/api/v1/reauth",
        return_url: "http://localhost:3000/api/v1/return",
        type: "account_onboarding",
      });
      return res.status(200).json(accountLink);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async verifyAccountStatus(req, res) {
    const { accountID } = req.body;
    try {
      const account = await stripe.accounts.retrieve(accountID);
      if (account.charges_enabled && account.payouts_enabled) {
        res.status(200).json({ status: "Account is fully onboarded" });
      } else {
        res.status(400).json({ status: "Account is not fully onboarded" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async createCheckoutSession(req, res) {
    try {
    } catch (error) {}
  },
  onboardingComplete(req, res) {
    res.send("Onboarding complete! Thank you for completing the setup.");
  },
  reauth(req, res) {
    // Inform users they need to re-authenticate or provide additional information
    res.send("Please re-authenticate or provide additional information.");
  },
};
