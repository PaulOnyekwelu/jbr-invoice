export const errorResponse = (res, message, statusCode=400) => {
  res.status(statusCode);
  throw new Error(message);
};
