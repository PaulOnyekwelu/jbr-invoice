import 'dotenv/config';
import { ISDEV } from '../constants/index.js';

const notFound = (req, res, next) => {
  // NOTE: throwing an 404 error works too!
  // res.status(404);
  // throw new Error(`Route does not exist: ${req.originalUrl}`);
  
  const error = new Error(`Route does not exist: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res?.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message,
    statusCode,
    stack: !ISDEV ? null : err.stack,
  });
};

export { notFound, errorHandler };
