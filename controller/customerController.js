const Customer = require("../module/customer");

exports.createCustomer = async (req, res) => {
  try {
    const { customer, phoneno, purchasedproducts } = req.body;
    const newCustomer = new Customer({ customer, phoneno, purchasedproducts });
    await newCustomer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
