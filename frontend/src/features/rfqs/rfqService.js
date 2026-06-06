// src/features/rfqs/rfqService.js
import api from '../../utils/api';

export const rfqService = {
  getAll: async () => {
    const response = await api.get('/rfqs');
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/rfqs', data);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/rfqs/${id}`);
    return response.data;
  }
};