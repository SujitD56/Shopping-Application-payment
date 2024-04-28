const customerService = require("../service/customerService");
const mongoose = require("mongoose");

exports.getCustomerPurchasedProductsTotalPrice = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { purchasedProducts, totalPrice } =
      await customerService.getCustomerPurchasedProductsTotalPrice({
        _id: new mongoose.Types.ObjectId(customerId),
      });
    res.json({ purchasedProducts, totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
