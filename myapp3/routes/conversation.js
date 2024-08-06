const express = require("express");
const router = express.Router();
const Conversation = require("../models/conversation");

router.get("/getconversation/:id", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: id,
    });
    if (conversation === null)
      return res.status(404).json({ message: "not found", error: true });

    return res.json({ conversation, error: false });
  } catch (error) {
    return res.status(500).json({ Error: error.message });
  }
});

module.exports = router;
