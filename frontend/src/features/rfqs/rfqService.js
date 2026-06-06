// src/features/rfqs/rfqService.js
import api from '../../utils/api';

export const rfqService = {
  getAll: async (params) => {
    const response = await api.get('/rfqs', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/rfqs/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/rfqs', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/rfqs/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/rfqs/${id}`);
    return response.data;
  },
  assignVendors: async (id, vendors) => {
    const response = await api.post(`/rfqs/${id}/vendors`, { vendors });
    return response.data;
  },
};