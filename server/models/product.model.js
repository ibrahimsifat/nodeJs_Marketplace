const { default: mongoose } = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is required",
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    category: {
      type: String,
    },
    quantity: {
      type: Number,
      required: "Quantity is required",
    },
    price: {
      type: Number,
      required: "Price is required",
    },
    shop: {
      type: mongoose.Schema.ObjectId,
      ref: "Shop",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
