const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../async');

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find().sort('_id');
  res
    .status(200)
    .json({ succes: true, count: bootcamps.length, data: bootcamps });
});

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      // res.status(400).json({ success: false });
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      succes: true,
      data: bootcamp,
    });
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
};

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!bootcamp) {
      next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`),
        404
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    // res.status(400).json({
    //   succes: false,
    // });
    next(err);
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndRemove(req.params.id);
    if (!bootcamp) {
      // return res.status(400).json({ success: false });
      next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`),
        404
      );
    }
    res.status(200).json({
      succes: true,
      data: bootcamp,
    });
  } catch (err) {
    // res.status(404).json({
    //   succes: false,
    // });
    next(err);
  }
};
