const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  phoneno: {
    type: Number,
    required: true,
  },
  purchasedproducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});

module.exports = mongoose.model("customers", customerSchema);
