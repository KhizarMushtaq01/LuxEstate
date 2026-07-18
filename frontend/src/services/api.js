import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL: API_URL, timeout: 15000 });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('luxestate_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('luxestate_token');
      localStorage.removeItem('luxestate_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// AUTH
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  updatePassword: (data) => api.put('/auth/password', data),
  toggleSave: (propertyId) => api.put(`/auth/save/${propertyId}`),
};

// PROPERTIES
export const propertyAPI = {
  getAll: (params) => api.get('/properties', { params }),
  getOne: (id) => api.get(`/properties/${id}`),
  getFeatured: () => api.get('/properties/featured'),
  getSold: () => api.get('/properties/sold'),
  getStats: () => api.get('/properties/stats'),
  getByAgent: (agentId) => api.get(`/properties/agent/${agentId}`),
  create: (data) => api.post('/properties', data),
  update: (id, data) => api.put(`/properties/${id}`, data),
  delete: (id) => api.delete(`/properties/${id}`),
};

// APPOINTMENTS
export const appointmentAPI = {
  create: (data) => api.post('/appointments', data),
  getAll: () => api.get('/appointments'),
  update: (id, data) => api.put(`/appointments/${id}`, data),
  cancel: (id) => api.delete(`/appointments/${id}`),
  getSlots: (params) => api.get('/appointments/slots', { params }),
};

// LEADS
export const leadAPI = {
  create: (data) => api.post('/leads', data),
  getAll: () => api.get('/leads'),
  update: (id, data) => api.put(`/leads/${id}`, data),
};

// REVIEWS
export const reviewAPI = {
  create: (data) => api.post('/reviews', data),
  getAll: (params) => api.get('/reviews', { params }),
  getAllAdmin: () => api.get('/admin/reviews'),
  approve: (id) => api.put(`/reviews/${id}/approve`),
};

// BLOGS
export const blogAPI = {
  getAll: (params) => api.get('/blogs', { params }),
  getOne: (slug) => api.get(`/blogs/${slug}`),
  create: (data) => api.post('/blogs', data),
};

// NEIGHBORHOODS
export const neighborhoodAPI = {
  getAll: () => api.get('/neighborhoods'),
  getOne: (slug) => api.get(`/neighborhoods/${slug}`),
  create: (data) => api.post('/neighborhoods', data),
};

// AGENTS
export const agentAPI = {
  getAll: () => api.get('/agents'),
  getOne: (id) => api.get(`/agents/${id}`),
};

// ADMIN
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getDashboard: () => api.get('/admin/dashboard'),
};

export default api;
