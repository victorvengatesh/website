"use client";

import { useRef } from "react";
import { ContactShadows, Float } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";

function SnackSculpture() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    // Pointer response is deliberately damped to keep the hero calm and premium.
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x +=
      (state.pointer.y * 0.12 - group.current.rotation.x) * 0.035;
    group.current.rotation.z +=
      (-state.pointer.x * 0.09 - group.current.rotation.z) * 0.035;
  });

  return (
    <group ref={group} rotation={[0.2, -0.3, -0.12]}>
      <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.65}>
        <mesh castShadow position={[0, 0.12, 0]} rotation={[Math.PI / 2.15, 0, 0]}>
          <torusGeometry args={[1.2, 0.34, 48, 128]} />
          <meshStandardMaterial color="#ef6a2c" roughness={0.36} metalness={0.08} />
        </mesh>
        <mesh castShadow position={[-0.72, -0.2, 0.62]} rotation={[1.45, 0.22, -0.48]} scale={0.68}>
          <torusGeometry args={[0.93, 0.27, 42, 108]} />
          <meshStandardMaterial color="#f4be45" roughness={0.4} metalness={0.05} />
        </mesh>
        <mesh castShadow position={[0.8, 0.48, -0.55]} rotation={[1.33, -0.35, 0.68]} scale={0.53}>
          <torusGeometry args={[0.93, 0.27, 42, 108]} />
          <meshStandardMaterial color="#9b3222" roughness={0.44} />
        </mesh>
        {[
          [-1.34, 0.82, 0.2, 0.18],
          [1.24, -0.58, 0.3, 0.16],
          [0.34, 1.2, -0.4, 0.13],
          [-0.2, -1.05, 0.7, 0.15],
          [1.45, 0.82, -0.2, 0.11],
        ].map(([x, y, z, scale], index) => (
          <mesh key={index} castShadow position={[x, y, z]} scale={scale}>
            <dodecahedronGeometry args={[1, 1]} />
            <meshStandardMaterial color={index % 2 ? "#f6c74f" : "#cc4a26"} roughness={0.55} />
          </mesh>
        ))}
      </Float>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.1, 5.1], fov: 39 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      shadows
    >
      <ambientLight intensity={1.7} />
      <directionalLight castShadow position={[4, 6, 5]} intensity={4.2} color="#fff3d5" shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-4, 1, 3]} intensity={24} distance={10} color="#ff7a38" />
      <pointLight position={[3, -2, 2]} intensity={16} distance={8} color="#f7cb65" />
      <SnackSculpture />
      <ContactShadows position={[0, -1.68, 0]} opacity={0.3} scale={7} blur={2.8} far={4} color="#6e281b" />
    </Canvas>
  );
}
