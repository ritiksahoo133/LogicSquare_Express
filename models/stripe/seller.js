const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    stripeAccountId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
