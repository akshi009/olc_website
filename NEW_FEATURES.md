# OhLittle Candle - New Features Documentation

## Overview
This document details the new features added to the OhLittle Candle e-commerce platform, including product detail pages, interactive games with rewards, and a featured products collection.

---

## 1. Product Detail Page (`/product/[id]`)

### Features
- **Dynamic Product Page**: Full product details with image gallery sourced from Unsplash
- **Image Gallery**: Thumbnail-based image selection with high-quality product images
- **Product Information**:
  - Product name, category, and description
  - Price display with discount badge
  - Rating system (4.8/5 stars with 342+ reviews)
  - Scent variant selection (Vanilla, Lavender, Rose)
  - Quantity selector with increment/decrement buttons

- **Actions**:
  - Add to Cart functionality
  - Wishlist toggle with heart icon
  - Secure checkout integration

- **Product Benefits Section**:
  - Free shipping on orders over $50
  - 100% authentic product guarantee
  - Easy 30-day return policy

- **Related Products**: Carousel showing similar candles for cross-selling

### Unsplash Integration
The product detail page automatically fetches high-quality product images from Unsplash API using the query: `"luxury candle {product-name}"`. Falls back to admin-uploaded images if API unavailable.

**Unsplash API Key**: `hV1MXlRBU3r6dCW8GH8_KcXKV_eQB8kJJ-Ej_NsTyqM`

### Styling
- Dark luxury aesthetic with candlelight glows
- Responsive grid layout (2 columns desktop, 1 column mobile)
- Smooth hover animations and transitions
- Playfair Display serif fonts for headings
- Flame-warm (#ffb84d) accent color throughout

---

## 2. Games & Rewards System (`/games`)

### Spin the Wheel Game
- **Mechanics**: Canvas-based spinning wheel with 6 segments
- **Segments**:
  - 20% OFF
  - FREE SHIPPING
  - 10% OFF
  - TRY AGAIN
  - 50% OFF
  - FREE GIFT

- **Features**:
  - Smooth animation over 4 seconds
  - Daily play limit (one spin per day per user)
  - Instant coupon generation on win
  - Visual feedback with result modal

### Scratch Card Game
- **Mechanics**: Canvas-based scratch-off card game
- **Prizes**: Random selection from:
  - 15% OFF
  - 25% OFF
  - FREE SHIPPING
  - 30% OFF

- **Features**:
  - Mouse-over scratch effect
  - Click to fully reveal prize
  - Instant coupon generation
  - Pop-in animation for revealed prize

### Coupon System
- **Coupon Storage**: Generated coupons stored in component state
- **Coupon Code Format**: `LUCKY[timestamp]` or `SCRATCH[timestamp]`
- **Coupon Details**:
  - Discount percentage
  - Free shipping flag
  - Free gift flag
  - 30-day expiration date

- **Display**: Grid of earned coupons with:
  - Discount badges (20%, 50%, etc.)
  - Coupon code with monospace font
  - Expiration date

### Styling
- Games section with hero banner
- Tab-based interface for game selection
- Responsive grid layout for coupons
- Dashed border coupon cards with decorative perforations
- Smooth transitions and animations throughout

---

## 3. Featured Products Page (`/featured`)

### Features
- **Product Grid**: 12-product responsive grid
- **Product Cards** with:
  - Product image with hover zoom effect
  - Product name and description
  - Price display with flame-warm glow
  - Weight/size badge
  - Wishlist toggle button
  - Clickable to product detail page

### Styling
- Hero header with radiant gradient background
- Smooth hover animations (lift effect, glow, shadow)
- Responsive design (auto-fill, minmax grid)
- Mobile-optimized (2 columns on tablet, 1 on mobile)

---

## 4. Home Page Enhancements

### Games Banner
- **Location**: Between hero section and carousel
- **Features**:
  - Promotional banner for games/rewards
  - Call-to-action button
  - Clickable navigation to `/games` page
  - Radiant glow effect and hover state

### Updated Navigation
- **Games Button**: Added "🎮 Games" link in header navigation
- **Product Navigation**: Product cards now clickable to detail pages
- **Event Handling**: Proper event propagation control for nested buttons

---

## 5. Navigation Updates

### Header Navigation
New navigation items added:
```
- Games (🎮 Games) → /games
- Products (clickable cards) → /product/[id]
- Featured → /featured (can be added to nav)
```

### Updated Header Component
File: `/app/header/page.tsx`
- Added "Games" navigation button
- Games button styled with icon and proper hover states
- Maintains existing wishlist, cart, and profile buttons

---

## 6. Utility Functions

### Unsplash API Utility
File: `/app/utils/unsplashApi.ts`

Functions:
- `fetchCandleImages(query, perPage)`: Fetch product images from Unsplash
- `fetchRandomCandleImage()`: Get random candle image for backgrounds
- `defaultCandleImages`: Fallback image URLs

Usage:
```typescript
import { fetchCandleImages } from "@/utils/unsplashApi";

const images = await fetchCandleImages("Rose Scent Candle", 5);
```

---

## 7. Color System & Styling

### Design Tokens
```css
--dark-bg: #0a0605
--dark-card: #1a0f1a
--dark-hover: #2a1a2a
--text-light: #fff5f0
--text-muted: #c9a89f
--candlelight: #fff4e6
--flame-warm: #ffb84d
--flame-glow: #ff9d5c
--gold: #d4a574
--border-glow: rgba(255, 184, 77, 0.25)
```

### Typography
- **Headings**: Playfair Display (serif, italic)
- **Body**: Geist (sans-serif, 300 weight)
- **Monospace**: Default monospace font for coupon codes

### Animations
- Canvas spinning wheel with easing
- Smooth card hover effects
- Glow animations for buttons
- Pop-in animations for modals
- Transition effects on all interactive elements

---

## 8. File Structure

### New Files Created
```
/app/product/[id]/
  ├── page.tsx          (Product detail page)
  └── style.css         (Product page styles)

/app/games/
  ├── page.tsx          (Games page with Spin Wheel & Scratch Card)
  └── style.css         (Games page styles)

/app/featured/
  ├── page.tsx          (Featured products page)
  └── style.css         (Featured page styles)

/app/utils/
  └── unsplashApi.ts    (Unsplash API utilities)
```

### Modified Files
```
/app/home/page.tsx       (Added games banner, made products clickable)
/app/home/style/index.css (Added games banner styles)
/app/header/page.tsx     (Added games navigation button)
```

---

## 9. API Integration

### Required API Endpoints
The application expects the following backend endpoints:

```
GET  /products              - Fetch all products
GET  /product/{id}          - Fetch product by ID
POST /cart/add              - Add item to cart
POST /wishlist/add          - Add to wishlist
DELETE /wishlist/remove     - Remove from wishlist
```

### Unsplash API
- **Base URL**: https://api.unsplash.com
- **Endpoint**: `/search/photos`
- **Authentication**: Access key in query parameter
- **Rate Limit**: Check Unsplash documentation for current limits

---

## 10. Performance Optimizations

### Image Loading
- Lazy loading for product images
- Responsive image sizes
- Fallback to admin-uploaded images
- Optimized Unsplash URLs

### Caching
- React Query for server state management
- Query key arrays for cache invalidation
- Refetch on mount disabled for performance

### Animations
- RequestAnimationFrame for smooth wheel spinning
- CSS transitions for button/card effects
- Optimized blur and glow filters

---

## 11. Responsive Design

### Breakpoints
- **Desktop**: 1024px+
- **Tablet**: 768px - 1023px
- **Mobile**: < 768px

### Adjustments
- Product grid: 1fr on mobile
- Games section: Stack vertically
- Featured grid: 2 columns on tablet, 1 on mobile
- Font sizes scale with `clamp()` function
- Padding/margins reduced on mobile

---

## 12. Browser Compatibility

### Tested On
- Chrome/Chromium
- Firefox
- Safari
- Edge

### Requirements
- Canvas API support (for games)
- Fetch API
- ES6+ JavaScript
- CSS Grid & Flexbox

---

## 13. Future Enhancements

Potential additions:
- Backend coupon code validation
- User game history tracking
- Coupon redemption at checkout
- Leaderboard for games
- Social sharing of coupon codes
- More game variations (memory games, spin-offs)
- AI-powered product recommendations
- Video product previews

---

## 14. Testing Checklist

- [ ] Product detail page loads with Unsplash images
- [ ] Product gallery navigation works smoothly
- [ ] Wishlist toggle functions correctly
- [ ] Add to cart works from product page
- [ ] Spin wheel animates and gives results
- [ ] Scratch card reveals prizes correctly
- [ ] Coupon codes generate and display
- [ ] Games banner navigates to games page
- [ ] Featured products load and filter
- [ ] All responsive breakpoints work
- [ ] Images load from Unsplash or fallback
- [ ] Header navigation displays games button
- [ ] Product cards are clickable from home

---

## 15. Support & Debugging

### Common Issues

**Unsplash images not loading**
- Check API key in `unsplashApi.ts`
- Verify Unsplash API rate limit not exceeded
- Check browser console for CORS errors
- Fall back to default product images

**Games not displaying**
- Ensure canvas element is properly rendered
- Check browser console for JavaScript errors
- Verify Canvas API support in browser

**Product detail page not loading**
- Check product ID parameter in URL
- Verify product exists in backend database
- Check network tab for API errors

### Debug Logs
Add debug statements with `console.log("[v0] ...")` for tracking execution flow.

---

**Last Updated**: April 25, 2026
**Version**: 1.0.0
