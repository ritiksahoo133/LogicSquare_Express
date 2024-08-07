const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  _from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  _to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  _conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },

  text: { type: String, required: true, trim: true },

  date: { type: Date, required: true },

  isread: { type: Boolean, required: true, default: false },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
