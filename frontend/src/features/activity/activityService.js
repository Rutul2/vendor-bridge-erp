import api from '../../utils/api';

export const activityService = {
  getAll: async (params) => {
    const response = await api.get('/activity', { params });
    return response.data;
  },
};
