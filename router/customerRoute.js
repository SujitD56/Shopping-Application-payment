const express = require("express");
const router = express.Router();
const customerControllers = require("../controller/customerController");
const productControllers = require("../controller/productController");
const purchaseControllers = require("../controller/purchaseController");
const cartController = require("../controller/cartController");
const { handlePayment, handleWebhook } = require("../payment/webhookhandler");

router.post("/customers", customerControllers.createCustomer);

router.post("/products", productControllers.createProduct);

router.get(
  "/total-price/:customerId",
  purchaseControllers.getCustomerPurchasedProductsTotalPrice
);

router.post("/add-to-cart", cartController.addToCart);

router.get("/cart-items", cartController.listCartItems);

router.post("/create-order", cartController.createOrder);

router.use("/getOrderAmount", cartController.getOrderAmount);

router.post("/api/payment", handlePayment);

router.post("/payment/success", handleWebhook("success"));

router.post("/payment/failed", handleWebhook("failed"));

module.exports = router;
