const express = require('express');
const { registerTwitterAccount } = require("../controllers/twitterController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();
router.route("/registerTwitter").post(registerTwitterAccount);

module.exports = router;
