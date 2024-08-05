const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    password: { type: String, required: true, trim: true },
    lastMessageTime: {
      type: Date,
      default: null,
    },
    lastLoggedInDate: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
