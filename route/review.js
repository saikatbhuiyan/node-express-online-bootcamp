const express = require('express');

const { getReviews } = require('../controllers/review');
// We merging the url param
const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Review = require('../models/Review');

router.route('/').get(
  advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getReviews
);

module.exports = router;
