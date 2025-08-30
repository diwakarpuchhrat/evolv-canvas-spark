'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GalaxyCanvasProps {
  pixelIntensity?: number;
}

// Galaxy particle system component
const GalaxyParticles = ({ pixelIntensity = 8 }: { pixelIntensity: number }) => {
  const meshRef = useRef<THREE.Points>(null);
  
  // Generate galaxy particles
  const [positions, colors] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    const colorInside = new THREE.Color('#06b6d4'); // Primary
    const colorOutside = new THREE.Color('#8b5cf6'); // Accent
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Galaxy spiral pattern
      const radius = Math.random() * 5;
      const spinAngle = radius * 2;
      const branchAngle = (i % 3) * (Math.PI * 2) / 3;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.3;
      
      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
      
      // Color based on distance from center
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / 5);
      
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    
    return [positions, colors];
  }, []);
  
  // Rotate the galaxy
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Pixelation effect (simplified version)
const PixelationEffect = ({ intensity }: { intensity: number }) => {
  // In a full implementation, this would use postprocessing
  // For now, we'll just adjust the rendering resolution
  return null;
};

export const GalaxyCanvas = ({ pixelIntensity = 8 }: GalaxyCanvasProps) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 75 }}
      style={{ 
        width: '100%', 
        height: '100%',
        filter: `contrast(1.1) saturate(1.2)${pixelIntensity > 10 ? ` blur(${pixelIntensity / 10}px)` : ''}`
      }}
    >
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      
      {/* Galaxy particles */}
      <GalaxyParticles pixelIntensity={pixelIntensity} />
      
      {/* Background stars */}
      <Stars 
        radius={100} 
        depth={50} 
        count={2000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={0.3}
      />
      
      {/* Controls (disabled for background effect) */}
      <OrbitControls 
        enabled={false}
        autoRotate={true}
        autoRotateSpeed={0.1}
      />
      
      {/* Pixelation effect */}
      <PixelationEffect intensity={pixelIntensity} />
    </Canvas>
  );
};