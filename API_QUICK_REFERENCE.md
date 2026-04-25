# API Quick Reference Card

## Import the API Service

```typescript
import { 
  productsAPI, 
  cartAPI, 
  wishlistAPI, 
  profileAPI, 
  ordersAPI, 
  eventsAPI, 
  authAPI 
} from '@/services/api';
```

## Products API

| Method | Use Case | Example |
|--------|----------|---------|
| `getAll()` | Get all products | `const products = await productsAPI.getAll();` |
| `getById(id)` | Get single product | `const product = await productsAPI.getById('123');` |
| `search(query)` | Search products | `const results = await productsAPI.search('candle');` |
| `create(formData)` | Add product (admin) | `await productsAPI.create(formData);` |
| `update(id, formData)` | Update product | `await productsAPI.update('123', formData);` |
| `delete(id)` | Delete product | `await productsAPI.delete('123');` |

## Cart API

| Method | Use Case | Example |
|--------|----------|---------|
| `getCart(userId)` | Get user's cart | `const cart = await cartAPI.getCart(userId);` |
| `addToCart(userId, productId, qty)` | Add item | `await cartAPI.addToCart(userId, productId, 1);` |
| `updateCart(userId, productId, qty)` | Update quantity | `await cartAPI.updateCart(userId, productId, 2);` |
| `removeFromCart(userId, productId)` | Remove item | `await cartAPI.removeFromCart(userId, productId);` |
| `clearCart(userId)` | Empty cart | `await cartAPI.clearCart(userId);` |

## Wishlist API

| Method | Use Case | Example |
|--------|----------|---------|
| `getWishlist(userId)` | Get wishlist | `const list = await wishlistAPI.getWishlist(userId);` |
| `addToWishlist(userId, productId)` | Add item | `await wishlistAPI.addToWishlist(userId, productId);` |
| `removeFromWishlist(userId, productId)` | Remove item | `await wishlistAPI.removeFromWishlist(userId, productId);` |

## Profile API

| Method | Use Case | Example |
|--------|----------|---------|
| `getProfile(userId)` | Get user profile | `const profile = await profileAPI.getProfile(userId);` |
| `updateProfile(userId, data)` | Update profile | `await profileAPI.updateProfile(userId, {...});` |
| `updatePassword(userId, old, new)` | Change password | `await profileAPI.updatePassword(userId, oldPwd, newPwd);` |

## Orders API

| Method | Use Case | Example |
|--------|----------|---------|
| `getOrders(userId)` | Get user's orders | `const orders = await ordersAPI.getOrders(userId);` |
| `getOrderById(orderId)` | Get order details | `const order = await ordersAPI.getOrderById(orderId);` |
| `createPayment(data)` | Create payment | `const pay = await ordersAPI.createPayment({...});` |
| `verifyPayment(data)` | Verify payment | `const verified = await ordersAPI.verifyPayment({...});` |
| `createOrder(data)` | Create order | `const order = await ordersAPI.createOrder({...});` |
| `updateOrderStatus(orderId, status)` | Update status | `await ordersAPI.updateOrderStatus(orderId, 'shipped');` |
| `cancelOrder(orderId)` | Cancel order | `await ordersAPI.cancelOrder(orderId);` |

## Events API

| Method | Use Case | Example |
|--------|----------|---------|
| `getAll()` | Get all events | `const events = await eventsAPI.getAll();` |
| `getById(id)` | Get event details | `const event = await eventsAPI.getById('123');` |
| `create(formData)` | Add event (admin) | `await eventsAPI.create(formData);` |
| `update(id, formData)` | Update event | `await eventsAPI.update('123', formData);` |
| `delete(id)` | Delete event | `await eventsAPI.delete('123');` |

## Auth API

| Method | Use Case | Example |
|--------|----------|---------|
| `googleLogin(code)` | Google auth | `const auth = await authAPI.googleLogin(code);` |
| `logout()` | Logout user | `await authAPI.logout();` |

## Common Patterns

### Get Data with Error Handling
```typescript
try {
  const data = await productsAPI.getAll();
  // Use data
} catch (error) {
  console.error('Failed:', error);
  // Show error to user
}
```

### With React Query
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['products'],
  queryFn: () => productsAPI.getAll(),
});

if (isLoading) return <Loader />;
if (error) return <Error />;
return <ProductList products={data} />;
```

### Upload File (FormData)
```typescript
const formData = new FormData();
formData.append('name', 'Product Name');
formData.append('price', 100);
formData.append('image', fileInput.files[0]); // File object

const result = await productsAPI.create(formData);
```

### Mutation with React Query
```typescript
const mutation = useMutation({
  mutationFn: (data) => cartAPI.addToCart(userId, data.productId, data.qty),
  onSuccess: () => {
    toast.success('Added to cart!');
    queryClient.invalidateQueries(['cart']);
  },
  onError: () => {
    toast.error('Failed to add to cart');
  },
});

mutation.mutate({ productId: '123', qty: 1 });
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_BASE_URL=http://localhost:8080/api

# Optional
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_id
NEXT_PUBLIC_RAZORPAY_KEY=your_key
```

## HTTP Methods Used

| API | Method | Endpoint |
|-----|--------|----------|
| GET products | GET | `/products` |
| Search | GET | `/products?search=query` |
| Get cart | GET | `/cart/:userId` |
| Add to cart | POST | `/cart/add` |
| Update cart | PUT | `/cart/update` |
| Delete item | DELETE | `/cart/remove` |
| Get wishlist | GET | `/wishlist/:userId` |
| Add wishlist | POST | `/wishlist/add` |
| Remove wishlist | DELETE | `/wishlist/remove` |

## Component Usage Examples

### Home Page
```typescript
const { data: products } = useQuery({
  queryKey: ['products'],
  queryFn: () => productsAPI.getAll(),
});
```

### Search
```typescript
const results = await productsAPI.search(query);
```

### Add to Cart
```typescript
await cartAPI.addToCart(userId, productId, quantity);
```

### Add to Wishlist
```typescript
await wishlistAPI.addToWishlist(userId, productId);
```

### Admin Products
```typescript
// Create
await productsAPI.create(formData);

// Update
await productsAPI.update(id, formData);

// Delete
await productsAPI.delete(id);
```

### Admin Orders
```typescript
const orders = await ordersAPI.getOrders(userId);
await ordersAPI.updateOrderStatus(orderId, 'shipped');
```

## Authentication Flow

```
User Logs In
    ↓
Token Stored in localStorage
    ↓
API Service Adds Token to Headers
    ↓
Request Sent with Authorization: Bearer token
    ↓
Backend Validates Token
    ↓
Response Returned
```

If token expires (401):
- API Service catches error
- Clears localStorage
- Redirects to login page

## Error Handling

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized (redirect to login)
- `404` - Not Found
- `500` - Server Error

### Error Handling in Components
```typescript
try {
  const data = await productsAPI.getAll();
  // Use data
  setProducts(data);
} catch (error) {
  // Error caught automatically
  console.error(error);
  setError('Failed to load products');
}
```

## File Locations

| Component | File | API Used |
|-----------|------|----------|
| Home | `/app/home/page.tsx` | `productsAPI.getAll()` |
| Header | `/app/header/page.tsx` | `cartAPI`, `wishlistAPI`, `productsAPI.search()` |
| Product | `/app/product/[id]/page.tsx` | `productsAPI.getById()`, `cartAPI`, `wishlistAPI` |
| Admin | `/app/admin/page.tsx` | All APIs |

## Files in Project

```
/app/
├── services/
│   └── api.ts                    ← All API methods here
├── home/page.tsx                 ← Uses productsAPI
├── header/page.tsx               ← Uses cart/wishlist APIs
├── product/[id]/page.tsx         ← Uses product APIs
└── admin/page.tsx                ← Uses all APIs
```

## Key Files

- **API Service**: `/app/services/api.ts` (240 lines)
- **Docs**: `/API_INTEGRATION_GUIDE.md`
- **Setup**: `/SETUP_CHECKLIST.md`
- **Quick Start**: `/QUICK_START.md`

## Getting Help

1. Check `/API_INTEGRATION_GUIDE.md` for detailed docs
2. Check `/app/services/api.ts` for method signatures
3. Check component files for usage examples
4. Check browser Network tab for API requests
5. Check backend logs for server errors

## Testing API

### In Browser Console
```javascript
const api = await import('./services/api.ts');

// Test products
api.productsAPI.getAll().then(d => console.log(d));

// Test search
api.productsAPI.search('candle').then(d => console.log(d));
```

### Via Curl
```bash
curl http://localhost:8080/api/products
curl http://localhost:8080/api/events
curl http://localhost:8080/api/wishlist/user_id
```

---

**Quick Reference** | Last Updated: April 25, 2026
