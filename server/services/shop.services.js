const Shop = require("../models/Shop.model");
const cloudinary = require("../utilities/cloudinary");

const createShopService = async (req, res) => {
  const { name, description } = req.body;
  let newShop;

  // if (!(name && description && category)) {
  //   return res.status(404).json({ message: "Invalid credential2" });
  // }

  const result = await cloudinary.uploader.upload(req.file.path);
  newShop = new Shop({
    name,
    description,
    owner: req.profile.userId,
    image: result.secure_url,
    instructor: req.profile.userId,
    cloudinary_id: result.public_id,
  });

  return await newShop.save();
};
module.exports = { createShopService };
