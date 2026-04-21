# Voitheia Frontend — Complete Setup Guide

Welcome! Your React frontend is now ready. This guide will walk you through running and using the application.

## Prerequisites

✅ Node.js v18+ installed  
✅ npm installed  
✅ All frontend dependencies installed (`npm install` completed)  
✅ Backend running on `http://localhost:5000`  

## File Structure

```
voitheia/frontend/
├── src/
│   ├── api/
│   │   ├── axios.js              # Axios instance with auth interceptor
│   │   ├── auth.js               # Authentication API functions
│   │   ├── products.js           # Products API functions
│   │   ├── gigs.js               # Freelance gigs API functions
│   │   ├── orders.js             # Orders & reviews API functions
│   │   └── messages.js           # Chat messages API functions
│   ├── components/
│   │   ├── Navbar.jsx            # Top navigation bar
│   │   ├── ProductCard.jsx       # Product listing card
│   │   ├── GigCard.jsx           # Gig listing card
│   │   ├── Spinner.jsx           # Loading spinner
│   │   └── StarRating.jsx        # 5-star rating component
│   ├── context/
│   │   ├── AuthContext.jsx       # Auth state & user context
│   │   └── SocketContext.jsx     # Socket.IO connection context
│   ├── pages/
│   │   ├── Home.jsx              # Landing page with hero
│   │   ├── Auth/
│   │   │   ├── Login.jsx         # Login page
│   │   │   └── Register.jsx      # Registration page
│   │   ├── Marketplace/
│   │   │   ├── Marketplace.jsx   # Products browser with filters
│   │   │   ├── ProductDetail.jsx # Single product detail view
│   │   │   └── AddProduct.jsx    # Create/list a product
│   │   ├── Freelancing/
│   │   │   ├── Freelancing.jsx   # Gigs browser with filters
│   │   │   └── AddGig.jsx        # Create/publish a gig
│   │   ├── Chat/
│   │   │   └── ChatPage.jsx      # Real-time chat interface
│   │   └── Dashboard/
│   │       └── Dashboard.jsx     # User orders & transactions
│   ├── App.jsx                   # Main app wrapper with routing
│   ├── main.jsx                  # React DOM entry point
│   └── index.css                 # Global styles & design tokens
├── index.html
├── vite.config.js                # Vite config with /api proxy
├── package.json
└── node_modules/                 # Dependencies
```

## Running the Frontend

### Step 1: Start the Backend
Open a terminal and run:
```bash
cd voitheia/backend
npm run dev
```
Backend will be available at `http://localhost:5000`

### Step 2: Start the Frontend
Open another terminal and run:
```bash
cd voitheia/frontend
npm run dev
```
Frontend will be available at `http://localhost:5173`

### Step 3: Open in Browser
Visit **http://localhost:5173** and start using Voitheia!

## Key Features Implemented

### 🔐 Authentication
- Register new account with name, email, password, college
- Login with credentials
- JWT token stored in localStorage
- Automatic logout on token expiration
- Profile management page

### 🛍️ Marketplace
- Browse products with filters (category, price, keyword)
- Sort by newest, price: low→high, price: high→low
- View detailed product page with seller info & ratings
- Buy products (creates order)
- Mark products as sold (if owner)
- Delete product listings (if owner)
- Wishlist feature
- Real-time chat with seller

### 💼 Freelancing
- Browse gigs with filters (category, keyword)
- View detailed gig page with freelancer portfolio
- Hire freelancers (creates order)
- Post your own services/gigs
- Manage active gigs

### 💬 Real-Time Chat
- Socket.IO-powered instant messaging
- Direct messages with product sellers/freelancers
- Message history persisted to database
- Auto-scroll to latest messages
- Typing indicator ready for enhancement

### 📊 Dashboard
- **My Purchases Tab**: Track orders as buyer
  - View pending, accepted, in-progress, completed orders
  - Chat with seller
  - Mark orders complete when done
  - Cancel orders if not yet accepted
  
- **My Sales Tab**: Track orders as seller
  - View buyer requests
  - Accept/reject orders
  - Start work (mark in-progress)
  - Chat with buyer
  - Cancel orders if needed

- **Profile Card**: Shows your name, college, rating, review count

### ⭐ Reviews & Ratings
- Leave 1-5 star reviews after completed orders
- Automatic average rating calculation
- View all reviews for any user
- Only reviewable after order completion

## API Integration

All API calls use Axios with automatic JWT token injection:

```javascript
// Example: User API flow
import { login, register, getMe } from './api/auth';

const { data } = await login({ email, password });
// Returns: { token: 'jwt...', user: {...} }
```

**API Base URL**: `/api` (proxied to `http://localhost:5000`)

### Endpoints Used

**Auth**: `/auth/register`, `/auth/login`, `/auth/me`, `/auth/profile`

**Products**: `/products`, `/products/:id`, `/products` (POST), `/products/:id` (PUT), `/products/:id` (DELETE), `/products/:id/sold`, `/products/:id/wishlist`

**Gigs**: `/gigs`, `/gigs/:id`, `/gigs` (POST), `/gigs/:id` (PUT), `/gigs/:id` (DELETE)

**Orders**: `/orders` (POST), `/orders` (GET), `/orders/:id`, `/orders/:id/status` (PATCH), `/orders/review` (POST), `/orders/reviews/:userId`

**Messages**: `/messages`, `/messages/:chatId`

## Design System

Color palette (`src/index.css`):
- **Primary**: `#7F77DD` (purple)
- **Primary Dark**: `#534AB7` (dark purple)
- **Surface**: `#f8f8fc` (light gray)
- **Card**: `#ffffff` (white)
- **Border**: `#e8e8f0` (light border)
- **Text**: `#1a1a2e` (dark)
- **Muted**: `#6b6b8a` (gray text)
- **Success**: `#1D9E75` (green)
- **Danger**: `#e24b4a` (red)

## Component Highlights

### ProductCard
Shows product image, title, price, condition badge, seller name & rating. Clickable to product detail.

### GigCard
Shows gig image, freelancer info, title, delivery time, and starting price. Clickable to gig detail.

### StarRating
Interactive 5-star rating component. Used in reviews and seller profiles.

### Spinner
Loading animation shown while fetching data.

## Deployment Ready

The frontend is production-ready with:
- Environment-aware API proxy (works for dev & production)
- Responsive design (mobile, tablet, desktop)
- Error handling with toast notifications
- Loading states on all async operations
- Protected routes for authenticated features
- Real-time updates via Socket.IO

To build for production:
```bash
npm run build
```

## Troubleshooting

**"Cannot connect to backend"**
- Ensure backend is running on port 5000
- Check CORS headers in backend (should allow localhost:5173)

**"Login keeps redirecting to login page"**
- Check browser localStorage for `voitheia_token`
- Try clearing localStorage and re-register/login

**"Messages not sending"**
- Ensure Socket.IO connection is established
- Check browser console for connection errors
- Verify backend Socket.IO handler is running

**"Images not loading"**
- Check that Cloudinary is configured in backend .env
- Verify base64 image upload in AddProduct/AddGig works
- Check browser console for 4xx errors

## Next Steps

1. **Testing**: Use TESTING_GUIDE.md from backend to test endpoints
2. **Database**: Connect MongoDB Atlas cloud database in backend .env
3. **Image Hosting**: Set up free Cloudinary account for image uploads
4. **Deployment**: Deploy backend to Heroku/Railway/Render and frontend to Vercel/Netlify
5. **Payment**: Add Stripe/Razorpay integration for transactions

## Support

For backend API issues, see: `../backend/API_REFERENCE.md`  
For setup issues, see: `../backend/BACKEND_SETUP.md`  

Happy building! 🚀
