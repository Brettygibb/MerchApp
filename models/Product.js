const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  count: { type: Number, required: false },
  needed: { type: Number, default: 0 },
  worked: { type: Number, required: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});
const Product = mongoose.model("product", productSchema, "products");

module.exports = Product;
