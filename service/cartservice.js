const Customer = require("../module/customer");
const Cart = require("../module/cartmodule");
const Order = require("../module/order");

exports.addToCart = async (customerId, productId) => {
  try {
    const customer = await Customer.findById(customerId);

    if (!customer) {
      throw new Error("Customer not found");
    }
    const cartItem = {
      productId: productId,
    };

    let cart = await Cart.findOne({ customerId: customerId });
    if (!cart) {
      cart = new Cart({ customerId: customerId, products: [] });
    }
    cart.products.push(productId);
    await cart.save();

    return { success: true, message: "Product added to cart successfully" };
  } catch (error) {
    console.error("Error adding product to cart:", error);
    throw new Error("Failed to add product to cart");
  }
};

exports.listCartItems = async (customerId) => {
  try {
    if (!customerId) {
      throw new Error("Customer ID is missing");
    }
    const customer = await Customer.findOne({ _id: customerId });
    console.log(customer);

    if (!customer) {
      throw new Error("Customer not found");
    }
    const cart = await Cart.findOne({ customerId }).populate("products");
    if (!cart) {
      return [];
    }
    return cart.products;
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    throw new Error("Failed to retrieve cart items");
  }
};

exports.createOrder = async (cartId) => {
  try {
    const cart = await Cart.findOne({ _id: cartId }).populate("products");
    console.log("Retrieved cart:", cart);

    if (!cart) {
      throw new Error("Cart not found");
    }

    let totalAmount = 0;

    // Ensure products array exists in cart
    if (!cart.products || cart.products.length === 0) {
      throw new Error("No products found in the cart");
    }

    // Calculate total amount of products
    cart.products.forEach((product) => {
      if (typeof product.price === "number" && !isNaN(product.price)) {
        console.log(`Adding ${product.price} to total amount`);
        totalAmount += product.price;
      } else {
        console.warn(`Invalid price for product: ${product._id}`);
      }
    });

    console.log("Total amount calculated:", totalAmount);

    // Create new order object
    const newOrder = new Order({
      cartId: cart._id,
      customerId: cart.customerId,
      products: cart.products,
      totalAmount: totalAmount, // Add total amount to the order
    });

    // Save the order
    const savedOrder = await newOrder.save();
    console.log("Saved order:", savedOrder);

    const response = {
      orderId: savedOrder._id,
      cartId: savedOrder.cartId,
      customerId: savedOrder.customerId,
      products: savedOrder.products,

      totalAmount: savedOrder.totalAmount,
    };

    return response;
    // return savedOrder._id;
  } catch (error) {
    console.error("Error creating order:", error.message);
    throw new Error("Error creating order");
  }
};

exports.getOrderDetails = async (userId) => {
  try {
    const order = await Order.findOne({ customerId: userId }).populate(
      "products"
    );
    if (!order) {
      throw new Error("Order not found for the user");
    }
    const totalAmount = calculateTotalAmount(order.products); // Calculate total amount from order items
    return { totalAmount, purchasedItems: order.products };
  } catch (error) {
    throw new Error("Error retrieving order details: " + error.message);
  }
};

function calculateTotalAmount(orderProducts) {
  let total = 0;
  for (const product of orderProducts) {
    total += product.price; 
  }
  return total;
}
