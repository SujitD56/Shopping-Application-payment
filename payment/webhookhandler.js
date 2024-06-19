// const Razorpay = require("razorpay");
// const crypto = require("crypto");
// const Payment = require("../module/paymentmodule");
// const WebhookEvent = require("../module/Webookmodule");
// const razorpay = new Razorpay({
//   key_id: "rzp_test_5UMsWt7fVglSw5", // Replace with your actual Razorpay key ID
//   key_secret: "Rs1d6jUhqc6bWQWEOF0whj5L", // Replace with your actual Razorpay key secret
// });
// exports.handlePayment = async (req, res, next) => {
//   try {
//     const paymentData = req.body.paymentData;
//     if (!paymentData || !paymentData.amount) {
//       throw new Error("The 'amount' field is required.");
//     }
//     console.log("Payment Data:", paymentData);
//     const razorpayResponse = await razorpay.orders.create(paymentData);
//     console.log("Razorpay Response:", razorpayResponse);
//     const paymentDetails = {
//       amount: razorpayResponse.amount,
//       currency: razorpayResponse.currency,
//       order_id: razorpayResponse.id,
//       status: razorpayResponse.status,
//     };
//     const payment = new Payment(paymentDetails);
//     await payment.save();
//     res.json(razorpayResponse);
//   } catch (error) {
//     console.error("Error processing payment:", error);
//     next(error);
//   }
// };
// exports.handleWebhook = async (req, res, next) => {
//   try {
//     const signature = req.headers["x-razorpay-signature"];
//     const requestBody = req.body;
//     console.log("Received webhook payload:", requestBody);
//     console.log("Received webhook signature:", signature);
//     if (!signature) {
//       console.error("Webhook signature missing");
//       return res.status(400).json({ message: "Webhook signature missing" });
//     }
//     const secret = "12345"; // Replace with your actual webhook secret provided by Razorpay
//     const hmac = crypto.createHmac("sha256", secret);
//     const calculatedSignature = hmac
//       .update(JSON.stringify(requestBody))
//       .digest("hex");
//     console.log("Calculated signature:", calculatedSignature);
//     if (signature !== calculatedSignature) {
//       console.error("Webhook signature verification failed");
//       return res
//         .status(400)
//         .json({ message: "Webhook signature verification failed" });
//     }
//     console.log("Webhook signature verified");
//     const { event, payload } = requestBody;
//     console.log("Received Razorpay Webhook Event:", event, payload);
//     if (event === "payment.captured") {
//       const { order_id, id } = payload.payment.entity;
//       const updatedPayment = await Payment.findOneAndUpdate(
//         { order_id },
//         { payment_id: id, status: "success" },
//         { new: true }
//       );
//       console.log("Payment captured:", updatedPayment);
//       return res
//         .status(200)
//         .json({ status: "success", payment: updatedPayment });
//     } else if (event === "payment.failed") {
//       const { order_id } = payload.payment.entity;
//       const updatedPayment = await Payment.findOneAndUpdate(
//         { order_id },
//         { status: "failed" },
//         { new: true }
//       );
//       console.log("Payment failed:", updatedPayment);
//       return res
//         .status(200)
//         .json({ status: "failed", payment: updatedPayment });
//     }
//     const webhookEvent = new WebhookEvent({
//       event: event,
//       payload: payload,
//       signature: signature,
//       calculatedSignature: calculatedSignature,
//     });
//     await webhookEvent.save();
//     res.status(200).json({ message: "Webhook received and processed" });
//   } catch (error) {
//     console.error("Error handling webhook:", error);
//     next(error);
//   }
// };

const Razorpay = require("razorpay");
const crypto = require("crypto");
const Payment = require("../module/paymentmodule");
const Orderpaid = require("../module/orderpaidmodule");
const WebhookEvent = require("../module/Webookmodule");
const { status } = require("init");
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
    const paymentDetails = {
      amount: razorpayResponse.amount,
      currency: razorpayResponse.currency,
      order_id: razorpayResponse.id,
      status: razorpayResponse.status,
    };
    const payment = new Payment(paymentDetails);
    await payment.save();
    res.json(razorpayResponse);
  } catch (error) {
    console.error("Error processing payment:", error);
    next(error);
  }
};
exports.handleWebhook = async (req, res, next) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    const requestBody = req.body;
    console.log("Received webhook payload:", requestBody);
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
    if (signature !== calculatedSignature) {
      console.error("Webhook signature verification failed");
      return res
        .status(400)
        .json({ message: "Webhook signature verification failed" });
    }
    console.log("Webhook signature verified");
    const { event, payload } = requestBody;
    console.log("Received Razorpay Webhook Event:", event, payload);
    if (event === "payment.captured") {
      const { order_id, id } = payload.payment.entity;
      const updatedPayment = await Payment.findOneAndUpdate(
        { order_id },
        { payment_id: id, status: "success" },
        { new: true }
      );
      console.log("Payment captured:", updatedPayment);
      return res
        .status(200)
        .json({ status: "success", payment: updatedPayment });
    } else if (event === "order.paid") {
      const { id, amount, amount_paid, amount_due, currency, receipt } =
        payload.order.entity;
      const orderPaidDetails = {
        order_id: id,
        amount,
        amount_paid,
        amount_due,
        currency,
        receipt,
        status: "paid",
      };
      const orderPaid = new Orderpaid(orderPaidDetails);
      await orderPaid.save();
      console.log("Order paid:", orderPaid);
      return res.status(200).json({ status: "paid", orderPaid });
    } else if (event === "payment.failed") {
      const { order_id } = payload.payment.entity;
      const updatedPayment = await Payment.findOneAndUpdate(
        { order_id },
        { status: "failed" },
        { new: true }
      );
      console.log("Payment failed:", updatedPayment);
      return res
        .status(200)
        .json({ status: "failed", payment: updatedPayment });
    }
    const webhookEvent = new WebhookEvent({
      event: event,
      payload: payload,
      signature: signature,
      calculatedSignature: calculatedSignature,
    });
    await webhookEvent.save();
    res.status(200).json({ message: "Webhook received and processed" });
  } catch (error) {
    console.error("Error handling webhook:", error);
    next(error);
  }
};
