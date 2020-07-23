const express = require('express');

const {
  getCourses,
  getCourse,
  addCourse,
  deleteCourse,
  updateCourse,
} = require('../controllers/courseControllers');

// We merging the url param
const router = express.Router({ mergeParams: true });

router.route('/').get(getCourses).post(addCourse);

router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;
