'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls } from '@react-three/drei';
import { CandleModel } from './CandleModel';

export const HeroScene: React.FC = () => {
  return (
    <div className="hero-3d-container">
      <Canvas
        shadows
        camera={{ position: [0, 3, 8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />
          
          {/* Lighting */}
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1.2} castShadow />
          <pointLight position={[-10, -10, 5]} intensity={0.4} color="#ffb84d" />
          
          {/* Main candle */}
          <CandleModel
            color="#d4a574"
            height={8}
            radius={1.2}
            autoRotate={true}
            speed={1}
          />

          {/* Decorative candles */}
          <group position={[-4, 0, 0]}>
            <CandleModel
              color="#c9a87f"
              height={6}
              radius={0.8}
              autoRotate={true}
              speed={0.7}
            />
          </group>

          <group position={[4, 0, 0]}>
            <CandleModel
              color="#e8c5a0"
              height={7}
              radius={0.9}
              autoRotate={true}
              speed={0.8}
            />
          </group>

          {/* Ground plane */}
          <mesh position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <meshStandardMaterial
              color="#0a0605"
              metalness={0.1}
              roughness={0.9}
            />
          </mesh>

          {/* Soft orbit controls */}
          <OrbitControls
            autoRotate={false}
            enablePan={false}
            enableZoom={false}
            minDistance={6}
            maxDistance={12}
          />

          {/* Environment */}
          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Overlay text */}
      <div className="hero-3d-content">
        <h1 className="hero-3d-title">
          Experience Luxury
          <br />
          In 3D
        </h1>
        <p className="hero-3d-subtitle">
          Handcrafted candles with premium ingredients
        </p>
        <button className="hero-3d-cta">Explore Collection</button>
      </div>
    </div>
  );
};
