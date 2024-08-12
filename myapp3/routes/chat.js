const express = require("express");
const router = express.Router();
const User = require("../models/users");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const authJwtMiddleware = require("../middleware/authmiddlewire");

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

router.post("/sendmessage", authJwtMiddleware, async (req, res) => {
  const userId = req.user._id;
  const user = await User.findOne({ _id: userId });
  if (user === null)
    return res.status(400).json({ error: true, reason: "user not found" });
  try {
    const { _to, text } = req.body;
    // check user exist or not
    const toUser = await User.findOne({ _id: _to });
    if (toUser === null)
      return res.status(404).json({ message: "user not exists", error: true });

    const conversation = await createConversation(userId, _to);
    const messageData = {
      _from: userId,
      _to: _to,
      text: text,
      date: new Date(),
      _conversation: conversation._id,
      isread: false,
    };

    const response = await Message.create(messageData);
    console.log(conversation._sentBy);
    //update Conversation count
    conversation.lastMessageDate = response.date;
    conversation.lastMessageText = response.text;

    //check if message is send by receiver
    if (String(conversation._sentBy) === String(response._to)) {
      conversation.unreadcount = 0;
      const message = await Message.updateMany(
        { _from: _to, _to: userId },
        { $set: { isread: true } }
      );
      console.log(message);
    }
    conversation._sentBy = userId;
    conversation.unreadcount += 1;

    await conversation.save();

    return res.status(200).json({
      response,
      conversation,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/getmessage", authJwtMiddleware, async (req, res) => {
  try {
    const { conversationId } = req.body;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
    });
    if (String(conversation._sentBy) !== String(userId)) {
      await Message.updateMany(
        {
          _to: userId,
          _conversation: conversationId,
          isread: false,
        },
        { $set: { isread: true } }
      );
      conversation.unreadcount = 0;
      conversation.save();
    }
    const message = await Message.find({ _conversation: conversationId });
    return res.status(200).json({ message, conversation, error: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  
  try {
    const messageId = req.params.id;
    const { _from, _conversation } = req.body;

    const message = await Message.findOneAndDelete({
      _id: messageId,
      _from: _from,
    });
    if (message === null)
      return res.status(404).json({ Error: "message not found", error: true });

    const conversation = await Conversation.findOne({
      _id: _conversation,
    });
    console.log(conversation);

    if (
      String(conversation._sentBy) === String(_from) &&
      conversation.unreadcount > 0
    ) {
      conversation.unreadcount -= 1;
      await conversation.save();
    }
    return res.status(200).json({ message, conversation, error: false });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
});

router.put("/:id", async (req, res) => {});
module.exports = router;
