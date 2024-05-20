const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../module/order");

const razorpay = new Razorpay({
  key_id: "rzp_test_5UMsWt7fVglSw5",
  key_secret: "Rs1d6jUhqc6bWQWEOF0whj5L",
});

exports.handlePayment = async (req, res, next) => {
  try {
    const paymentData = req.body.paymentData;
    if (!paymentData || !paymentData.amount) {
      throw new Error("The 'amount' field is required.");
    }

    console.log("Payment Data:", paymentData);
    const razorpayResponse = await razorpay.orders.create(paymentData);
    console.log("Razorpay Response:", razorpayResponse);

    res.json(razorpayResponse);
  } catch (error) {
    console.error("Error processing payment:", error);
    next(error);
  }
};

exports.handleWebhook = (type) => {
  return async (req, res, next) => {
    // req.body.payload.razorpay_signature;
    try {
      const signature =
        req.headers["x-razorpay-signature"] ||
        req.headers["X-Razorpay-Signature"];
      const requestBody = req.body;
      console.log("Received webhook payload:", requestBody);
      // console.log("Received headers:", req.headers);
      console.log("Received webhook signature:", signature);

      if (!signature) {
        console.error("Webhook signature missing");
        return res.status(400).json({ message: "Webhook signature missing" });
      }
      const secret = "12345"; // Replace with your actual webhook secret provided by Razorpay
      const hmac = crypto.createHmac("sha256", secret);
      const calculatedSignature = hmac
        .update(JSON.stringify(requestBody))
        .digest("hex");
      console.log("Calculated signature:", calculatedSignature);

      if (signature === calculatedSignature) {
        console.log("webhook signature");
        return res.status(200).json({ message: "webhook signature" });
      }

      const { event, payload } = req.body;
      console.log(`Received Razorpay Webhook (${type}):`, event, payload);

      // Handle webhook event type
      if (type === "success" && event === "payment.captured") {
        console.log("Payment captured:", payload);
        // logic for successful payments goes here
      } else if (type === "failed" && event === "payment.failed") {
        console.log("Payment failed:", payload);
      }

      res
        .status(200)
        .json({ message: `Webhook received and verified (${type})` });
    } catch (error) {
      console.error(`Error handling webhook (${type}):`, error);
      next(error);
    }
  };
};
