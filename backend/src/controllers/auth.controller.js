import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import * as authService from '../services/auth.service.js';

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  sendSuccess(res, result, 'Registration successful', 201);
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.loginUser(req.body);
  sendSuccess(res, result, 'Login successful');
});

export const logout = asyncHandler(async (req, res) => {
  sendSuccess(res, null, 'Logout successful');
});

export const getMe = asyncHandler(async (req, res) => {
  sendSuccess(res, { user: req.user }, 'User retrieved successfully');
});
