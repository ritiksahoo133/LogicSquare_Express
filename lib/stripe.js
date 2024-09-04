const Customer = require("../models/stripe/customer");
const Seller = require("../models/stripe/seller");
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
  async deleteCustomer(req, res) {
    const customer = await stripe.customers.del("cus_QkctKx34cQXjEB");
    return res.status(200).json(customer);
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
        amount: 5000,
        currency: "usd",
        customer: "cus_Qm1SzK4ccKxHTR",
        description: "Charge for ritiksahoo133@gmail.com",
        transfer_data: {
          destination: "acct_1PuVjV1NDknVfpPU",
        },
        // application_fee_amount: 2000,
      });
      return res.status(200).json(stripeResponse);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  //create paymentIntent
  async paymentIntent(req, res) {
    const { paymentMethodId, customerId, connectedAccountId } = req.body;
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2000,
        currency: "usd",
        // confirm: true,
        // payment_method: paymentMethodId,
        payment_method_types: ["card"],
        customer: customerId,
        transfer_data: {
          destination: connectedAccountId,
        },
        metadata: {
          customer_id: customerId,
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
  // async createCheckoutSession(req, res) {
  //   try {
  //   } catch (error) {}
  // },

  async checkout(req, res) {
    const { accountId } = req.body;
    try {
      const session = await stripe.checkout.sessions.create(
        {
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "T-shirt",
                },
                unit_amount: 1000,
              },
              quantity: 1,
            },
          ],
          payment_intent_data: {
            application_fee_amount: 123,
          },
          mode: "payment",
          success_url: "http://localhost:3000/api/v1/success",
        },
        {
          stripeAccount: accountId,
        }
      );
      return res.status(200).json(session);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  async refund(req, res) {
    const { CONNECTED_ACCOUNT_ID, paymentintentId } = req.body;
    try {
      const refund = await stripe.refunds.create(
        {
          charge: "ch_3PupMK1xyS6eHcGH0e3J9I2h",
          refund_application_fee: true,
        },
        {
          stripeAccount: CONNECTED_ACCOUNT_ID,
        }
      );
      return res.status(200).json(refund);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  success(req, res) {
    res.send("success");
  },
  cancel(req, res) {
    res.send("cancel");
  },

  onboardingComplete(req, res) {
    res.send("Onboarding complete! Thank you for completing the setup.");
  },
  reauth(req, res) {
    // Inform users they need to re-authenticate or provide additional information
    res.send("Please re-authenticate or provide additional information.");
  },
  async createprice(req, res) {
    try {
      const price = await stripe.prices.create({
        currency: "usd",
        unit_amount: 1000,
        recurring: {
          interval: "month",
        },
        product_data: {
          name: "Gold Plan",
        },
      });
      return res.status(200).json(price);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  async getConnectedAccountBalance(req, res) {
    const { connectedAccountId } = req.body;

    try {
      const balance = await stripe.balance.retrieve({
        stripeAccount: connectedAccountId,
      });
      return res.status(200).json(balance);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },
  async transfer(req, res) {
    const { connectedAccountId } = req.body;
    try {
      const transfer = await stripe.transfers.create({
        amount: 4000,
        currency: "usd",
        destination: connectedAccountId,
      });
      return res.status(200).json(transfer);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  async createPayout(req, res) {
    const { destinationAccountId } = req.body;

    try {
      // Create a payout
      const payout = await stripe.payouts.create(
        {
          amount: 5000,
          currency: "usd",
        },
        {
          stripeAccount: destinationAccountId,
        }
      );

      return res.status(200).json(payout);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  async createuser(req, res) {
    const { name, email } = req.body;
    try {
      const emailExist = await Customer.findOne({ email });
      if (emailExist) {
        return res.status(500).json({ Error: "email already exists" });
      }

      const customer = await stripe.customers.create({
        name,
        email,
      });

      await stripe.customers.createSource(customer.id, {
        source: "tok_visa",
      });
      const response = await Customer.create({
        name,
        email,
        stripeCustomerId: customer.id,
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  async createseller(req, res) {
    const { Email, name } = req.body;
    try {
      const emailExist = await Seller.findOne({ email: Email });
      if (emailExist) {
        return res.status(500).json({ Error: "email already exists" });
      }
      const account = await stripe.accounts.create({
        email: Email,
        country: "US",
        business_profile: {
          name,
          support_email: Email,
        },
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
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: "http://localhost:3000/api/v1/reauth",
        return_url: "http://localhost:3000/api/v1/return",
        type: "account_onboarding",
      });
      const response = await Seller.create({
        stripeAccountId: account.id,
        email: Email,
      });
      return res.status(200).json(response, accountLink);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
  async createProduct(req, res) {},
};
