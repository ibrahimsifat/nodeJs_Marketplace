const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const cloudinary = require("../utilities/cloudinary");

const createUserService = async (req, res) => {
  let newUser;
  // const user = new User(req.body);
  if (req.body.password.length < 6) {
    return res.status(403).json({ message: "password too short" });
  }
  // hashing password.(registration)
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  // Upload image to cloudinary
  console.log(req.files);
  const result = await cloudinary.uploader.upload(req.file.path);
  newUser = new User({
    ...req.body,

    avatar: result.secure_url,
    // cloudinary_id: result.public_id,
    password: hashedPassword,
  });

  return await newUser.save();
};
module.exports = { createUserService };
