const express = require('express');

const {
  getCourses,
  getCourse,
  addCourse,
} = require('../controllers/courseControllers');

// We merging the url param
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse);

module.exports = router;
