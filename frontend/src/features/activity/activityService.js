import api from '../../utils/api';

export const activityService = {
  getAll: async (params) => {
    const response = await api.get('/activity-logs', { params });
    return response.data;
  },
};
