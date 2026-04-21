import api from './axios';
export const getProducts    = (params) => api.get('/products', { params });
export const getProduct     = (id)     => api.get(`/products/${id}`);
export const createProduct  = (data)   => api.post('/products', data);
export const updateProduct  = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct  = (id)     => api.delete(`/products/${id}`);
export const markSold       = (id)     => api.patch(`/products/${id}/sold`);
export const toggleWishlist = (id)     => api.patch(`/products/${id}/wishlist`);
