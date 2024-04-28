const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customers",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
  ],
});
module.exports = mongoose.model("carts", cartSchema);
