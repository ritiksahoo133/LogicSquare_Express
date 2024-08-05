const mongoose = require("mongoose");

const unreadCountSchema = new mongoose.Schema({
  _conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  count: {
    type: Number,
    dafault: 0,
  },
});

const UnreadCount = mongoose.model("UnreadCount", unreadCountSchema);
module.exports = UnreadCount;
