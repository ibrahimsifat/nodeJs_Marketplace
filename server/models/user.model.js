const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    about: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    cloudinary_id: {
      type: String,
    },
    seller: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
