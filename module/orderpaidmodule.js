const mongoose = require("mongoose");

const orderPaidSchema = new mongoose.Schema(
  {
    order_id: { type: String },
    amount: { type: Number, required: true },
    amount_paid: { type: Number, required: true },
    amount_due: { type: Number, required: true },
    status: { type: String, default: "created" },
    currency: { type: String, required: true },
    receipt: { type: String, requoired: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OrderpaidDetails", orderPaidSchema);
