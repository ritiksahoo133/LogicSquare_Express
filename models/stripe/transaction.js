const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    _customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    _productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    quantity: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Transaction", transactionSchema);
