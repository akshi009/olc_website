'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group, Mesh, Color } from 'three';

interface CandleModelProps {
  color?: string;
  height?: number;
  radius?: number;
  autoRotate?: boolean;
  speed?: number;
}

export const CandleModel: React.FC<CandleModelProps> = ({
  color = '#d4a574',
  height = 8,
  radius = 1.2,
  autoRotate = true,
  speed = 0.5,
}) => {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += speed * 0.01;
    }
  });

  const candleColor = useMemo(() => new Color(color), [color]);

  return (
    <group ref={groupRef}>
      {/* Wax body */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.95, height, 32]} />
        <meshPhongMaterial
          color={candleColor}
          emissive={new Color(color)}
          emissiveIntensity={0.2}
          shininess={60}
        />
      </mesh>

      {/* Wick */}
      <mesh position={[0, height + 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#2a2a2a" emissive="#444444" />
      </mesh>

      {/* Flame glow particle effect */}
      <mesh position={[0, height + 0.5, 0]}>
        <coneGeometry args={[0.4, 0.8, 16]} />
        <meshPhongMaterial
          color="#ffb84d"
          emissive="#ff9d5c"
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Inner flame */}
      <mesh position={[0, height + 0.4, 0]}>
        <coneGeometry args={[0.25, 0.6, 16]} />
        <meshPhongMaterial
          color="#ffeb3b"
          emissive="#ffb84d"
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Glow light */}
      <pointLight
        position={[0, height + 0.5, 0]}
        intensity={1.5}
        color="#ffb84d"
        distance={10}
        castShadow
      />
    </group>
  );
};
