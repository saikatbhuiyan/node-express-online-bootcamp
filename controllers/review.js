const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc      Get reviews
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

// @desc      Get single review
// @route     GET /api/v1/reviews/:id
// @access    Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await (await Review.findById(req.params.id)).populate({
    path: 'bootcamp',
    select: 'name description',
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id ${req.params.id}`)
    );
  }

  res.status(200).json({
    succes: true,
    review: review,
  });
});

// @desc      Add review
// @route     POST /api/v1/bootcamps/:bootcampId/reviews
// @access    Private
exports.addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with the id ${req.params.bootcampId}`
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(201).json({
    succes: true,
    review: review,
  });
});
