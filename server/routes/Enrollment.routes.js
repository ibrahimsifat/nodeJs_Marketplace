const {
  requireSignIn,
  hasAuthorization,
} = require("../controllers/auth.controller");
const enrollmentCtrl = require("../controllers/enrollment.controller");
const courseCtrl = require("../controllers/course.controller");
const enrollmentRouter = require("express").Router();
enrollmentRouter
  .route("/enrolled")
  .get(requireSignIn, enrollmentCtrl.listEnrolled);

enrollmentRouter
  .route("/new/:courseId")
  .get(requireSignIn, enrollmentCtrl.findEnrollment, enrollmentCtrl.create);
enrollmentRouter.param("courseId", courseCtrl.courseByID);

enrollmentRouter.param("enrollmentId", enrollmentCtrl.enrollmentByID);
enrollmentRouter
  .route("/:enrollmentId")
  .get(requireSignIn, enrollmentCtrl.isStudent, enrollmentCtrl.read);

enrollmentRouter
  .route("/complete/:enrollmentId")
  .put(requireSignIn, enrollmentCtrl.isStudent, enrollmentCtrl.complete);

enrollmentRouter.route("/stats/:courseId").get(enrollmentCtrl.enrollmentStats);

module.exports = enrollmentRouter;
