# 🕯️ 3D Luxury Candles E-Commerce Platform

A cutting-edge 3D e-commerce website featuring interactive product visualization using React Three Fiber, Three.js, and modern web technologies.

## 🌟 Features

### 3D Product Visualization
- **Interactive 3D Models**: Click and drag to rotate, scroll to zoom
- **Procedurally Generated Candles**: Realistic wax, wick, and flame effects
- **Real-time Rendering**: WebGL-powered smooth 3D graphics
- **Auto-rotation**: Smooth automatic spinning with play/pause control

### Product Pages
- **2D/3D Toggle**: Switch between photography and 3D models
- **High-Quality Images**: Unsplash API integration for professional photos
- **Full E-Commerce**: Shopping cart, wishlist, and checkout functionality

### Home Page
- **Immersive Hero Scene**: Three animated 3D candles with dynamic lighting
- **Features Section**: Showcase brand benefits with hover effects
- **3D Product Grid**: Browse featured items in 3D
- **Call-to-Action**: Promote games and special offers

### Design
- **Dark Luxury Aesthetic**: Deep blacks with candlelight gold accents
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Elegant transitions and glow effects
- **Professional Typography**: Playfair Display + Geist fonts

## 🚀 Quick Start

### Installation
```bash
# Dependencies already installed
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### View the 3D Experience
1. **Home**: Visit `http://localhost:3000/` to see the 3D hero scene
2. **Products**: Navigate to any product page at `/product/[id]`
3. **Toggle 3D**: Click "3D View" button to switch to interactive model

## 📁 Project Structure

```
app/
├── components/3d/
│   ├── CandleModel.tsx         # Reusable 3D candle component
│   ├── HeroScene.tsx           # Hero section with animated candles
│   ├── ProductViewer.tsx       # Interactive 360° product viewer
│   ├── ProductGrid3D.tsx       # 3D product grid display
│   ├── styles3d.css            # All 3D component styles
│   └── index.ts                # Component exports
│
├── home/
│   ├── page.tsx                # NEW: 3D home page
│   └── style/index.css         # Updated with 3D styles
│
├── product/[id]/
│   ├── page.tsx                # UPDATED: 3D viewer added
│   └── style.css               # UPDATED: Toggle styles
│
└── ... (other files unchanged)
```

## 🎨 Customization

### Change Candle Colors
Edit `/app/home/page.tsx`:
```tsx
const CANDLE_COLORS: Record<string, string> = {
  'Vanilla': '#d4a574',
  'Rose': '#c9a87f',
  'Ocean': '#8fb3d9',
  // Add your custom colors
};
```

### Adjust Lighting
Modify light properties in any 3D component:
```tsx
<pointLight
  position={[10, 10, 10]}
  intensity={1.2}
  castShadow
/>
```

### Update 3D Viewer Settings
In `/app/components/3d/ProductViewer.tsx`:
```tsx
<Canvas
  shadows
  camera={{ position: [0, 3, 8], fov: 50 }}
  gl={{ antialias: true, alpha: true }}
/>
```

## 📊 Performance

- **Build Size**: Optimized with tree-shaking
- **Load Time**: Fast with Suspense boundaries
- **Mobile Fallback**: Gracefully degrades to 2D on unsupported devices
- **WebGL Support**: Automatic detection and fallback

### Browser Support
| Browser | Status | Notes |
|---------|--------|-------|
| Chrome | ✅ Full | Best performance |
| Firefox | ✅ Full | Good support |
| Safari | ✅ Full | Stable |
| Edge | ✅ Full | Chromium-based |
| Mobile | ⚠️ 2D Fallback | Touch-optimized |

## 🔧 Technical Stack

- **React 19+** - Modern React with hooks
- **Next.js 15** - App Router & Server Components
- **Three.js** - 3D graphics library
- **React Three Fiber** - 3D components for React
- **@react-three/drei** - Useful helpers
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling utilities

## 📖 Documentation

### Core Documentation
- **[3D_FEATURES.md](./3D_FEATURES.md)** - Complete technical documentation
- **[3D_IMPLEMENTATION_GUIDE.md](./3D_IMPLEMENTATION_GUIDE.md)** - Quick start & customization
- **[3D_BUILD_SUMMARY.md](./3D_BUILD_SUMMARY.md)** - Project overview & statistics

### Code Documentation
- Inline comments in all 3D components
- Props clearly documented in TypeScript
- JSDoc comments for complex functions

## 🎯 Key Components

### CandleModel
Reusable 3D candle with customizable properties:
```tsx
<CandleModel
  color="#d4a574"
  height={8}
  radius={1.2}
  autoRotate={true}
  speed={1}
/>
```

### HeroScene
Full hero section with multiple animated candles:
```tsx
<HeroScene />
```

### ProductViewer
Interactive 360° product viewer:
```tsx
<ProductViewer
  productId="prod123"
  productColor="#d4a574"
  productHeight={8}
  productName="Rose Vanilla Candle"
/>
```

### ProductGrid3D
Smart product grid with 3D featured items:
```tsx
<ProductGrid3D
  products={products}
  onProductClick={(id) => router.push(`/product/${id}`)}
/>
```

## 🌐 Deployment

### Vercel Deployment
```bash
# Push to GitHub
git add .
git commit -m "Add 3D product visualization"
git push

# Deploy to Vercel
vercel deploy
```

### Environment Variables
No additional environment variables needed. Unsplash API key is embedded for demo.

## 🎮 User Controls

### 3D Viewer Controls
- **Drag Mouse**: Rotate product
- **Scroll Wheel**: Zoom in/out
- **Play/Pause Button**: Toggle auto-rotation
- **Touch**: Swipe to rotate (mobile)

### Navigation
- **2D/3D Toggle**: Switch between views
- **Product Cards**: Click to view details
- **Hero CTA**: Scroll to products section

## 🔍 Troubleshooting

### 3D Models Not Showing
1. Check WebGL support: https://get.webgl.org/
2. Verify browser console for errors
3. Clear browser cache
4. Try different browser

### Slow Performance
1. Disable shadows: Remove `shadows` from Canvas
2. Reduce canvas quality: Adjust `antialias` in `gl` prop
3. Check GPU usage in DevTools
4. Close other browser tabs

### Images Not Loading
- Unsplash API has rate limits (50/hour free)
- Falls back to admin images automatically
- Check network tab in DevTools

## 🚀 Future Enhancements

- [ ] Animated flame flickering
- [ ] Scent-based color changes
- [ ] AR/VR product preview
- [ ] Custom product builder
- [ ] Advanced material textures
- [ ] Real-time collaboration
- [ ] WebXR support

## 📚 Resources

### Official Documentation
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Three.js Docs](https://threejs.org/docs/)
- [Drei Utilities](https://github.com/pmndrs/drei)

### Learning Resources
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Three.js Journey](https://threejs-journey.com/)
- [Poimandres Community](https://discord.gg/poimandres)

## 📝 License

This 3D e-commerce platform is proprietary to the Lumera brand.

## 🙏 Acknowledgments

Built with cutting-edge technologies:
- React & Next.js teams
- Three.js & Babylon.js communities
- React Three Fiber ecosystem
- Unsplash for providing free imagery

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review component comments
3. Check browser console for errors
4. Verify all dependencies are installed

---

**Built with ✨ and Three.js**

Start date: April 25, 2026
Current version: 1.0.0
Status: Production Ready 🚀
