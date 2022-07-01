const { default: mongoose } = require("mongoose");

const enrollSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
  },
  student: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  lessonStatus: [
    {
      lesson: { type: mongoose.Schema.ObjectId, ref: "Lesson" },
      complete: Boolean,
    },
  ],
  enrolled: {
    type: Date,
    default: Date.now,
  },
  updated: Date,
  completed: Date,
});
const Enrollment = mongoose.model("Enrollment", enrollSchema);
module.exports = Enrollment;
