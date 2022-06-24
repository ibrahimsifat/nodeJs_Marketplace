const Post = require("../models/Post.model");
const cloudinary = require("../utilities/cloudinary");
const createPostService = async (req, res) => {
  let newPost;
  const text = req.body.text;
  if (!text) {
    return res.status(403).json({ message: "Text not provided" });
  }
  // Upload image to cloudinary
  console.log(req.files);
  const photo = await cloudinary.uploader.upload(req.file.path);
  newPost = new Post({
    text,
    photo: photo.secure_url,
    postedBy: req.profile.userId,
    // cloudinary_id: result.public_id,
  });

  return await newPost.save();
};
module.exports = { createPostService };
