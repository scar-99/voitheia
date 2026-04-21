import Message from '../models/Message.js';

export const initSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a chat room
    socket.on('joinRoom', (chatId) => {
      socket.join(chatId);
      console.log(`Socket ${socket.id} joined room: ${chatId}`);
    });

    // Send a message — save to DB then broadcast
    socket.on('sendMessage', async ({ chatId, senderId, text }) => {
      try {
        const msg = await Message.create({ chatId, sender: senderId, text });
        const populated = await msg.populate('sender', 'name avatar');
        io.to(chatId).emit('message', populated);
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
