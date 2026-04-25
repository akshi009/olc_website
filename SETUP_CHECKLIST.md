# Frontend-Backend API Setup Checklist

## Prerequisites
- [x] Node.js 18+ installed
- [x] npm or pnpm installed
- [x] Backend code available at `/vercel/share/v0-project/olc_backend`

## Frontend Setup

### Step 1: Install Dependencies
```bash
cd /vercel/share/v0-project/olc
npm install
```
- [ ] Completed

### Step 2: Create Environment File
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

Edit `.env.local` with:
- [ ] `NEXT_PUBLIC_BASE_URL=http://localhost:8080/api` (for local development)
- [ ] `NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id`
- [ ] `NEXT_PUBLIC_RAZORPAY_KEY=your_key`

### Step 3: Start Frontend Dev Server
```bash
npm run dev
```
- [ ] Frontend running on http://localhost:3000
- [ ] No console errors

## Backend Setup

### Step 1: Navigate to Backend
```bash
cd /vercel/share/v0-project/olc_backend
```
- [ ] Completed

### Step 2: Create Environment File
Create `.env` file:
```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
- [ ] Completed

### Step 3: Install Dependencies
```bash
npm install
```
- [ ] Completed

### Step 4: Start Backend Server
```bash
npm start
```
- [ ] Backend running on http://localhost:8080
- [ ] Connected to MongoDB
- [ ] CORS enabled

## Verify Integration

### Test 1: Products Endpoint
```bash
curl http://localhost:8080/api/products
```
- [ ] Returns product data
- [ ] Status code: 200

### Test 2: Frontend Can Reach Backend
Open browser console and check Network tab when visiting http://localhost:3000
- [ ] No CORS errors
- [ ] API requests show in Network tab

### Test 3: Home Page Loads Products
Visit http://localhost:3000
- [ ] Products display on home page
- [ ] No 404 or 500 errors

### Test 4: Search Products
Type in header search box
- [ ] Products appear in dropdown
- [ ] Search results match query

### Test 5: Add to Cart (Requires Login)
1. Log in via Google OAuth
2. Click "Add to Cart" on any product
- [ ] Product added to cart
- [ ] Cart count increases
- [ ] No error messages

### Test 6: Wishlist
1. Click heart icon on product
- [ ] Heart fills (wishlisted)
- [ ] No error messages

### Test 7: Admin Dashboard
Visit http://localhost:3000/admin
- [ ] Products load
- [ ] Orders load
- [ ] Events load
- [ ] Can create/edit/delete items

## API Endpoints Verification

Run these curl commands to verify all endpoints:

### Products
```bash
# Get all
curl http://localhost:8080/api/products

# Search
curl "http://localhost:8080/api/products?search=candle"
```
- [ ] Working

### Cart
```bash
# Get cart (replace userId)
curl http://localhost:8080/api/cart/user_id

# Add to cart
curl -X POST http://localhost:8080/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"userId":"user_id","productId":"product_id","quantity":1}'
```
- [ ] Working

### Wishlist
```bash
# Get wishlist
curl http://localhost:8080/api/wishlist/user_id
```
- [ ] Working

### Orders
```bash
# Get orders
curl http://localhost:8080/api/orders/user_id
```
- [ ] Working

### Events
```bash
# Get events
curl http://localhost:8080/api/events
```
- [ ] Working

## Common Issues & Solutions

### CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`
**Solution**: 
- Ensure backend has `app.use(cors())` in index.js
- Check `NEXT_PUBLIC_BASE_URL` is correct

### 404 Not Found
**Error**: `Cannot GET /api/products`
**Solution**:
- Verify backend is running on port 8080
- Check router file exists in backend

### MongoDB Connection Error
**Error**: `Cannot connect to MongoDB`
**Solution**:
- Check MongoDB is running
- Verify `MONGODB_URI` in .env
- Check network connectivity

### Port Already in Use
**Error**: `Port 3000/8080 already in use`
**Solution**:
```bash
# Kill process on port
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:8080 | xargs kill -9  # Backend
```

### API Service File Not Found
**Error**: `Module not found: api.ts`
**Solution**:
- Ensure file exists at `/app/services/api.ts`
- Restart dev server

## After Verification

### Production Deployment

#### Frontend Deployment (Vercel)
```bash
# Build for production
npm run build

# Deploy
npm run deploy
# or push to GitHub and connect to Vercel
```
- [ ] Built successfully
- [ ] Deployed to Vercel
- [ ] Production URL works

#### Backend Deployment (Your Host)
Update `NEXT_PUBLIC_BASE_URL` to production backend URL
```env
NEXT_PUBLIC_BASE_URL=https://your-backend-domain.com/api
```
- [ ] Environment updated
- [ ] Backend deployed
- [ ] Tested with production backend

### Environment Security
- [ ] Never commit `.env.local` (added to .gitignore)
- [ ] Store secrets in Vercel environment variables
- [ ] Use different keys for development and production
- [ ] Rotate API keys regularly

## File Structure Verification

Ensure these key files exist:
- [ ] `/app/services/api.ts` - API service layer
- [ ] `/app/home/page.tsx` - Uses API
- [ ] `/app/header/page.tsx` - Uses API
- [ ] `/app/product/[id]/page.tsx` - Uses API
- [ ] `/app/admin/page.tsx` - Uses API
- [ ] `/.env.example` - Environment template
- [ ] `/API_INTEGRATION_GUIDE.md` - Documentation

## Testing Checklist

### Functionality Tests
- [ ] Products load from backend
- [ ] Search works
- [ ] Add to cart works (logged in)
- [ ] Wishlist works (logged in)
- [ ] Admin can manage products
- [ ] Admin can manage orders
- [ ] Admin can manage events
- [ ] User authentication works

### Performance Tests
- [ ] Page load < 3 seconds
- [ ] API response < 500ms
- [ ] No console errors
- [ ] No memory leaks

### Security Tests
- [ ] Auth token in localStorage (not exposed)
- [ ] HTTPS in production
- [ ] CORS properly configured
- [ ] User can only access their data

## Documentation & References

- **API Integration Guide**: `/API_INTEGRATION_GUIDE.md`
- **Backend Setup**: `/olc_backend/README.md` (if exists)
- **Environment Variables**: `/.env.example`
- **API Service**: `/app/services/api.ts`

## Support Resources

| Issue | Resource |
|-------|----------|
| API Connection | Check API_INTEGRATION_GUIDE.md |
| Backend Setup | Check olc_backend documentation |
| Frontend Dev | Check Next.js docs |
| Authentication | Check backend auth controller |
| Payments | Check Razorpay integration |

## Final Checklist

- [ ] Frontend installed and running
- [ ] Backend installed and running
- [ ] Environment variables configured
- [ ] All API endpoints verified
- [ ] Home page products loading
- [ ] Cart working
- [ ] Wishlist working
- [ ] Admin dashboard working
- [ ] No console errors
- [ ] Ready for production

---

**Status**: Setup Complete ✅
**Date**: April 25, 2026
**Next**: Deploy to production or continue development
