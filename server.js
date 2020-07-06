const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({ path: './config/config.env' });

connectDB();

// router
const bootcamps = require('./route/bootcampsRotue');

const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// mount routers
app.use('/api/v1/bootcamps', bootcamps);

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
