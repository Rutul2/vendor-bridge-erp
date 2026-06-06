import api from '../../utils/api';

export const invoiceService = {
  getAll: async (params) => {
    const response = await api.get('/invoices', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/invoices/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/invoices', data);
    return response.data;
  },
  getPdf: async (id) => {
    const response = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
    return response.data;
  },
  sendEmail: async (id, data) => {
    const response = await api.post(`/invoices/${id}/email`, data);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.put(`/invoices/${id}/status`, { status });
    return response.data;
  },
};
