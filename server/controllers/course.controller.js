const Course = require("../models/Course.model");
const {
  createCourseService,
  getLessonByIdService,
} = require("../services/course.services");
const error = require("../services/error");
const { notFoundHandler } = require("../services/notFoundHandler");

const create = async (req, res, next) => {
  try {
    const newCourse = await createCourseService(req, res);
    res.status(200).json({
      message: "Successfully Added Course up!",
      newCourse,
    });
  } catch (err) {
    next(err);
  }
};
const listByInstructor = (req, res, next) => {
  Course.find({ instructor: req.profile.userId }, (err, courses) => {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    res.json(courses);
  }).populate("instructor", "_id name");
};

const courseByID = async (req, res, next, id) => {
  try {
    let course = await Course.findById(id).populate("instructor", "_id name");
    if (!course)
      return res.status("400").json({
        error: "Course not found",
      });
    req.course = course;
    next();
  } catch (err) {
    next(err);
  }
};

//
const read = (req, res) => {
  req.course.image = undefined;
  return res.json(req.course);
};

const isInstructor = (req, res, next) => {
  const isInstructor =
    req.course &&
    req.profile &&
    req.course.instructor._id == req.profile.userId;
  if (!isInstructor) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  }
  next();
};

//
const update = async (req, res, next) => {
  try {
    const filter = { _id: req.params.courseId };
    const { name, description, category } = req.body;
    if (!(name, description, category))
      return res.status(400).json({ error: "need verify email" });
    const update = {
      name,
      description,
      category,
    };
    const option = { new: true };
    const updatedCourse = await Course.findOneAndUpdate(filter, update, option);
    res.status(200).json({
      status: "success",
      updatedCourse,
    });
  } catch (err) {
    return res.status(400).json({
      error: err.message,
    });
  }
};

const remove = async (req, res, next) => {
  try {
    let course = req.course;
    let deleteCourse = await course.remove();
    res.json(deleteCourse);
  } catch (err) {
    next(err);
  }
};

//
const listPublished = async (req, res, next) => {
  try {
    const publishedCourses = await Course.find({ published: true }).populate(
      "instructor",
      "_id name"
    );
    if (!publishedCourses) {
      return res.status(400).json({
        error: "You have no published courses",
      });
    }
    return res.status(200).json(publishedCourses);
  } catch (err) {
    next(err);
  }
};

const photo = (req, res, next) => {
  return res.status(200).send(req.course.image);
};

// check comment is your comment
const isCommenter = async (req, res, next) => {
  try {
    let commentId = req.body.commentId;
    const userId = req.profile.userId;
    let courseId = req.body.courseId;
    const course = Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "course is found" });
    }
  } catch (err) {
    next(err);
  }
};

// add comments
const comment = async (req, res, next) => {
  let comment = req.body;
  comment.text = req.body.comment;
  comment.postedBy = req.profile.userId;
  try {
    let result = await Course.findByIdAndUpdate(
      req.body.courseId,
      { $push: { comments: comment } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      // .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// get comments
const readComments = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findOne({ _id: courseId }).populate(
      "comments.postedBy",
      "_id username"
    );
    if (course) {
      res.status(200).json({ result: course.comments });
    } else {
      notFoundHandler(404, "not found course");
    }
  } catch (err) {
    next(err);
  }
};

// get comment by Id
const getCommentById = async (req, res, next) => {
  try {
    const courseId = req.params.courseId;
    const commentId = req.params.commentId;
    const course = await Course.findOne({ _id: courseId }).populate(
      "comments.postedBy",
      "_id username"
    );
    if (course && course.comments.id(commentId)) {
      const ResultComments = course.comments.filter(
        (comment) => comment.id === commentId
      );
      req.comment = ResultComments;
      res.status(200).json({ result: ResultComments });
    } else if (!course) {
      notFoundHandler(404, "not found Dish");
    } else {
      notFoundHandler(404, "not found Dish Comment");
    }
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const comment = await getCommentById(req, res, next);
    console.log("userId", req.comment);

    // if (comment.postedBy._id === req.profile.userId) {
    //   return res.status(403).json({ message: "your can't update comment" });
    // }

    res.json(comment);
  } catch (err) {
    next(err);
  }
};

// delete comment
const uncomment = async (req, res) => {
  let commentId = req.body.commentId;
  try {
    let result = await Course.findByIdAndUpdate(
      req.body.courseId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    )
      .populate("comments.postedBy", "_id name")
      // .populate("postedBy", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// lesson crud
const newLesson = async (req, res, next) => {
  try {
    const { title, content, resource_url } = req.body;
    let lesson = {
      title,
      content,
      resource_url,
    };
    let result = await Course.findByIdAndUpdate(
      req.course._id,
      { $push: { lessons: lesson } },
      { new: true }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(result);
  } catch (err) {
    next(err);
  }
};
const getLessons = (req, res, next) => {
  try {
    const lessons = req.course.lessons;
    res.status(200).json({ lessons });
  } catch (err) {
    next(err);
  }
};
const getLessonById = (req, res, next) => {
  try {
    const lesson = getLessonByIdService(req, res);
    if (lesson) res.status(200).json({ lesson });
    else res.status(400).json({ error: "lesson not found" });
  } catch (err) {
    next(err);
  }
};
const updateLesson = async (req, res, next) => {
  try {
    const { title, content, resource_url } = req.body;
    const lesson = getLessonByIdService(req, res);
    const course = req.course;
    if (course && lesson) {
      lesson.title = title ? title : lesson.title;
      lesson.content = content ? content : lesson.content;
      lesson.resource_url = resource_url ? resource_url : lesson.resource_url;
      await course.save();

      res.status(200).json({ lesson });
    } else {
      next("not found lessons lesson");
    }
  } catch (err) {
    next(err);
  }
};
const deleteLessonById = async (req, res, next) => {
  try {
    const course = req.course;
    const lessonId = req.params.lessonId;
    await course.lessons.id(lessonId).remove();
    await course.save();
    res.json({ message: "success" });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  create,
  listByInstructor,
  courseByID,
  read,
  isInstructor,
  newLesson,
  update,
  remove,
  listPublished,
  photo,
  comment,
  uncomment,
  readComments,
  getCommentById,
  updateComment,
  updateLesson,
  getLessons,
  getLessonById,
  deleteLessonById,
};
