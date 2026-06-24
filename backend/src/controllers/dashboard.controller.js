import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';
import * as dashboardService from '../services/dashboard.service.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats(req.user.id);
  sendSuccess(res, stats, 'Dashboard stats retrieved successfully');
});
