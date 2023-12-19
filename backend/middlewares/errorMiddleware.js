import 'dotenv/config';

const isDev = process.env.NODE_ENV === 'development';

const notFound = (req, res, next) => {
  const error = new Error(`Route does not exist: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = req?.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message,
    statusCode,
    stack: !isDev ? null : err.stack,
  });
};

export { notFound, errorHandler };
