const Bootcamp = require('../models/Bootcamp');

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find().sort('_id');
    res
      .status(200)
      .json({ succes: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({
      succes: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({
    succes: true,
    mes: `Update a bootcamp that have id ${req.params.id}`,
  });
};

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({
    succes: true,
    mes: `Delete a bootcamp that have id ${req.params.id}`,
  });
};
