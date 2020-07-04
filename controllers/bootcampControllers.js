exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ succes: true, mes: 'Get all bootcamps' });
};

exports.getBootcamp = (req, res, next) => {
  res.status(200).json({
    succes: true,
    mes: `Get a bootcamp that have id ${req.params.id}`,
  });
};

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ succes: true, mes: 'Create new bootcamps' });
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
