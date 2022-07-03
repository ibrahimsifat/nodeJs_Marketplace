const { default: mongoose } = require("mongoose");

// Cart Schema
const CartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.ObjectId, ref: "Product" },
  quantity: Number,
  shop: { type: mongoose.Schema.ObjectId, ref: "Shop" },
  status: {
    type: String,
    default: "Not processed",
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
});
const CartItem = mongoose.model("CartItem", CartItemSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  customer_name: { type: String, trim: true, required: "Name is required" },
  customer_email: {
    type: String,
    trim: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  ordered_by: { type: mongoose.Schema.ObjectId, ref: "User" },
  delivery_address: {
    street: { type: String, required: "Street is required" },
    city: { type: String, required: "City is required" },
    state: { type: String },
    zipcode: { type: String, required: "Zip Code is required" },
    country: { type: String, required: "Country is required" },
  },
  payment_id: {},
  products: [CartItemSchema],
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
