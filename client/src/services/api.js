import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

export const fetchProperties = (params = {}) => api.get('/properties', { params });
export const fetchPropertyById = (id) => api.get(`/properties/${id}`);
export const submitInquiry = (payload) => api.post('/leads/inquiry', payload);
export const submitCallback = (payload) => api.post('/leads/callback', payload);
export const bookVisit = (payload) => api.post('/leads/site-visit', payload);

export default api;
