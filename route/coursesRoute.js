const express = require('express');

const { getCourses } = require('../controllers/courseControllers');

// We merging the url param
const router = express.Router({ mergeParams: true });

router.route(getCourses);

module.exports = router;
