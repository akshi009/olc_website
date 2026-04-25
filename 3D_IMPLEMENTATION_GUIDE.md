# 3D E-Commerce Implementation Guide

## Quick Start

Your candle e-commerce website now features stunning 3D product visualization powered by React Three Fiber and Three.js!

## What's New

### 1. Interactive 3D Home Page
- **Hero Scene**: Three animated 3D candles with realistic lighting
- **Features Section**: Showcase key brand benefits
- **3D Product Grid**: Browse featured candles in 3D
- **CTA Section**: Promote games and special offers

Navigate to the home page to see the 3D experience in action.

### 2. Product Detail Pages with 3D Viewer
- **2D/3D Toggle**: Switch between traditional photography and 3D models
- **Interactive Rotation**: Drag to rotate, scroll to zoom
- **Auto-rotation**: Watch the product spin automatically
- **Play/Pause Button**: Control rotation

All product pages now include a "3D View" button next to the 2D photography.

### 3. 3D Components

#### Reusable Components
- `CandleModel`: Procedural 3D candle geometry
- `HeroScene`: Full hero section with multiple candles
- `ProductViewer`: 360° product viewer for individual items
- `ProductGrid3D`: Grid layout with mixed 3D/2D display

#### File Locations
```
app/components/3d/
├── CandleModel.tsx
├── HeroScene.tsx
├── ProductViewer.tsx
├── ProductGrid3D.tsx
├── styles3d.css
└── index.ts
```

## Files Modified

### New Files
- `/app/home/page.tsx` - Replaced with 3D version
- `/app/home/page-2d.tsx` - Backup of original
- `/app/components/3d/*` - All 3D components

### Updated Files
- `/app/product/[id]/page.tsx` - Added 3D viewer and toggle
- `/app/product/[id]/style.css` - Added toggle and viewer styles
- `/app/home/style/index.css` - Added new section styles

## Getting Started

### Viewing the 3D Experience

1. **Home Page**: Visit `/` to see the hero 3D scene with animated candles
2. **Product Page**: Visit `/product/[productId]` to see the 2D/3D toggle
3. **Click "3D View"** to switch from photography to interactive 3D model

### Customization

#### Change Candle Colors
In `/app/home/page.tsx`:
```tsx
const CANDLE_COLORS: Record<string, string> = {
  'Vanilla': '#d4a574',      // Light gold
  'Rose': '#c9a87f',         // Medium gold
  'Ocean': '#8fb3d9',        // Blue
  'Forest': '#7a9b6b',       // Green
  'Midnight': '#2c2c2c',     // Dark gray
  'Gold': '#e8c5a0',         // Bright gold
  'Blush': '#d4a5a0',        // Dusty rose
  'Sage': '#a8b8a0',         // Muted green
};
```

Add or modify colors to match your product catalog.

#### Adjust 3D Lighting
In `CandleModel.tsx`:
```tsx
<pointLight
  position={[10, 10, 10]}
  intensity={1.2}
  color="#ffffff"
  castShadow
/>
```

In `HeroScene.tsx`:
```tsx
<ambientLight intensity={0.6} />
<pointLight position={[10, 10, 10]} intensity={1.2} castShadow />
```

#### Modify Canvas Settings
In component Canvas elements:
```tsx
<Canvas
  shadows
  camera={{ position: [0, 3, 8], fov: 50 }}
  gl={{ antialias: true, alpha: true }}  // Quality settings
>
```

## Performance Considerations

### Mobile Optimization
- 3D viewer automatically loads with `Suspense` boundaries
- Falls back to 2D on unsupported devices
- Responsive canvas sizing

### Best Practices
1. Use `Suspense` for lazy loading:
```tsx
<Suspense fallback={<LoadingState />}>
  <ProductViewer ... />
</Suspense>
```

2. Limit number of 3D models on grid (currently 3)
3. Use environment presets like `"night"` for efficient lighting
4. Disable shadows on mobile devices if needed

## Unsplash Integration

Product images use Unsplash API for high-quality photography:

**API Key in use:** `hV1MXlRBU3r6dCW8GH8_KcXKV_eQB8kJJ-Ej_NsTyqM`

### To Replace with Your Own Key
1. Get free API key from [Unsplash Developers](https://unsplash.com/developers)
2. Update in `/app/product/[id]/page.tsx`:
```tsx
const res = await fetch(
  `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    "luxury candle " + product.name
  )}&per_page=5&client_id=YOUR_KEY_HERE`
);
```

### Image Fallbacks
1. Unsplash API images (primary)
2. Admin-uploaded product images (fallback)
3. Placeholder candle emoji (final fallback)

## Browser Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | Full | Best performance |
| Firefox | Full | Good performance |
| Safari | Full | Stable support |
| Edge | Full | Chromium-based |
| Mobile | 2D Fallback | Touch-optimized |

WebGL is required. Check support at [Get WebGL Report](https://get.webgl.org/)

## Troubleshooting

### 3D Models Not Appearing
1. **Check Browser Console** for WebGL errors
2. **Verify WebGL Support**: Visit [Get WebGL Report](https://get.webgl.org/)
3. **Check Dependencies**: Run `npm list three @react-three/fiber`
4. **Fallback to 2D**: System automatically uses 2D view if 3D fails

### Slow Performance
1. **Disable Shadows**: Remove `shadows` prop from Canvas
2. **Reduce Quality**: Lower `antialias` in `gl` prop
3. **Limit Models**: Reduce number of 3D candles in grids
4. **Check GPU**: Verify GPU usage in browser DevTools

### Images Not Loading
1. **Unsplash API**: Verify API key and rate limits (50 requests/hour free)
2. **Network**: Check internet connection
3. **CORS**: Unsplash API handles CORS automatically
4. **Fallback**: System uses admin images if Unsplash fails

## Advanced Features to Add

### Animations
```tsx
// Flickering flame effect
const flameRef = useRef<Group>(null);
useFrame(() => {
  if (flameRef.current) {
    flameRef.current.scale.y = 1 + Math.sin(Date.now() * 0.001) * 0.1;
  }
});
```

### Textures
```tsx
const texture = useTexture('/texture/candle-wax.png');
<meshPhongMaterial map={texture} color={color} />
```

### Additional Lighting Effects
```tsx
<spotLight
  position={[10, 15, 10]}
  angle={0.4}
  penumbra={1}
  intensity={1.5}
  castShadow
/>
```

## Deployment

The 3D website is fully compatible with Vercel:

```bash
# Push to GitHub
git add .
git commit -m "Add 3D product visualization"
git push

# Deploy to Vercel
vercel deploy
```

All Three.js rendering works server-side with Client Components (`'use client'`).

## Support & Resources

- **Three.js Docs**: https://threejs.org/docs/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber/
- **Unsplash API**: https://unsplash.com/developers
- **WebGL**: https://webglfundamentals.org/

## Next Steps

1. ✅ View 3D home page
2. ✅ Test product 3D viewer
3. ✅ Customize candle colors
4. ✅ Add product-specific models
5. ✅ Implement AR/VR (future)

Enjoy your stunning 3D e-commerce website! 🕯️✨
