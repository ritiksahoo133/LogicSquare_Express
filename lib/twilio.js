require("dotenv").config();
const twilio = require("twilio");
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio("AC235a7bb15e1cd9d6b35d152bc18d8bde", authToken);

module.exports = {
  // send sms
  async sendsms(req, res) {
    const { body, from, to } = req.body;
    try {
      const message = await client.messages.create({
        body,
        from,
        to,
      });
      return res.status(201).json(message);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  // fetch sms
  async fetchMessage(req, res) {
    const { Sid } = req.params;
    try {
      const message = await client.messages(Sid).fetch();
      return res.status(200).json(message.body);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  //get multiple message
  async getmultipleMessage(req, res) {
    const { to } = req.body;
    try {
      const messages = await client.messages.list();
      messages.map((message) => {
        return res.status(200).json(message.body);
      });
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },
};
