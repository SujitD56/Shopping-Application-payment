const Product = require("../module/product");

exports.createProduct = async (req, res) => {
  try {
    const { product, price } = req.body;
    const newProduct = new Product({ product, price });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
