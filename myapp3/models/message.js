const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  _from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  _to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  text: { type: String, required: true, trim: true },

  date: { type: Date, required: true },

  status: {
    type: String,
    enum: ["seen", "unseen"],
    default: "unseen",
    required: true,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
