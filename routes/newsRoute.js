
const express = require('express');
const { getAllNews, getSingleNews, newNews , updateNews , deleteNews} = require('../controllers/newsController');

const router = express.Router();


router.route("/news").get(getAllNews);
router.route("/news/:id").get(getSingleNews);
router.route("/news/new").post(newNews);
router.route("/news/delete/:id").get(deleteNews);
router.route("/news/update").put(updateNews);
module.exports = router;