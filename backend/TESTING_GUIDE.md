## Quick Start Testing Guide

Below is a copy-paste guide for testing the API with curl or Postman.

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "college": "MIT"
  }'
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "college": "MIT"
  }
}
```

Save the token for next requests.

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Update Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe Updated",
    "bio": "Student at MIT",
    "college": "MIT"
  }'
```

### 5. Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Used Calculus Textbook",
    "description": "Excellent condition, minimal notes",
    "price": 2500,
    "category": "books",
    "condition": "like new",
    "images": []
  }'
```

### 6. Get All Products
```bash
curl -X GET "http://localhost:5000/api/products?keyword=textbook&category=books&sort=newest" \
  -H "Content-Type: application/json"
```

### 7. Get Product by ID
```bash
curl -X GET http://localhost:5000/api/products/PRODUCT_ID \
  -H "Content-Type: application/json"
```

### 8. Mark Product as Sold
```bash
curl -X PATCH http://localhost:5000/api/products/PRODUCT_ID/sold \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 9. Create Gig
```bash
curl -X POST http://localhost:5000/api/gigs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "I will help you with Calculus",
    "description": "30min tutoring session on any calculus topic",
    "price": 500,
    "deliveryDays": 1,
    "category": "tutoring",
    "images": []
  }'
```

### 10. Get All Gigs
```bash
curl -X GET "http://localhost:5000/api/gigs?keyword=calculus&category=tutoring&sort=newest"
```

### 11. Create Order
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer BUYER_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "freelancing",
    "gigId": "GIG_ID_HERE",
    "sellerId": "SELLER_ID_HERE",
    "price": 500,
    "note": "I need help with derivatives"
  }'
```

### 12. Get My Orders
```bash
curl -X GET "http://localhost:5000/api/orders?role=buyer" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 13. Update Order Status
```bash
curl -X PATCH http://localhost:5000/api/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'
```

### 14. Add Review
```bash
curl -X POST http://localhost:5000/api/orders/review \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORDER_ID_HERE",
    "revieweeId": "SELLER_ID_HERE",
    "rating": 5,
    "comment": "Excellent tutoring session!"
  }'
```

### 15. Get User Reviews
```bash
curl -X GET http://localhost:5000/api/orders/reviews/USER_ID
```

### 16. Get My Chats
```bash
curl -X GET http://localhost:5000/api/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 17. Get Chat History
```bash
curl -X GET "http://localhost:5000/api/messages/uid1_uid2" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Socket.io Messages (JavaScript Client)
```javascript
const { io } = require('socket.io-client');

const socket = io('http://localhost:5000');

// Join a chat room
socket.emit('joinRoom', 'uid1_uid2');

// Send a message
socket.emit('sendMessage', {
  chatId: 'uid1_uid2',
  senderId: 'YOUR_USER_ID',
  text: 'Hello there!'
});

// Listen for incoming messages
socket.on('message', (msg) => {
  console.log('New message:', msg);
});

// Handle errors
socket.on('error', (err) => {
  console.error('Socket error:', err);
});
```

## Notes

- Replace `YOUR_TOKEN_HERE` with actual JWT token from login/register
- Replace `PRODUCT_ID`, `GIG_ID`, `ORDER_ID` with actual IDs from responses
- Image uploads should be base64 encoded strings (done by frontend)
- All timestamps are in ISO 8601 format
- Prices are in smallest currency unit (e.g., paise for INR)
