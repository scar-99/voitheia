import api from './axios';
export const getGigs   = (params) => api.get('/gigs', { params });
export const getGig    = (id)     => api.get(`/gigs/${id}`);
export const createGig = (data)   => api.post('/gigs', data);
export const updateGig = (id, data) => api.put(`/gigs/${id}`, data);
export const deleteGig = (id)     => api.delete(`/gigs/${id}`);
