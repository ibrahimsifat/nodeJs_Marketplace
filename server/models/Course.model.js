const { default: mongoose } = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
    unique: true,
  },
  resource_url: String,
});

const commentSchema = mongoose.Schema({
  comment: {
    type: String,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const courseSchema = new mongoose.Schema(
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
    image: String,

    category: {
      type: String,
      required: "Category is required",
    },
    published: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    lessons: [LessonSchema],
    comments: [commentSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
