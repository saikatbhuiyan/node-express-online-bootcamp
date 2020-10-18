const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc      Get review
// @route     GET /api/v1/reviews
// @route     GET /api/v1/bootcamps/:bootcampId/reviews
// @access    Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = Review.find({ bootcamp: req.params.bootcampId });

    res.status(200).json({
      succes: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
