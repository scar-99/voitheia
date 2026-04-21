import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import connectDB from './config/db.js';
import { initSocket } from './socket/socketHandler.js';
import { errorHandler } from './middleware/errorMiddleware.js';

import authRoutes    from './routes/auth.js';
import productRoutes from './routes/products.js';
import gigRoutes     from './routes/gigs.js';
import orderRoutes   from './routes/orders.js';
import messageRoutes from './routes/messages.js';

connectDB();

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));   // large limit for base64 image uploads

app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/gigs',     gigRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => res.json({ message: 'Voitheia API is running 🚀' }));

app.use(errorHandler);

initSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
