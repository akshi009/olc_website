# Frontend-Backend API Integration Guide

## Overview

The frontend has been fully connected to the backend API using a centralized API service layer. All HTTP requests now go through a single service file that handles authentication, error handling, and request/response formatting.

## API Service Architecture

### Location
`/app/services/api.ts` - Centralized API client with all endpoint methods

### Benefits
- **Single Source of Truth**: All API calls in one place
- **Automatic Auth Handling**: JWT tokens automatically included
- **Error Handling**: Centralized error management
- **Easy Maintenance**: Update endpoints in one file
- **Type Safety**: Full TypeScript support

## Setup Instructions

### 1. Set Environment Variables

Create or update `.env.local` in the frontend project:

```env
NEXT_PUBLIC_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
```

**Production:**
```env
NEXT_PUBLIC_BASE_URL=https://your-backend.vercel.app/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_RAZORPAY_KEY=your_razorpay_key
```

### 2. Start Backend Server

```bash
cd /vercel/share/v0-project/olc_backend
npm install
npm start
```

Server will run on `http://localhost:8080`

### 3. Start Frontend Server

```bash
cd /vercel/share/v0-project/olc
npm run dev
```

Frontend will run on `http://localhost:3000`

## API Service Methods

### Products API

```typescript
// Get all products
const products = await productsAPI.getAll();

// Get product by ID
const product = await productsAPI.getById('product_id');

// Create product (admin)
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('image', imageFile);
const newProduct = await productsAPI.create(formData);

// Update product (admin)
const updated = await productsAPI.update('product_id', formData);

// Delete product (admin)
await productsAPI.delete('product_id');

// Search products
const results = await productsAPI.search('candle');
```

### Cart API

```typescript
// Get cart for user
const cart = await cartAPI.getCart(userId);

// Add to cart
await cartAPI.addToCart(userId, productId, quantity);

// Update cart item
await cartAPI.updateCart(userId, productId, newQuantity);

// Remove from cart
await cartAPI.removeFromCart(userId, productId);

// Clear entire cart
await cartAPI.clearCart(userId);
```

### Wishlist API

```typescript
// Get user wishlist
const wishlist = await wishlistAPI.getWishlist(userId);

// Add to wishlist
await wishlistAPI.addToWishlist(userId, productId);

// Remove from wishlist
await wishlistAPI.removeFromWishlist(userId, productId);
```

### Profile API

```typescript
// Get user profile
const profile = await profileAPI.getProfile(userId);

// Update profile
await profileAPI.updateProfile(userId, {
  name: 'John Doe',
  email: 'john@example.com'
});

// Change password
await profileAPI.updatePassword(userId, 'oldPassword', 'newPassword');
```

### Orders API

```typescript
// Get user orders
const orders = await ordersAPI.getOrders(userId);

// Get specific order
const order = await ordersAPI.getOrderById(orderId);

// Create payment
const payment = await ordersAPI.createPayment({
  amount: 1000,
  currency: 'INR'
});

// Verify payment
const verified = await ordersAPI.verifyPayment({
  razorpay_order_id: orderId,
  razorpay_payment_id: paymentId,
  razorpay_signature: signature
});

// Create order
const newOrder = await ordersAPI.createOrder({
  items: [...],
  totalAmount: 1000
});

// Update order status
await ordersAPI.updateOrderStatus(orderId, 'shipped');

// Cancel order
await ordersAPI.cancelOrder(orderId);
```

### Events API

```typescript
// Get all events
const events = await eventsAPI.getAll();

// Get event by ID
const event = await eventsAPI.getById(eventId);

// Create event (admin)
const newEvent = await eventsAPI.create(formData);

// Update event (admin)
const updated = await eventsAPI.update(eventId, formData);

// Delete event (admin)
await eventsAPI.delete(eventId);
```

### Auth API

```typescript
// Google login
const authData = await authAPI.googleLogin(googleAuthCode);

// Logout
await authAPI.logout();
```

## Updated Components

### Home Page
- ✅ Products fetched from backend API
- ✅ Uses `productsAPI.getAll()`
- Location: `/app/home/page.tsx`

### Header Component
- ✅ Wishlist API integrated
- ✅ Cart API integrated  
- ✅ Product search via `productsAPI.search()`
- Location: `/app/header/page.tsx`

### Product Detail Page
- ✅ Product details from `productsAPI.getById()`
- ✅ Wishlist add/remove integrated
- ✅ Cart add integrated
- Location: `/app/product/[id]/page.tsx`

### Admin Dashboard
- ✅ Products management via `productsAPI`
- ✅ Orders management via `ordersAPI`
- ✅ Events management via `eventsAPI`
- Location: `/app/admin/page.tsx`

## Interceptors

The API service automatically handles:

### Request Interceptor
- Adds JWT token from localStorage if available
- Adds Authorization header

### Response Interceptor
- Logs out user if token expires (401)
- Redirects to login page
- Handles error responses

## Error Handling

All API calls should be wrapped in try-catch:

```typescript
try {
  const data = await productsAPI.getAll();
  // Use data
} catch (error) {
  console.error('API Error:', error);
  // Show user-friendly error message
}
```

## Authentication Flow

1. User logs in via Google OAuth
2. Auth token received from backend
3. Token stored in localStorage
4. Token automatically added to all API requests
5. If token expires (401), user redirected to login

## Testing the Integration

### Test 1: Fetch Products
```javascript
// In browser console
const api = await import('/app/services/api.ts');
api.productsAPI.getAll().then(data => console.log(data));
```

### Test 2: Search Products
```javascript
api.productsAPI.search('candle').then(data => console.log(data));
```

### Test 3: Get Wishlist
```javascript
api.wishlistAPI.getWishlist('user_id').then(data => console.log(data));
```

## Troubleshooting

### Issue: CORS Errors
**Solution**: Ensure backend has CORS enabled
```javascript
// In backend index.js
app.use(cors());
```

### Issue: 401 Unauthorized
**Solution**: User not logged in or token expired
- Redirect to login page
- Check localStorage for auth token

### Issue: API Returns 404
**Solution**: Endpoint might not exist
- Check backend router files
- Verify API path in service file

### Issue: FormData Not Sent Correctly
**Solution**: Don't set Content-Type header
- Let axios set it automatically
- Only happens with FormData

## Backend API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?search=query` - Search products
- `POST /api/products/add` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Cart
- `GET /api/cart/:userId` - Get cart
- `POST /api/cart/add` - Add to cart
- `PUT /api/cart/update` - Update quantity
- `DELETE /api/cart/remove` - Remove item
- `DELETE /api/cart/clear` - Clear cart

### Wishlist
- `GET /api/wishlist/:userId` - Get wishlist
- `POST /api/wishlist/add` - Add to wishlist
- `DELETE /api/wishlist/remove` - Remove from wishlist

### Profile
- `GET /api/profile/:userId` - Get profile
- `PUT /api/profile/:userId` - Update profile
- `POST /api/profile/:userId/change-password` - Change password

### Orders
- `GET /api/orders/:userId` - Get user orders
- `GET /api/orders/:orderId` - Get order details
- `POST /api/orders/create-payment` - Create payment
- `POST /api/orders/verify-payment` - Verify payment
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status
- `POST /api/orders/:id/cancel` - Cancel order

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Auth
- `GET /auth/google?code=code` - Google login

## Best Practices

1. **Always use the API service** - Don't make direct fetch/axios calls
2. **Handle errors** - Wrap API calls in try-catch
3. **Show loading states** - Use React Query's `isLoading`
4. **Invalidate queries** - Update cache after mutations
5. **Check auth status** - Verify token before making requests
6. **Use TypeScript** - Define proper types for API responses

## File Structure

```
/app
├── services/
│   └── api.ts           # Centralized API client
├── home/
│   └── page.tsx         # Uses productsAPI.getAll()
├── header/
│   └── page.tsx         # Uses cartAPI, wishlistAPI, productsAPI
├── product/[id]/
│   └── page.tsx         # Uses productsAPI.getById(), cart, wishlist
├── admin/
│   └── page.tsx         # Uses all APIs for management
└── ...
```

## Next Steps

1. ✅ Update .env.local with backend URL
2. ✅ Start backend server
3. ✅ Start frontend server
4. ✅ Test each endpoint
5. ✅ Deploy to production

## Support

For issues or questions, check:
1. Backend logs (console output)
2. Browser Network tab (API requests)
3. Browser Console (error messages)
4. API response status codes

---

**Last Updated**: April 25, 2026
**Version**: 1.0
**Status**: Production Ready
