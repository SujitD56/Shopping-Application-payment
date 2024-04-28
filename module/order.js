const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "cart",
  },
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "customer",
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  totalAmount: {
    type: Number,
    default: 0,
  },
  razorpay_order_id: {
    type: String,
    ref: "razorpay",
  },
  order_id: {
    type: String,
    ref: "razorpay res",
  },
});

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
