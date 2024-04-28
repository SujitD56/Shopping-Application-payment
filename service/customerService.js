const mongoose = require("mongoose");
// const { ObjectId } = mongoose.Types;
const Customer = require("../module/customer");

// exports.getCustomerPurchasedProductsTotalPrice = async (customerId) => {
//   try {
//     console.log("id", customerId);
//     const totalPriceAggregate = await Customer.aggregate([
//       { $match: customerId },

//       {
//         $lookup: {
//           from: "products",
//           localField: "purchasedproducts",
//           foreignField: "_id",
//           as: "purchasedProductsDetails",
//         },
//       },
//       { $unwind: "$purchasedProductsDetails" },
//       {
//         $group: {
//           _id: null,
//           totalPrice: { $sum: "$purchasedProductsDetails.price" },
//         },
//       },
//     ]);
//     const totalPrice =
//       totalPriceAggregate.length > 0 ? totalPriceAggregate[0].totalPrice : 0;
//     return { totalPrice };
//   } catch (error) {
//     console.error("Error in getCustomerPurchasedProductsTotalPrice:", error);
//     throw new Error("Failed to get customer purchased products total price");
//   }
// };

exports.getCustomerPurchasedProductsTotalPrice = async (customerId) => {
  try {
    const totalPriceAggregate = await Customer.aggregate([
      { $match: customerId },
      {
        $lookup: {
          from: "products",
          localField: "purchasedproducts",
          foreignField: "_id",
          as: "purchasedProductsDetails",
        },
      },
      { $unwind: "$purchasedProductsDetails" },
      {
        $group: {
          _id: "$_id",
          purchasedProducts: { $push: "$purchasedProductsDetails" },
          totalPrice: { $sum: "$purchasedProductsDetails.price" },
        },
      },
      {
        $project: {
          _id: 0,
          "purchasedProducts.product": 1,
          totalPrice: 1,
        },
      },
    ]);

    if (totalPriceAggregate.length === 0) {
      throw new Error("Customer not found");
    }

    const { purchasedProducts, totalPrice } = totalPriceAggregate[0];

    return { purchasedProducts, totalPrice };
  } catch (error) {
    console.error("Error in getCustomerPurchasedProductsTotalPrice:", error);
    throw new Error("Failed to get customer purchased products total price");
  }
};
