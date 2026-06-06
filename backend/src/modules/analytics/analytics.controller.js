import { successResponse } from '../../utils/response.js';
import { getDashboardSummary, getMonthlyTrends, getSpendingSummary, getVendorPerformance } from './analytics.service.js';

export const dashboardHandler = async (req, res) => {
  const data = await getDashboardSummary();
  return successResponse(res, 'Dashboard analytics retrieved successfully', data);
};

export const vendorsHandler = async (req, res) => {
  const data = await getVendorPerformance();
  return successResponse(res, 'Vendor analytics retrieved successfully', data);
};

export const spendingHandler = async (req, res) => {
  const data = await getSpendingSummary();
  return successResponse(res, 'Spending analytics retrieved successfully', data);
};

export const monthlyTrendsHandler = async (req, res) => {
  const data = await getMonthlyTrends();
  return successResponse(res, 'Monthly trends retrieved successfully', data);
};
