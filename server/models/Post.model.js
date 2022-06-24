const { default: mongoose } = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: "Text is required",
    },
    photo: String,

    postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        postedBy: { type: mongoose.Schema.ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
