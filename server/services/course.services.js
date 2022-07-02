const Course = require("../models/Course.model");
const cloudinary = require("../utilities/cloudinary");

// create new courses
const createCourseService = async (req, res) => {
  const { name, description, category } = req.body;
  let newCourse;

  // if (!(name && description && category)) {
  //   return res.status(404).json({ message: "Invalid credential2" });
  // }

  const result = await cloudinary.uploader.upload(req.file.path);
  newCourse = new Course({
    name,
    description,
    category,
    image: result.secure_url,
    instructor: req.profile.userId,
    cloudinary_id: result.public_id,
  });

  return await newCourse.save();
};

// lessons service
const getLessonByIdService = (req, res) => {
  const lessonId = req.params.lessonId;
  const course = req.course;
  return course.lessons.id(lessonId);
};
module.exports = { createCourseService, getLessonByIdService };
