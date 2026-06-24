import { sendError } from '../utils/response.js';
import { AppError } from '../utils/asyncHandler.js';

export const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  if (err.code === 'P2002') {
    return sendError(res, 'A record with this value already exists.', 409);
  }

  if (err.code === 'P2025') {
    return sendError(res, 'Record not found.', 404);
  }

  console.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  return sendError(res, message, statusCode);
};

export const notFound = (req, res) => {
  return sendError(res, `Route ${req.originalUrl} not found`, 404);
};
