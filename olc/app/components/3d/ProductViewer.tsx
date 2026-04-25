'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { CandleModel } from './CandleModel';

interface ProductViewerProps {
  productId: string;
  productColor?: string;
  productHeight?: number;
  productName?: string;
}

export const ProductViewer: React.FC<ProductViewerProps> = ({
  productColor = '#d4a574',
  productHeight = 8,
  productName = 'Luxury Candle',
}) => {
  const [isRotating, setIsRotating] = useState(true);

  return (
    <div className="product-viewer-container">
      <Canvas
        shadows
        camera={{ position: [0, 3, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
          
          {/* Lighting setup */}
          <ambientLight intensity={0.7} />
          <spotLight
            position={[10, 15, 10]}
            angle={0.4}
            penumbra={1}
            intensity={1.5}
            castShadow
          />
          <pointLight position={[-8, 8, -8]} intensity={0.6} color="#ffb84d" />
          
          {/* Product candle */}
          <CandleModel
            color={productColor}
            height={productHeight}
            radius={1.1}
            autoRotate={isRotating}
            speed={1}
          />

          {/* Ground plane */}
          <mesh position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial
              color="#1a0f1a"
              metalness={0.05}
              roughness={0.95}
            />
          </mesh>

          {/* Interactive orbit controls */}
          <OrbitControls
            autoRotate={isRotating}
            autoRotateSpeed={2}
            enablePan={false}
            enableZoom={true}
            minDistance={5}
            maxDistance={15}
          />

          {/* Environment */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Controls overlay */}
      <div className="product-viewer-controls">
        <button
          className={`viewer-btn ${isRotating ? 'active' : ''}`}
          onClick={() => setIsRotating(!isRotating)}
          title={isRotating ? 'Stop rotation' : 'Start rotation'}
        >
          {isRotating ? '⏸' : '▶'}
        </button>
        <p className="viewer-hint">Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
};
