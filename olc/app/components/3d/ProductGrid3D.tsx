'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { CandleModel } from './CandleModel';

interface Product3D {
  id: string;
  name: string;
  color: string;
  height?: number;
  radius?: number;
  price: number;
}

interface ProductGrid3DProps {
  products: Product3D[];
  onProductClick?: (productId: string) => void;
}

export const ProductGrid3D: React.FC<ProductGrid3DProps> = ({
  products,
  onProductClick,
}) => {
  // Display only 3 products in 3D for performance
  const displayProducts = products.slice(0, 3);

  return (
    <div className="product-grid-3d">
      {displayProducts.map((product, index) => (
        <div
          key={product.id}
          className="product-card-3d"
          onClick={() => onProductClick?.(product.id)}
        >
          <Canvas
            shadows
            camera={{ position: [0, 2, 6], fov: 50 }}
            gl={{ antialias: true, alpha: true }}
          >
            <Suspense fallback={null}>
              <PerspectiveCamera makeDefault position={[0, 1.5, 6]} fov={50} />
              
              {/* Lighting */}
              <ambientLight intensity={0.6} />
              <pointLight position={[5, 8, 5]} intensity={1} castShadow />
              <pointLight position={[-5, -5, 3]} intensity={0.4} color="#ffb84d" />
              
              {/* Product candle */}
              <CandleModel
                color={product.color}
                height={product.height || 6}
                radius={product.radius || 0.9}
                autoRotate={true}
                speed={0.8}
              />

              {/* Ground */}
              <mesh position={[0, -1.5, 0]} receiveShadow>
                <planeGeometry args={[15, 15]} />
                <meshStandardMaterial
                  color="#0a0605"
                  metalness={0.05}
                  roughness={0.95}
                />
              </mesh>

              {/* Minimal orbit controls */}
              <OrbitControls
                autoRotate={true}
                autoRotateSpeed={1.5}
                enablePan={false}
                enableZoom={false}
              />

              <Environment preset="night" />
            </Suspense>
          </Canvas>

          {/* Product info overlay */}
          <div className="product-card-3d-info">
            <h3 className="product-card-3d-name">{product.name}</h3>
            <p className="product-card-3d-price">₹{product.price}</p>
            <button className="product-card-3d-btn">View Details</button>
          </div>
        </div>
      ))}

      {/* Remaining products in 2D grid */}
      {products.length > 3 && (
        <div className="product-grid-2d-remainder">
          {products.slice(3).map((product) => (
            <div
              key={product.id}
              className="product-card-2d"
              onClick={() => onProductClick?.(product.id)}
            >
              <div
                className="product-card-2d-visual"
                style={{ backgroundColor: product.color }}
              >
                🕯
              </div>
              <h3 className="product-card-2d-name">{product.name}</h3>
              <p className="product-card-2d-price">₹{product.price}</p>
              <button className="product-card-2d-btn">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
