'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { HeroScene } from '../components/3d/HeroScene';
import { ProductGrid3D } from '../components/3d/ProductGrid3D';
import '../components/3d/styles3d.css';
import '../home/style/index.css';
import { useAuthContext } from '../context/AuthContext';
import Header from '../header/page';
import Footer from '../footer/page';
import { Loader2 } from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image?: string;
  weight?: string;
  burnTime?: string;
}

interface Color {
  hex: string;
  name: string;
}

const CANDLE_COLORS: Record<string, string> = {
  'Vanilla': '#d4a574',
  'Rose': '#c9a87f',
  'Ocean': '#8fb3d9',
  'Forest': '#7a9b6b',
  'Midnight': '#2c2c2c',
  'Gold': '#e8c5a0',
  'Blush': '#d4a5a0',
  'Sage': '#a8b8a0',
};

export default function Home3D() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [cartOpen, setCartOpen] = useState(false);

  // Fetch products
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      return data || [];
    },
  });

  const formattedProducts = products.map((p: Product, index: number) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    color: Object.values(CANDLE_COLORS)[index % Object.values(CANDLE_COLORS).length],
    height: 6 + (index % 3),
    radius: 0.9 + (index % 2) * 0.2,
  }));

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleExploreCollection = () => {
    const grid = document.querySelector('.product-grid-3d');
    grid?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="home-3d">
      <Header />

      {/* Hero 3D Scene */}
      <Suspense fallback={<div className="hero-loading">Loading 3D Experience...</div>}>
        <HeroScene />
      </Suspense>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🕯</div>
            <h3 className="feature-title">Hand-Poured</h3>
            <p className="feature-desc">Crafted in small batches with premium ingredients</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3 className="feature-title">Sustainable</h3>
            <p className="feature-desc">Ethically sourced materials and eco-friendly packaging</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3 className="feature-title">Luxurious</h3>
            <p className="feature-desc">Experience pure indulgence with rare botanicals</p>
          </div>
        </div>
      </section>

      {/* 3D Product Grid */}
      <section className="products-section">
        <div className="section-header">
          <h2 className="section-title">Our Collection</h2>
          <p className="section-subtitle">Explore our handcrafted candles in stunning 3D</p>
        </div>

        {isLoading ? (
          <div className="products-loading">
            <Loader2 className="spinner" />
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="products-error">
            <p>Failed to load products</p>
          </div>
        ) : (
          <Suspense fallback={<div className="products-loading">Loading 3D Models...</div>}>
            <ProductGrid3D
              products={formattedProducts}
              onProductClick={handleProductClick}
            />
          </Suspense>
        )}
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Unlock Special Offers</h2>
          <p className="cta-desc">Play our daily games and win exclusive discounts</p>
          <button
            className="cta-btn"
            onClick={() => router.push('/games')}
          >
            Play Games Now
          </button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
