const Product = require("../models/product.model");
const cloudinary = require("../utilities/cloudinary");

const createProductService = async (req, res) => {
  const { name, description, category, quantity, price } = req.body;
  let newProduct;

  // if (!(name && description && category)) {
  //   return res.status(404).json({ message: "Invalid credential2" });
  // }

  const result = await cloudinary.uploader.upload(req.file.path);
  newProduct = new Product({
    name,
    description,
    category,
    quantity,
    shop: req.profile._id,
    price,
    image: result.secure_url,
    instructor: req.profile.userId,
    cloudinary_id: result.public_id,
  });

  return await newProduct.save();
};

module.exports = { createProductService };
