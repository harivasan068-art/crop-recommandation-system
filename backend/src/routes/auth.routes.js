import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';
import {
  registerValidation,
  loginValidation,
} from '../validations/auth.validation.js';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  registerValidation,
  validate,
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  loginValidation,
  validate,
  authController.login
);

router.post('/logout', authenticate, authController.logout);

router.get('/me', authenticate, authController.getMe);

export default router;
