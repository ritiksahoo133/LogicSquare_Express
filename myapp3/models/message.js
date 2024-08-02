const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    text: { type: String, required: true, trim: true },

    date: { type: Date, default: Date.now(), required: true },

    status: {
      type: String,
      enum: ["seen", "unseen"],
      default: "unseen",
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
