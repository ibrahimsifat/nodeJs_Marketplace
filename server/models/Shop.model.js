const { default: mongoose } = require("mongoose");

const shopSchema = new mongoose.Schema(
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

    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);
module.exports = Shop;
