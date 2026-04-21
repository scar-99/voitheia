# Voitheia Backend Setup Guide

Complete step-by-step guide to set up and run the production-ready Voitheia backend.

## Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- Cloudinary account (for image uploads)

## Step 1: Project Initialization

Create and initialize the project:
```bash
mkdir voitheia-backend && cd voitheia-backend
npm init -y
npm install express mongoose bcryptjs jsonwebtoken cors dotenv cloudinary socket.io
npm install -D nodemon
```

Update `package.json`:
```json
{
  "type": "module",
  "scripts": {
    "dev": "nodemon server.js",
    "start": "node server.js"
  }
}
```

## Step 2: Environment Setup

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/voitheia
JWT_SECRET=voitheia_secret_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Step 3: Project Structure

```
backend/
├── config/
│   ├── db.js
│   └── cloudinary.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Gig.js
│   ├── Order.js
│   ├── Message.js
│   └── Review.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── gigController.js
│   ├── orderController.js
│   └── messageController.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── gigs.js
│   ├── orders.js
│   └── messages.js
├── socket/
│   └── socketHandler.js
├── server.js
├── .env
└── package.json
```

## Step 4: Running the Server

```bash
# Development with auto-reload
npm run dev

# Production
npm start
```

Server starts on `http://localhost:5000`

## API Endpoints Documentation

### Authentication (`/api/auth`)

#### Register
```
POST /api/auth/register
Body: { name, email, password, college }
Response: { token, user }
```

#### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token, user }
```

#### Get Current User
```
GET /api/auth/me
Headers: Authorization: Bearer {token}
Response: user object
```

#### Update Profile
```
PUT /api/auth/profile
Headers: Authorization: Bearer {token}
Body: { name, bio, college, avatar }
Response: updated user
```

### Products (`/api/products`)

#### Get All Products
```
GET /api/products
Query params:
  - keyword: search by title
  - category: 'books', 'electronics', 'clothing', 'hostel', 'sports', 'other'
  - minPrice, maxPrice: price range
  - sort: 'newest', 'oldest', 'price_asc', 'price_desc'
  - status: 'available', 'sold'
Response: array of products
```

#### Get Product by ID
```
GET /api/products/:id
Response: product with seller details
```

#### Create Product
```
POST /api/products
Headers: Authorization: Bearer {token}
Body: {
  title (required),
  description,
  price (required),
  category,
  condition,
  images (array of base64 strings)
}
Response: created product
```

#### Update Product
```
PUT /api/products/:id
Headers: Authorization: Bearer {token}
Body: { title, description, price, category, condition, images }
Response: updated product
```

#### Delete Product
```
DELETE /api/products/:id
Headers: Authorization: Bearer {token}
Response: { message: 'Product deleted' }
```

#### Mark Product as Sold
```
PATCH /api/products/:id/sold
Headers: Authorization: Bearer {token}
Response: updated product
```

#### Toggle Wishlist
```
PATCH /api/products/:id/wishlist
Headers: Authorization: Bearer {token}
Response: { wishlist: [...] }
```

### Gigs (`/api/gigs`)

#### Get All Gigs
```
GET /api/gigs
Query params:
  - keyword: search by title
  - category: 'coding', 'design', 'writing', 'tutoring', 'editing', 'photography', 'other'
  - sort: 'newest', 'price_asc', 'price_desc'
Response: array of gigs
```

#### Get Gig by ID
```
GET /api/gigs/:id
Response: gig with freelancer details
```

#### Create Gig
```
POST /api/gigs
Headers: Authorization: Bearer {token}
Body: {
  title (required),
  description,
  price (required),
  deliveryDays (required),
  category,
  images (array of base64 strings)
}
Response: created gig
```

#### Update Gig
```
PUT /api/gigs/:id
Headers: Authorization: Bearer {token}
Body: { title, description, price, deliveryDays, category, images }
Response: updated gig
```

#### Delete Gig
```
DELETE /api/gigs/:id
Headers: Authorization: Bearer {token}
Response: { message: 'Gig deleted' }
```

### Orders (`/api/orders`)

#### Create Order
```
POST /api/orders
Headers: Authorization: Bearer {token}
Body: {
  type: 'marketplace' | 'freelancing' (required),
  gigId (if freelancing),
  productId (if marketplace),
  sellerId (required),
  price (required),
  note
}
Response: created order
```

#### Get My Orders
```
GET /api/orders
Headers: Authorization: Bearer {token}
Query params:
  - role: 'buyer' | 'seller'
Response: array of orders
```

#### Get Order by ID
```
GET /api/orders/:id
Headers: Authorization: Bearer {token}
Response: order with all populated data
```

#### Update Order Status
```
PATCH /api/orders/:id/status
Headers: Authorization: Bearer {token}
Body: { status: 'accepted' | 'in_progress' | 'completed' | 'cancelled' }
Response: updated order
```

#### Add Review
```
POST /api/orders/review
Headers: Authorization: Bearer {token}
Body: {
  orderId (required),
  revieweeId (required),
  rating: 1-5 (required),
  comment
}
Response: created review
```

#### Get User Reviews
```
GET /api/orders/reviews/:userId
Response: array of reviews for the user
```

### Messages (`/api/messages`)

#### Get My Chats
```
GET /api/messages
Headers: Authorization: Bearer {token}
Response: array of chats with last message
```

#### Get Chat History
```
GET /api/messages/:chatId
Headers: Authorization: Bearer {token}
Response: array of messages in chat
```

### Socket.io Events

#### Connect
```javascript
socket.emit('joinRoom', chatId);
```

#### Send Message
```javascript
socket.emit('sendMessage', {
  chatId: 'uid1_uid2',
  senderId: userId,
  text: 'message content'
});
```

#### Receive Message
```javascript
socket.on('message', (message) => {
  // Handle incoming message
});
```

## Error Handling

All errors return in format:
```json
{
  "message": "Error description"
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found
- `500`: Server error

## Testing with Postman

1. **Register User**
   ```
   POST http://localhost:5000/api/auth/register
   Body: {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "college": "MIT"
   }
   ```

2. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   Body: {
     "email": "john@example.com",
     "password": "password123"
   }
   ```
   Save the token from response.

3. **Create Product**
   ```
   POST http://localhost:5000/api/products
   Headers: Authorization: Bearer {token}
   Body: {
     "title": "Used Calculus Textbook",
     "description": "Excellent condition",
     "price": 2500,
     "category": "books",
     "condition": "like new",
     "images": ["base64_string_here"]
   }
   ```

4. **Chat (via Socket.io)**
   ```javascript
   const socket = io('http://localhost:5000');
   socket.emit('joinRoom', 'uid1_uid2');
   socket.emit('sendMessage', {
     chatId: 'uid1_uid2',
     senderId: userId,
     text: 'Hello!'
   });
   socket.on('message', console.log);
   ```

## Production Checklist

- [ ] Update JWT_SECRET in .env
- [ ] Set up MongoDB cloud (Atlas)
- [ ] Set up Cloudinary account
- [ ] Test all API endpoints
- [ ] Enable HTTPS
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for frontend domain
- [ ] Set up logging
- [ ] Deploy to production server

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check MONGO_URI in .env

### Cloudinary Upload Error
- Verify credentials in .env
- Ensure 'voitheia' folder exists in Cloudinary

### Socket.io Connection Error
- Check origin in CORS settings
- Ensure frontend connects to correct URL

### Token Expired
- JWT expires after 7 days
- User must login again

## Security Notes

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- All routes requiring auth use `protect` middleware
- Only authorized users can modify their own content
