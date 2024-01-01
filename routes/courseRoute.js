const express = require('express');
const { getAllCourses, getSingleCourse, newCourse, buyCourse, updateCourse } = require('../controllers/coursesController');

const router = express.Router();

router.route("/").get(getAllCourses);
router.route("/:id").get(getSingleCourse);
router.route("/new").post(newCourse);
router.route("/:id").put(updateCourse);
router.route("/buy").post(buyCourse);


module.exports = router;