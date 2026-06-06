import api from '../../utils/api';

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/analytics/dashboard');
    return response.data;
  },
  getMonthlyTrends: async () => {
    const response = await api.get('/analytics/monthly-trends');
    return response.data;
  },
  getSpendingSummary: async () => {
    const response = await api.get('/analytics/spending-summary');
    return response.data;
  },
};
