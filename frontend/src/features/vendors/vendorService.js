import api from '../../utils/api';

export const vendorService = {
  getAll: async (params) => {
    const response = await api.get('/vendors', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/vendors/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/vendors', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/vendors/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/vendors/${id}`);
    return response.data;
  },
};
