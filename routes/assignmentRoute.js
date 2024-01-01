const express = require('express');
const { getAssignment,  newAssignment, evaluateAssignment } = require('../controllers/coursesController');

const router = express.Router();

router.route("/:id").get(getAssignment);
router.route("/assignment/new").post(newAssignment);
router.route("/assignment/evaluate").post(evaluateAssignment);


module.exports = router;