# 3D E-Commerce Website - Candles

A stunning, modern 3D e-commerce website for luxury candles built with React Three Fiber, Three.js, and Next.js. Features interactive 3D product visualization, dynamic lighting, and immersive user experience.

## Overview

This website transforms the traditional candle e-commerce experience into an interactive 3D environment where customers can:
- View products in stunning 3D with interactive rotation
- Switch between 2D photography and 3D models on product pages
- Experience an immersive hero section with animated candles
- Browse a 3D product grid with dynamic lighting

## Tech Stack

- **React Three Fiber** - 3D graphics library for React
- **Three.js** - WebGL 3D JavaScript library
- **@react-three/drei** - Useful helpers and utilities for R3F
- **@react-three/postprocessing** - Post-processing effects
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development

## Project Structure

```
app/
├── components/3d/
│   ├── CandleModel.tsx      # Reusable 3D candle geometry
│   ├── HeroScene.tsx        # Hero section with animated candles
│   ├── ProductViewer.tsx    # Interactive 360° product viewer
│   ├── ProductGrid3D.tsx    # Grid of 3D products
│   ├── styles3d.css         # All 3D component styles
│   └── index.ts             # Exports
├── home/
│   ├── page.tsx            # 3D home page
│   └── style/index.css     # Home and 3D home styles
├── product/[id]/
│   ├── page.tsx            # Product detail with 3D viewer
│   └── style.css           # Product styles with 3D toggle
└── ...

```

## Components

### 1. CandleModel
A reusable 3D candle component that generates procedural candle geometry with:
- Cylindrical wax body with gradient appearance
- Thin wick element
- Flame visualization using cone geometry
- Realistic point light for glow effect
- Auto-rotation capability

**Props:**
- `color` (string) - Hex color of the candle wax (default: '#d4a574')
- `height` (number) - Height of candle in units (default: 8)
- `radius` (number) - Radius of candle (default: 1.2)
- `autoRotate` (boolean) - Enable auto-rotation (default: true)
- `speed` (number) - Rotation speed multiplier (default: 0.5)

```tsx
<CandleModel
  color="#d4a574"
  height={8}
  radius={1.2}
  autoRotate={true}
  speed={1}
/>
```

### 2. HeroScene
Immersive hero section featuring animated 3D candles with:
- Three different candles with varying colors and sizes
- Dynamic lighting setup
- Night environment preset
- Overlay text content
- Smooth animations and glow effects

```tsx
<HeroScene />
```

### 3. ProductViewer
Interactive 360° product viewer for individual products with:
- Full mouse controls (drag to rotate, scroll to zoom)
- Play/pause rotation button
- Product-specific customization (color, height)
- Ambient and spotlight setup for realistic lighting

**Props:**
- `productId` (string) - Product ID
- `productColor` (string) - Candle color (default: '#d4a574')
- `productHeight` (number) - Candle height (default: 8)
- `productName` (string) - Product name (default: 'Luxury Candle')

```tsx
<ProductViewer
  productId="prod123"
  productColor="#d4a574"
  productHeight={8}
  productName="Rose Vanilla Candle"
/>
```

### 4. ProductGrid3D
Grid display of multiple products with 3D models for featured items and 2D cards for the rest:
- Displays top 3 products in 3D
- Remaining products in optimized 2D grid
- Click handlers for navigation
- Responsive design

**Props:**
- `products` (Product3D[]) - Array of products
- `onProductClick` (function) - Callback when product is clicked

## Features

### Dark Luxury Theme
All 3D components maintain the site's signature dark aesthetic:
- Deep black background (#0a0605)
- Candlelight warmth (#ffb84d)
- Soft purple undertones
- Glow effects and shadows for depth

### Interactive Controls
- **Orbit Controls**: Click and drag to rotate 3D models
- **Scroll Zoom**: Scroll wheel to zoom in/out
- **Auto-rotation**: Smooth automatic spinning
- **Play/Pause**: Toggle rotation with button

### Performance Optimizations
- Suspense boundaries for lazy loading
- Canvas anti-aliasing for smooth edges
- LOD (Level of Detail) considerations
- Efficient lighting setup
- Canvas opacity for blend modes

### Responsive Design
- Mobile fallbacks to 2D grid
- Touch-friendly controls
- Optimized canvas sizes for different screens
- Responsive typography

## Styling

All 3D components use the `styles3d.css` file with CSS variables from the dark theme:

```css
:root {
  --dark-bg: #0a0605;
  --dark-card: #1a0f1a;
  --text-light: #fff5f0;
  --text-muted: #c9a89f;
  --flame-warm: #ffb84d;
  --flame-glow: #ff9d5c;
  --gold: #d4a574;
  --border-glow: rgba(255, 184, 77, 0.25);
}
```

## Home Page Features

### 1. Hero 3D Scene
- Three animated candles with different colors
- Interactive orbit controls (disabled for hero)
- Background gradient and night environment
- Overlay text with CTA button

### 2. Features Section
- Grid of three feature cards
- Icons and descriptions
- Hover effects with glow

### 3. 3D Product Grid
- Featured products showcase in 3D
- Dynamic color assignment
- 2D fallback for additional products
- Click through to product details

### 4. CTA Section
- Games promotion
- Gradient background
- Call-to-action button

## Product Page Features

### 2D/3D Toggle
Products can be viewed in two modes:
1. **2D View**: Traditional photography from Unsplash
2. **3D View**: Interactive 3D candle model

Toggle buttons show the active view state with styling.

### 3D Viewer Controls
- **Drag**: Rotate around product
- **Scroll**: Zoom in/out
- **Play/Pause Button**: Toggle auto-rotation
- **Hints**: On-screen instructions

## Image Assets

Using **Unsplash API** for high-quality images:
- Candle photography for 2D product views
- Dark moody backgrounds for lighting
- Premium luxury product imagery

API Endpoint: `https://api.unsplash.com/search/photos`

### Fallback Images
If API fails, the system falls back to:
1. Admin-uploaded product images
2. Placeholder candle emoji

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (with 2D fallbacks)

WebGL is required for 3D rendering.

## Performance Tips

1. **Use Suspense Boundaries**: Wrap 3D components in `<Suspense>` for graceful loading
2. **Limit Canvas Size**: Smaller canvases on mobile devices
3. **Optimize Geometry**: Reuse candle model components
4. **Lazy Load**: Use dynamic imports for heavy components
5. **Check WebGL Support**: Fallback to 2D for unsupported devices

## Customization

### Change Candle Colors
Update the `CANDLE_COLORS` object in `/app/home/page.tsx`:

```tsx
const CANDLE_COLORS: Record<string, string> = {
  'Vanilla': '#d4a574',
  'Rose': '#c9a87f',
  'Ocean': '#8fb3d9',
  // Add more...
};
```

### Adjust Lighting
Modify light properties in 3D components:

```tsx
<pointLight
  position={[10, 10, 10]}
  intensity={1.2}
  castShadow
/>
```

### Update Textures
Three.js textures can be added to candles:

```tsx
<meshPhongMaterial
  map={texture}
  color={candleColor}
  shininess={60}
/>
```

## Troubleshooting

### WebGL Not Supported
- Check browser WebGL support at webglreport.com
- Implement 2D fallback (already in place)
- Update GPU drivers

### Black Screen
- Check console for errors
- Verify Three.js import
- Ensure canvas element is visible
- Check lighting setup

### Performance Issues
- Reduce geometry complexity
- Lower canvas resolution
- Disable shadows on mobile
- Use simpler environment presets

### Images Not Loading
- Verify Unsplash API key (in product page)
- Check internet connection
- Falls back to admin images automatically

## Future Enhancements

- [ ] Add texture maps to candle models
- [ ] Implement scent selection with color changes
- [ ] Add particle effects for realistic flames
- [ ] VR/AR support with WebXR
- [ ] Advanced material properties (metalness, roughness)
- [ ] Animated flame movement
- [ ] Product customizer (size, scent, color)
- [ ] AR try-before-you-buy

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Unsplash API](https://unsplash.com/developers)

## License

This 3D e-commerce website is part of the Lumera candle brand platform.

---

Built with love and Three.js ✨
