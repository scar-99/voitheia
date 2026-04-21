# 🚀 Voitheia - Campus Marketplace & Freelancing Platform

A complete, production-ready full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js) + Socket.io for real-time chat.

Perfect for college campuses to buy/sell items and offer/hire freelance services.

## ✨ Features

- **User Authentication** — JWT-based with secure password hashing
- **Marketplace** — Buy & sell products (books, electronics, clothing, hostel items, sports, etc.)
- **Freelancing Gigs** — Post & browse services (coding, design, writing, tutoring, editing, photography)
- **Real-time Chat** — Socket.io powered instant messaging
- **Orders & Transactions** — Track order status (pending → accepted → in progress → completed)
- **Reviews & Ratings** — Leave feedback and build reputation
- **Image Uploads** — Cloudinary integration for product/gig images
- **Advanced Search** — Filter by keyword, category, price range, condition
- **Wishlist** — Save favorite products
- **User Profiles** — College info, bio, rating, review count

## 📁 Project Structure

```
voitheia/
├── backend/              # Node.js + Express REST API
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/      # Business logic
│   ├── middleware/       # Auth & error handling
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API endpoints
│   ├── socket/           # WebSocket handlers
│   ├── server.js         # Express entry point
│   ├── package.json
│   └── .env              # Environment variables
│
└── frontend/             # React + Vite
    ├── src/
    │   ├── api/          # Axios instances
    │   ├── components/   # React components
    │   ├── context/      # React Context (Auth)
    │   ├── pages/        # Page components
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## 🛠️ Tech Stack

**Backend (5000)**
- Express.js — REST API framework
- MongoDB + Mongoose — NoSQL database
- Socket.io — Real-time messaging
- JWT — Stateless authentication
- Bcryptjs — Password hashing
- Cloudinary — Image hosting

**Frontend (5173)**
- React 18 — UI framework
- React Router v6 — Client routing
- Axios — HTTP client
- Socket.io Client — WebSocket communication
- Vite — Build tool & dev server

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install

# Create .env file
# Update MONGO_URI, Cloudinary credentials, JWT_SECRET

npm run dev     # Server runs on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev     # Opens http://localhost:5173
```

## 📚 API Documentation

Comprehensive API docs available in [backend/BACKEND_SETUP.md](backend/BACKEND_SETUP.md)

### Core Endpoints

**Authentication**
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Get JWT token
- `GET /api/auth/me` — Get current user

**Products**
- `GET /api/products` — List all (with filters)
- `POST /api/products` — Create (protected)
- `PATCH /api/products/:id/sold` — Mark sold (protected)

**Gigs**
- `GET /api/gigs` — List all (with filters)
- `POST /api/gigs` — Create gig (protected)

**Orders**
- `POST /api/orders` — Create order (protected)
- `GET /api/orders` — Get my orders (protected)
- `PATCH /api/orders/:id/status` — Update status (protected)

**Reviews**
- `POST /api/orders/review` — Leave review (protected)

**Chat**
- `GET /api/messages/:chatId` — Get chat history
- Socket events: `joinRoom`, `sendMessage`, `message`

## 📝 Testing

Quick testing guide in [backend/TESTING_GUIDE.md](backend/TESTING_GUIDE.md)

### Example (Register & Login)
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John",
    "email": "john@example.com",
    "password": "pass123",
    "college": "MIT"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "pass123"
  }'
```

## 🔒 Security Features

- Passwords hashed with bcryptjs (10 rounds)
- JWT tokens with 7-day expiration
- Protected routes with `authMiddleware`
- CORS enabled for frontend
- Input validation on all endpoints
- Error handling middleware
- Unique indices on email, order reviews

## 🗄️ Database Models

1. **User** — name, email, password, avatar, college, bio, rating
2. **Product** — title, description, price, category, condition, images, seller
3. **Gig** — title, description, price, deliveryDays, category, images, freelancer
4. **Order** — type, gig/product ref, buyer/seller, status, price
5. **Message** — chatId, sender, text, timestamp
6. **Review** — reviewer, reviewee, order, rating, comment

## 📥 Environment Variables

```env
# Backend (.env)
PORT=5000
MONGO_URI=mongodb://localhost:27017/voitheia
JWT_SECRET=voitheia_secret_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🚀 Deployment

### Backend (Heroku/Railway)
```bash
npm run build
npm start
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

## 📋 Checklist

- [x] Complete backend with all CRUD operations
- [x] Authentication & authorization
- [x] Error handling middleware
- [x] Real-time chat with Socket.io
- [x] Image uploads with Cloudinary
- [x] Review & rating system
- [x] Frontend components (basic)
- [ ] Advanced search filters
- [ ] Payment integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Mobile app

## 🤝 Contributing

Contributions welcome! Create issues for bugs or feature requests.

## 📄 License

MIT License

---

**Made with ❤️ for college communities**
