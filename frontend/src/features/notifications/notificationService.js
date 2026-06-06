import api from '../../utils/api';

export const notificationService = {
  getAll: async (params) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },
  markAllAsRead: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/notifications', data);
    return response.data;
  },
};
