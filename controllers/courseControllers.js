const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../async');
const Course = require('../models/Course');

// @desc      Get all Course
// @route     GET /api/v1/coueses
// @route     GET /api/v1/bootcamps/:bootcampId/coueses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Course.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }

  const courses = await query;

  res.status(200).json({
    succes: true,
    count: courses.length,
    data: courses,
  });
});
