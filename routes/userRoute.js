const express = require('express');
const { retrieveReport,generateReport,getUsersByCourseId,deleteUserCourse,registerUser, loginUser, logOut, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getSingleUser, getAllUser, updateUserRole, deleteUser , sendEmail, verifyEmail, sendOTP, verifyOTP, generatePDF, retrievePDF } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logOut);
router.route("/password/update").put(isAuthenticatedUser, updatePassword);
router.route("/me/update").put(isAuthenticatedUser, updateProfile);
router.route("/me").post(getUserDetails);
router.route("/sendmail").post(sendEmail);
router.route("/verify/email").post(verifyEmail);
router.route("/sendotp").post(sendOTP);
router.route("/verify/otp").post(verifyOTP);
router.route("/pdf").post(generatePDF);
router.route("/getpdf").post(retrievePDF);
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser).put(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole).delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);
router.route("/delete/userCourses").post(deleteUserCourse);
router.route('/admin/users/:id').get(getUsersByCourseId);

router.route("/report").post(generateReport);
router.route("/getreport").post(retrieveReport);


module.exports = router;
