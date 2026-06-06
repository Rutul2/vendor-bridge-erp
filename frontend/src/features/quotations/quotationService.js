import api from '../../utils/api';

export const quotationService = {
  getAll: async (params) => {
    const response = await api.get('/quotations', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/quotations/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/quotations', data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/quotations/${id}`, { status });
    return response.data;
  },
};
