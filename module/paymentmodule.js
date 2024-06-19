const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    payment_id: { type: String },
    order_id: { type: String, required: true },
    status: { type: String, default: "created" },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("PaymentDetails", PaymentSchema);
