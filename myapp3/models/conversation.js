const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
  _participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  lastMessageDate: { type: Date },
  lastMessageText: { type: String },
  _sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  unreadcount: { type: Number, default: 0, required: true },
});

conversationSchema.pre("save", function (next) {
  if (this._participants.length !== 2) {
    return next(new Error("must have exactly two participants"));
  }
  next();
});

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
