import api from '../../utils/api';

export const approvalService = {
  getAll: async (params) => {
    const response = await api.get('/approvals', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/approvals/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/approvals', data);
    return response.data;
  },
  approve: async (id, data) => {
    const response = await api.post(`/approvals/${id}/approve`, data);
    return response.data;
  },
  reject: async (id, data) => {
    const response = await api.post(`/approvals/${id}/reject`, data);
    return response.data;
  },
};
