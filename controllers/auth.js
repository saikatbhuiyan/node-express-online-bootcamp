const crypto = require('crypto');
const path = require('path');
const ErrorResponse = require('../utlis/errorResponse');
const asyncHandler = require('../async');
const User = require('../models/User');
const { userInfo } = require('os');
const sendEmail = require('../utlis/sendEmail');

// @desc      Register user
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  // Create token
  const token = user.getSignedJwtToken();

  // res.status(200).json({ success: true, token });
  sendTokenResponse(user, 200, res);
});

// @desc      user login
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return next(new ErrorResponse('Please enter your email and password', 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 400));
  }

  // Check password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 400));
  }

  // Create token
  const token = user.getSignedJwtToken();

  // res.status(200).json({ success: true, token });
  sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     Get /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update the user
// @route     Put /api/v1/auth/update
// @access    Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  let fieldsToUpdate = {};
  if (req.body.email && req.body.name) {
    fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
    };
  } else if (req.body.name) {
    fieldsToUpdate = {
      name: req.body.name,
    };
  } else {
    fieldsToUpdate = {
      email: req.body.email,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     Put /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse('Passwod is incorret', 401));
  }

  if (req.body.newPassword != req.body.newPassword1) {
    return next(new ErrorResponse('Password did not match.'));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse('There is no user with this email.'));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  // console.log(resetToken);

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/forgotpassword/${resetToken}`;

  const message = `You are receiving this email: \n\n${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({
      success: true,
      data: 'Email Sent',
    });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    next(new ErrorResponse('Email could not be sent', 500));
  }

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Reset password
// @route     POST /api/v1/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('There is no user with this token.'));
  }

  // Set new password
  if (req.body.password != req.body.password1) {
    return next(new ErrorResponse('Password did not match.'));
  }

  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
