const {
  requireSignIn,
  hasAuthorization,
} = require("../controllers/auth.controller");
const userCtrl = require("../controllers/user.controller");
const courseCtrl = require("../controllers/course.controller");
const courseRouter = require("express").Router();
const upload = require("../middlewares/users/avatarUpload");

courseRouter.route("/published").get(requireSignIn, courseCtrl.listPublished);

courseRouter
  .route("/:courseId/comment/:commentId")
  .get(requireSignIn, courseCtrl.isInstructor, courseCtrl.getCommentById)
  .patch(requireSignIn, courseCtrl.isInstructor, courseCtrl.updateComment);

// add comments
courseRouter
  .route("/:courseId/comments")
  .get(requireSignIn, courseCtrl.isInstructor, courseCtrl.readComments)
  .post(requireSignIn, courseCtrl.comment);

// delete comment
courseRouter.route("/uncomment").put(requireSignIn, courseCtrl.uncomment);
courseRouter
  .route("/new")
  .post(
    requireSignIn,
    userCtrl.isEducator,
    upload.single("image"),
    courseCtrl.create
  );

courseRouter.param("userId", userCtrl.userByID);

courseRouter
  .route("/by/:userId")
  .get(requireSignIn, hasAuthorization, courseCtrl.listByInstructor);

courseRouter.param("courseId", courseCtrl.courseByID);

// lesson crud
courseRouter
  .route("/:courseId/lesson/:lessonId")
  .get(requireSignIn, courseCtrl.isInstructor, courseCtrl.getLessonById)
  .patch(requireSignIn, courseCtrl.isInstructor, courseCtrl.updateLesson)
  .delete(requireSignIn, courseCtrl.isInstructor, courseCtrl.deleteLessonById);
courseRouter
  .route("/:courseId/lesson/new")
  .patch(requireSignIn, courseCtrl.isInstructor, courseCtrl.newLesson);
courseRouter
  .route("/:courseId/lesson")
  .get(requireSignIn, courseCtrl.isInstructor, courseCtrl.getLessons);

// courses
courseRouter
  .route("/:courseId")
  .get(courseCtrl.read)
  .put(requireSignIn, courseCtrl.isInstructor, courseCtrl.update)
  .delete(requireSignIn, courseCtrl.isInstructor, courseCtrl.remove);

courseRouter.route("/photo/:courseId").get(courseCtrl.photo);

module.exports = courseRouter;
