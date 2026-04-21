# 📋 Voitheia API Reference Card

Quick reference guide for all API endpoints.

## Authentication Endpoints

| Method | Endpoint | Auth | Body | Response |
|--------|----------|------|------|----------|
| POST | `/auth/register` | — | `{name, email, password, college}` | `{token, user}` |
| POST | `/auth/login` | — | `{email, password}` | `{token, user}` |
| GET | `/auth/me` | ✅ | — | `user` |
| PUT | `/auth/profile` | ✅ | `{name, bio, college, avatar}` | `user` |

## Product Endpoints

| Method | Endpoint | Auth | Query Params | Body | Response |
|--------|----------|------|--------------|------|----------|
| GET | `/products` | — | `keyword, category, minPrice, maxPrice, sort, status` | — | `[products]` |
| GET | `/products/:id` | — | — | — | `product` |
| POST | `/products` | ✅ | — | `{title, description, price, category, condition, images}` | `product` |
| PUT | `/products/:id` | ✅ | — | `{title, description, price, category, condition}` | `product` |
| DELETE | `/products/:id` | ✅ | — | — | `{message}` |
| PATCH | `/products/:id/sold` | ✅ | — | — | `product` |
| PATCH | `/products/:id/wishlist` | ✅ | — | — | `{wishlist}` |

**Product Categories:** books, electronics, clothing, hostel, sports, other  
**Conditions:** new, like new, good, fair  
**Sort:** newest, oldest, price_asc, price_desc

## Gig Endpoints

| Method | Endpoint | Auth | Query Params | Body | Response |
|--------|----------|------|--------------|------|----------|
| GET | `/gigs` | — | `keyword, category, sort` | — | `[gigs]` |
| GET | `/gigs/:id` | — | — | — | `gig` |
| POST | `/gigs` | ✅ | — | `{title, description, price, deliveryDays, category, images}` | `gig` |
| PUT | `/gigs/:id` | ✅ | — | `{title, description, price, deliveryDays, category}` | `gig` |
| DELETE | `/gigs/:id` | ✅ | — | — | `{message}` |

**Gig Categories:** coding, design, writing, tutoring, editing, photography, other

## Order Endpoints

| Method | Endpoint | Auth | Query Params | Body | Response |
|--------|----------|------|--------------|------|----------|
| POST | `/orders` | ✅ | — | `{type, gigId?, productId?, sellerId, price, note?}` | `order` |
| GET | `/orders` | ✅ | `role` (buyer/seller) | — | `[orders]` |
| GET | `/orders/:id` | ✅ | — | — | `order` |
| PATCH | `/orders/:id/status` | ✅ | — | `{status}` | `order` |
| POST | `/orders/review` | ✅ | — | `{orderId, revieweeId, rating, comment?}` | `review` |
| GET | `/orders/reviews/:userId` | — | — | — | `[reviews]` |

**Order Types:** marketplace, freelancing  
**Order Statuses:** pending, accepted, in_progress, completed, cancelled  
**Review Rating:** 1-5

## Message Endpoints

| Method | Endpoint | Auth | Query Params | Body | Response |
|--------|----------|------|--------------|------|----------|
| GET | `/messages` | ✅ | — | — | `[chats]` |
| GET | `/messages/:chatId` | ✅ | — | — | `[messages]` |

**ChatId Format:** Two sorted user IDs: `uid1_uid2`

## Socket.io Events

### Client → Server

```javascript
// Join a chat room
socket.emit('joinRoom', chatId);

// Send a message
socket.emit('sendMessage', {
  chatId: 'uid1_uid2',
  senderId: userId,
  text: 'message content'
});
```

### Server → Client

```javascript
// Receive a message
socket.on('message', (message) => {
  // {
  //   _id: string,
  //   chatId: string,
  //   sender: { _id, name, avatar },
  //   text: string,
  //   createdAt: ISO8601,
  //   updatedAt: ISO8601
  // }
});

// Error event
socket.on('error', (error) => {
  // { message: string }
});
```

## Request Headers

All protected endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

## Response Status Codes

```
200  — OK / Success
201  — Created
204  — No Content
400  — Bad Request
401  — Unauthorized (missing/invalid token)
403  — Forbidden (not authorized for resource)
404  — Not Found
500  — Internal Server Error
```

## Error Response Format

```json
{
  "message": "Error description",
  "stack": "... (only in development)"
}
```

## Data Types & Formats

### User Object
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string (lowercase)",
  "avatar": "string (URL)",
  "college": "string",
  "bio": "string",
  "rating": "number (0-5)",
  "reviewCount": "number",
  "wishlist": ["ObjectId"],
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Product Object
```json
{
  "_id": "ObjectId",
  "seller": "ObjectId | User",
  "title": "string",
  "description": "string",
  "price": "number",
  "category": "enum",
  "condition": "enum",
  "images": ["URL"],
  "status": "available | sold",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Order Object
```json
{
  "_id": "ObjectId",
  "type": "marketplace | freelancing",
  "gig": "ObjectId | Gig",
  "product": "ObjectId | Product",
  "buyer": "ObjectId | User",
  "seller": "ObjectId | User",
  "price": "number",
  "note": "string",
  "status": "enum",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Review Object
```json
{
  "_id": "ObjectId",
  "reviewer": "ObjectId | User",
  "reviewee": "ObjectId | User",
  "order": "ObjectId | Order",
  "rating": "number (1-5)",
  "comment": "string",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

## Pagination (Future)

Currently not implemented. For large datasets, implement:
```
GET /api/products?page=1&limit=20
```

## Rate Limiting (Future)

Not yet implemented. Recommended: 100 requests/minute per user.

## Common Query Filters

### Products
```
keyword=textbook                      # Search by title
category=books                        # Filter by category
minPrice=100&maxPrice=5000           # Price range
sort=newest                           # Sort option
status=available                      # Filter by status
```

### Gigs
```
keyword=calculus                      # Search by title
category=tutoring                     # Filter by category
sort=price_asc                        # Sort option
```

### Orders
```
role=buyer                            # Get buyer orders
role=seller                           # Get seller orders
```

## Authentication Flow

1. **Register/Login** → Get JWT token
2. **Store token** in localStorage/session
3. **Include token** in Authorization header
4. **Token expires** after 7 days
5. **Re-login** to get new token

## WebSocket Connection

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: jwtToken  // optional
  }
});

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});
```

## Cloudinary Image Upload

Frontend sends base64-encoded images in API request body:
```json
{
  "title": "Product",
  "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRg..."]
}
```

Backend uploads to Cloudinary and stores URLs.

---

**Last Updated:** April 2026  
**API Version:** 1.0  
**Base URL:** http://localhost:5000/api
