const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcampControllers');

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// Include other resource routers
const courseRouter = require('./coursesRoute');
const reviewRouter = require('./review');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('admin', 'publisher'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('admin', 'publisher'), updateBootcamp)
  .delete(protect, authorize('admin', 'publisher'), deleteBootcamp);

router
  .route('/:id/photo')
  .put(protect, authorize('admin', 'publisher'), bootcampPhotoUpload);

module.exports = router;
