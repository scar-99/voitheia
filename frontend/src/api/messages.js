import api from './axios';
export const getMyChats     = ()       => api.get('/messages');
export const getChatHistory = (chatId) => api.get(`/messages/${chatId}`);
