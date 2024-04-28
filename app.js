const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const path = require("path");
const crypto = require("crypto");
const bodyParser = require("body-parser");

const app = express();

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

mongoose.connect("mongodb://localhost:27017/custshop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import routes
const customerRoute = require("./router/customerRoute");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use("/api/", customerRoute);

const razorpay = new Razorpay({
  key_id: "rzp_test_5UMsWt7fVglSw5",
  key_secret: "Rs1d6jUhqc6bWQWEOF0whj5L",
});

// Set the views directory and view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Endpoint to handle payment
app.post("/api/payment", async (req, res, next) => {
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
});

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to handle successful payment webhook
app.post("/payment/success", handleWebhook("success"));

// Endpoint to handle failed payment webhook
app.post("/payment/failed", handleWebhook("failed"));

// Assuming you have imported the necessary modules and defined the required functions

function handleWebhook(type) {
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
}

// Route to render the index.ejs file
app.get("/", (req, res) => {
  res.render("index");
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
