const express = require('express');
const path = require('path'); // this is come with express
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
//Load env vars
dotenv.config({ path: './config/config.env' });

// Connect database
connectDB();

// router
const bootcamps = require('./route/bootcampsRotue');
const courses = require('./route/coursesRoute');
const reviews = require('./route/review');
const register = require('./route/auth');
const users = require('./route/users');

const app = express();

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File uploading
app.use(fileupload());

// File uploading
app.use(express.static(path.join(__dirname, 'public')));

// mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/auth', register);
app.use('/api/v1/users', users);

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} and port ${PORT}`.green.bold
  );
});

// Handle unhandled promise rejections
process.on('unhandledRejections', (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  // Close server & exit process
  ServiceWorkerRegistration.close(() => process.exit(1));
});
