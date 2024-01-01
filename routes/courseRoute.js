const express = require('express');
const { getAllCourses, getSingleCourse, newCourse, buyCourse } = require('../controllers/coursesController');

const router = express.Router();

router.route("/").get(getAllCourses);
router.route("/:id").get(getSingleCourse);
router.route("/new").post(newCourse);
router.route("/buy").post(buyCourse);

module.exports = router;