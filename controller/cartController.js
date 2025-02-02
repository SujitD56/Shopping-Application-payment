const CartService = require("../service/cartservice");

exports.addToCart = async (req, res) => {
  try {
    const { customerId, productId } = req.body;
    const result = await CartService.addToCart(customerId, productId);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.listCartItems = async (req, res) => {
  try {
    const customerId = req.query.customerId;
    console.log(customerId);
    const cartItems = await CartService.listCartItems(customerId);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error listing cart items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { cartId } = req.body;
    const orderId = await CartService.createOrder(cartId);

    res.status(201).json({ orderId }); // Respond with the orderId
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderAmount = async (req, res) => {
  try {
    const userId = req.body.userId; // Assuming user ID is sent in the request body
    console.log(userId);
    const orderDetails = await CartService.getOrderDetails(userId);
    res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Error retrieving order details:", error);
    res.status(500).json({ message: "Failed to retrieve order details" });
  }
};
