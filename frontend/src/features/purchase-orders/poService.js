import api from '../../utils/api';

export const poService = {
  getAll: async (params) => {
    const response = await api.get('/purchase-orders', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/purchase-orders/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/purchase-orders', data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/purchase-orders/${id}/status`, { status });
    return response.data;
  },
};
