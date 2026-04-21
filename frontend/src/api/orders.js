import api from './axios';
export const createOrder      = (data)         => api.post('/orders', data);
export const getMyOrders      = (role)         => api.get('/orders', { params: { role } });
export const getOrder         = (id)           => api.get(`/orders/${id}`);
export const updateOrderStatus = (id, status)  => api.patch(`/orders/${id}/status`, { status });
export const addReview        = (data)         => api.post('/orders/review', data);
export const getUserReviews   = (userId)       => api.get(`/orders/reviews/${userId}`);
