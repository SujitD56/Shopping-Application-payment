const express = require("express");
const router = express.Router();
const customerControllers = require("../controller/customerController");
const productControllers = require("../controller/productController");
const purchaseControllers = require("../controller/purchaseController");
const cartController = require("../controller/cartController");
// const paymentController = require("../controller/paymentController");

router.post("/customers", customerControllers.createCustomer);

router.post("/products", productControllers.createProduct);

router.get(
  "/total-price/:customerId",
  purchaseControllers.getCustomerPurchasedProductsTotalPrice
);

router.post("/add-to-cart", cartController.addToCart);

router.get("/cart-items", cartController.listCartItems);

router.post("/create-order", cartController.createOrder);

// router.get("/", paymentController.handleWebhook);
module.exports = router;
