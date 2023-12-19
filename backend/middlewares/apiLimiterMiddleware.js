import rateLimit from 'express-rate-limit';
import { systemLogs } from '../utils/logger.js';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: {
    message: `Too many requests. Please try again in 15 minutes.`,
  },
  handler: (req, res, next, options) => {
    systemLogs.error(
      `${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const loginLimiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  limit: 20,
  message: {
    message: `Too many login attempts. Please try again in 30 minutes.`,
  },
  handler: (req, res, next, options) => {
    systemLogs.error(
      `${options.message.message}\t${req.url}\t${req.method}\t${req.headers.origin}`
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
