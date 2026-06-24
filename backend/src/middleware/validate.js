import { validationResult } from 'express-validator';
import { sendError } from '../utils/response.js';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((err) => err.msg)
      .join(', ');
    return sendError(res, message, 400);
  }
  next();
};
