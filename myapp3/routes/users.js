var express = require("express");
var router = express.Router();
const User = require("../models/users");
const Message = require("../models/message");

router.post("/createUser", async (req, res) => {
  try {
    const user = req.body;

    const response = await User.create({
      username: user.username,
      password: user.password,
      email: user.email,
      lastLoggedInDate: Date.now(),
    });

    return res.status(200).json({ response, error: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
router.get("/getUser/:id", async (req, res) => {});

router.post("/sendMessage", async (req, res) => {
  try {
    const { from, to, text } = req.body;
    const messageData = {
      from: from,
      to: to,
      text: text,
      date: Date.now(),
      status: "unseen",
    };

    const fromUser = await User.findOne({ _id: to });
    const toUser = await User.findOne({ _id: from });

    if (fromUser === null || toUser === null)
      return res.status(404).json({ message: "user not exists", error: true });

    const response = await Message.create(messageData);

    fromUser.lastMessageTime = date;
    const updateUserLastMessageTime = await fromUser.save();

    return res.status(200).json({ response, error: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
