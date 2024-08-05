const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const UnreadCount = require("../models/unreadcount");

const createConversation = async (from, to) => {
  let conversation = await Conversation.findOne({
    _participants: { $all: [from, to] },
  });

  if (!conversation) {
    conversation = new Conversation({
      _participants: [from, to],
    });
  }
  await conversation.save();
  return conversation;
};

router.post("/sendmessage", async (req, res) => {
  try {
    const { _from, _to, text } = req.body;
    const messageData = {
      _from: _from,
      _to: _to,
      text: text,
      date: new Date(),
      status: "unseen",
    };

    // check user exist or not
    const fromUser = await User.findOne({ _id: _to });
    const toUser = await User.findOne({ _id: _from });
    if (fromUser === null || toUser === null)
      return res.status(404).json({ message: "user not exists", error: true });

    const conversation = await createConversation(_from, _to);

    const response = await Message.create(messageData);

    fromUser.lastMessageTime = messageData.date;
    await fromUser.save();

    //update Conversation
    conversation.lastMessageDate = response.date;
    conversation.lastMessageText = response.text;
    await conversation.save();

    //update or create unreadCount
    const unreadcount = await UnreadCount.findOneAndUpdate(
      {
        _conversation: conversation._id,
        _user: _to,
      },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    return res
      .status(200)
      .json({ response, conversation, unreadcount, error: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/getmessage/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const response = await Message.find({ _from: userId });
    if (response.length === 0)
      return res
        .status(404)
        .json({ message: "message not found", error: true });

    return res.status(200).json({ response, error: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
