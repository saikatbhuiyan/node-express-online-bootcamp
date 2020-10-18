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

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, addCourse);

router
  .route('/:id')
  .get(getCourse)
  .put(protect, authorize('admin', 'publisher'), updateCourse)
  .delete(protect, authorize('admin', 'publisher'), deleteCourse);

module.exports = router;
