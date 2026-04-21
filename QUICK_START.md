# Voitheia — Complete Application Quick Start

Welcome to Voitheia! This guide gets you up and running in 5 minutes.

## What is Voitheia?

A campus-based marketplace and freelancing platform built with the MERN stack (MongoDB, Express, React, Node.js).

**Features:**
- 🛍️ **Marketplace**: Buy & sell second-hand items on campus
- 💼 **Freelancing**: Hire peers for services (coding, design, tutoring, etc.)
- 💬 **Real-time Chat**: Direct messaging with sellers/freelancers
- ⭐ **Ratings & Reviews**: Build trust in your campus community

## Quick Start in 3 Steps

### Step 1️⃣: Start Backend
```bash
cd voitheia/backend
npm run dev
```
✅ Backend starts on `http://localhost:5000`

### Step 2️⃣: Start Frontend
(Open a NEW terminal)
```bash
cd voitheia/frontend
npm run dev
```
✅ Frontend starts on `http://localhost:5173`

### Step 3️⃣: Open Browser
Visit **http://localhost:5173** and start using Voitheia!

## First Time Setup Checklist

- [ ] Cloned/downloaded the repository
- [ ] Backend: `npm install` completed in `/backend`
- [ ] Frontend: `npm install` completed in `/frontend`
- [ ] MongoDB running locally OR cloud connection configured in `.env`
- [ ] Cloudinary account set up for image uploads (optional, but recommended)

## Project Structure

```
voitheia/
├── backend/                          # Node.js + Express server
│   ├── models/                       # Mongoose schemas (User, Product, etc)
│   ├── controllers/                  # Business logic for routes
│   ├── routes/                       # API endpoints
│   ├── middleware/                   # Auth, error handling
│   ├── socket/                       # Socket.IO chat handler
│   ├── server.js                     # Express app setup
│   ├── .env                          # Database & API keys
│   └── package.json                  # Node dependencies
│
├── frontend/                         # React + Vite app
│   ├── src/
│   │   ├── api/                      # Axios API functions
│   │   ├── components/               # Reusable React components
│   │   ├── context/                  # Auth & Socket contexts
│   │   ├── pages/                    # Full-page components
│   │   ├── App.jsx                   # Main app with routing
│   │   └── index.css                 # Global styles
│   ├── vite.config.js                # Proxy config for /api calls
│   └── package.json                  # React dependencies
│
├── FRONTEND_SETUP.md                 # Detailed frontend guide
├── README.md                         # Project overview
└── ...
```

## Technology Stack

**Backend:**
- Node.js / Express.js (REST API)
- MongoDB (Database)
- Mongoose (ODM)
- JWT (Authentication)
- Socket.IO (Real-time chat)
- Cloudinary (Image hosting)
- bcryptjs (Password hashing)

**Frontend:**
- React 18 (UI)
- Vite (Build tool)
- React Router v6 (Routing)
- Axios (HTTP client)
- Socket.IO Client (Real-time messaging)
- Lucide React (Icons)
- React Hot Toast (Notifications)

## User Flows

### New User: Register → Browse → Buy/Sell

1. **Visit** http://localhost:5173
2. **Click** "Sign up"
3. **Enter**: Name, Email, Password, College
4. **Redirected** to Home page (logged in)
5. **Browse** Marketplace or Freelancing tabs
6. **Click** product/gig → Chat with seller or Buy

### Seller: Create Listing

1. **Click** "+ Sell" (top right)
2. **Fill** product details (title, price, photos, condition)
3. **Click** "List item"
4. **Your product** appears in Marketplace immediately
5. **When buyer** purchases, you get notified in Dashboard

### Freelancer: Offer Service

1. **Click** "+ Offer a service" (Freelancing tab)
2. **Fill** service details (title, description, price, delivery time)
3. **Click** "Publish service"
4. **Your gig** appears in Freelancing immediately
5. **When hired**, manage in Dashboard

## 24 API Endpoints Summary

**Authentication (4 endpoints)**
- POST `/auth/register` - Create account
- POST `/auth/login` - Get JWT token
- GET `/auth/me` - Get current user
- PUT `/auth/profile` - Update profile

**Products/Marketplace (7 endpoints)**
- GET `/products` - List all products (with filters)
- GET `/products/:id` - Get product detail
- POST `/products` - Create product
- PUT `/products/:id` - Update product
- DELETE `/products/:id` - Delete product
- PATCH `/products/:id/sold` - Mark as sold
- PATCH `/products/:id/wishlist` - Toggle wishlist

**Gigs/Freelancing (5 endpoints)**
- GET `/gigs` - List all gigs (with filters)
- GET `/gigs/:id` - Get gig detail
- POST `/gigs` - Create gig
- PUT `/gigs/:id` - Update gig
- DELETE `/gigs/:id` - Delete gig

**Orders/Transactions (6 endpoints)**
- POST `/orders` - Create order (buy product or hire)
- GET `/orders` - Get my orders (filter by role)
- GET `/orders/:id` - Get order detail
- PATCH `/orders/:id/status` - Update order status
- POST `/orders/review` - Leave review after completion
- GET `/orders/reviews/:userId` - Get all reviews for user

**Messages/Chat (2 endpoints)**
- GET `/messages` - Get my chats
- GET `/messages/:chatId` - Get chat history
- *(Socket.IO for sending messages in real-time)*

## Common Actions

### Login & Logout
```
Login:  Click "Login" → Enter credentials → Redirected to home
Logout: Click avatar circle → Click "Logout" → Redirected to login
```

### Browse & Filter
```
Marketplace:  Keyword search + Category dropdown + Price sort
Freelancing:  Keyword search + Category dropdown + Price sort
```

### Create Listing
```
Products: Click "+ List item" → Fill form → Upload photos → Click "List item"
Gigs:     Click "+ Offer a service" → Fill form → Upload cover → Click "Publish"
```

### Place Order / Hire
```
On Product Detail:    Click "Buy now" → Confirm → See in Dashboard
On Gig Detail:        Click "Hire now" → Confirm → See in Dashboard
Chat with them anytime via "Chat" button
```

### Manage Orders
```
Dashboard → Click "Buying" or "Selling" tab
- Show all your transactions
- Accept/reject (seller only)
- Mark complete (buyer or seller)
- Cancel (if pending)
- Chat with counterparty
```

### Leave Review
```
After order is completed, leave star rating + comment
Automatically updates seller's average rating & review count
```

## Environment Variables

**Backend (.env)**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/voitheia
JWT_SECRET=your_jwt_secret_here_min_20_chars
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend**: No .env needed (uses proxy in vite.config.js)

## Database Models

**Users**: name, email, password (hashed), avatar, college, bio, rating, reviews count, wishlist

**Products**: seller ref, title, description, price, category, condition, images, status (available/sold)

**Gigs**: freelancer ref, title, description, price, deliveryDays, category, images, isActive

**Orders**: type (marketplace/freelancing), product/gig ref, buyer/seller ref, price, status (5-state workflow), note

**Messages**: chatId (indexed), sender ref, text, read flag, timestamp

**Reviews**: reviewer/reviewee ref, order ref, rating (1-5), comment, timestamp

## Features Not Yet Implemented (Future Enhancements)

- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] User search
- [ ] Pagination on lists
- [ ] Image compression
- [ ] Rate limiting
- [ ] File uploads (resume, portfolio)
- [ ] Advanced filtering (rating filter, distance filter)

## Production Deployment

### Backend
```bash
npm run build  # Not needed for Node
# Deploy to: Heroku, Railway, Render, AWS, DigitalOcean
```

### Frontend
```bash
npm run build  # Creates dist/ folder
# Deploy to: Vercel, Netlify, GitHub Pages
```

### Database
- Use MongoDB Atlas for cloud database
- Update MONGO_URI in backend .env to Atlas connection string

### Images
- Use free Cloudinary tier (25 GB storage)
- Or AWS S3, Azure Blob Storage

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot GET /api/..." | Backend not running on 5000. Check `npm run dev` in backend folder |
| "Socket.IO connection failed" | Backend Socket.IO not initialized. Check server.js |
| "Images not uploading" | Cloudinary not configured in .env. Set API keys |
| "Login loops" | Check localStorage `voitheia_token`. Clear and retry |
| "NPM packages missing" | Run `npm install` in both backend and frontend folders |
| "Port already in use" | Change port in backend server.js or kill process on port 5000 |

## File Checklist

**Backend**
- ✅ `server.js` - Entry point with Express & Socket.IO setup
- ✅ 6 Models (User, Product, Gig, Order, Message, Review)
- ✅ 5 Controllers (auth, product, gig, order, message)
- ✅ 5 Routes (auth, product, gig, order, message)
- ✅ Middleware (auth, error handling)
- ✅ Socket handler (chat)
- ✅ Config (database, Cloudinary)

**Frontend**
- ✅ 6 API modules (auth, products, gigs, orders, messages)
- ✅ 2 Context providers (Auth, Socket)
- ✅ 5 Shared components (Navbar, ProductCard, GigCard, Spinner, StarRating)
- ✅ 10 Page components (Home, Login, Register, Marketplace, ProductDetail, AddProduct, Freelancing, AddGig, Chat, Dashboard)
- ✅ Global styles (index.css)
- ✅ App routing (App.jsx)
- ✅ Vite config with /api proxy

## Support & Documentation

- **Backend Setup**: See `BACKEND_SETUP.md`
- **Frontend Setup**: See `FRONTEND_SETUP.md`
- **API Reference**: See `API_REFERENCE.md`
- **Testing Guide**: See `TESTING_GUIDE.md`

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Browser                        │
│              http://localhost:5173 (React)                   │
└────────────────────┬────────────────────────────────────────┘
                     │ Axios + JWT
                     ├─────────────────────────────┐
                     │                             │
              REST API Calls            Socket.IO Messages
                  (24 endpoints)        (Real-time chat)
                     │                             │
┌────────────────────▼─────────────────────────────▼──────────┐
│                   Backend Server                            │
│              http://localhost:5000                          │
│              (Express + Socket.IO)                          │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Routes &    │  │ Controllers  │  │  Middleware  │      │
│  │  Endpoints   │  │  (Business   │  │  (Auth,      │      │
│  │  (5 modules) │  │   Logic)     │  │   Errors)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Models      │  │  Socket      │  │  Config      │      │
│  │  Schemas     │  │  Handler     │  │  (DB,        │      │
│  │  (6 models)  │  │  (Chat)      │  │   Cloudinary)│      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────┬──────────────────────────────────────────┬───────────┘
       │                                          │
       │         MongoDB Connection        Cloudinary API
       │         (mongodb://localhost:27017)  (Image uploads)
       │                                        │
┌──────▼─────────────────────────────────────────▼───────────┐
│                   Data Layer & Services                     │
│ ┌────────────────────┐  ┌────────────────────────────────┐ │
│ │   MongoDB Local    │  │  Cloudinary Image Hosting      │ │
│ │   or MongoDB Atlas │  │  (Base64 → URL conversion)     │ │
│ │   (Collections:    │  │                                │ │
│ │   users,products,  │  │                                │ │
│ │   gigs,orders,     │  │                                │ │
│ │   messages)        │  │                                │ │
│ └────────────────────┘  └────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

## Key Concepts

**JWT Authentication**: 
- User logs in → Backend issues JWT token → Stored in localStorage
- Every API request includes token in header `Authorization: Bearer {token}`
- Expires in 7 days (set in backend)

**Socket.IO Chat**:
- Users join chat rooms by chatId when opening chat
- Messages sent/received in real-time
- Also persisted to Message database

**Order Workflow**:
- Buyer creates order (status: pending)
- Seller accepts (status: accepted)
- Seller marks in-progress (status: in_progress)
- Buyer confirms completion OR either party cancels
- After completion, buyer can leave review

**Image Uploads**:
- User selects image → Converted to base64 → Sent to backend
- Backend uploads to Cloudinary → Stores URL to database
- Frontend displays image from Cloudinary URL

## Performance Tips

- **Lazy load** product/gig images (especially in lists)
- **Paginate** marketplace/freelancing if > 100 listings
- **Cache** user profile to reduce /auth/me calls
- **Debounce** search filters to reduce API calls
- **Optimize** Socket.IO events (batch messages)

---

**Ready to build something amazing with your campus community?** 🚀

Start the app and explore! Questions? Check the detailed setup docs above.
