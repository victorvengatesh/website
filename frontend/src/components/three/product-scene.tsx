"use client";

import { useRef } from "react";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";

import type { CategorySlug } from "@/types/product";

function ProceduralProduct({ category, color }: { category: CategorySlug; color: string }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });

  const material = <meshStandardMaterial color={color} roughness={0.38} metalness={0.04} />;

  return (
    <group ref={group} rotation={[0.14, -0.35, 0]}>
      {(category === "savouries" || category === "millet") && (
        <>
          <mesh castShadow position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>{/* A procedural murukku placeholder; replace with a Draco glTF via modelUrl. */}
            <torusKnotGeometry args={[0.76, 0.19, 160, 24, 2, 5]} />{material}
          </mesh>
          <mesh castShadow position={[0.15, -0.55, 0.1]} rotation={[1.42, 0.2, 0.35]} scale={0.74}><torusGeometry args={[0.82, 0.22, 36, 100]} />{material}</mesh>
        </>
      )}
      {category === "chips" && (
        <>
          {[-0.68, -0.2, 0.28, 0.74].map((x, index) => (
            <mesh key={x} castShadow position={[x, (index - 1.5) * 0.26, (index % 2) * 0.18]} rotation={[1.25 + index * 0.13, 0.15, index * 0.5]}>
              <cylinderGeometry args={[0.62, 0.62, 0.07, 48]} />{material}
            </mesh>
          ))}
        </>
      )}
      {category === "sweets" && (
        <>
          {[[-0.6, -0.35, 0], [0.6, -0.35, 0], [0, 0.5, 0]].map(([x, y, z], index) => (
            <mesh key={index} castShadow position={[x, y, z]}>
              <icosahedronGeometry args={[0.66, 5]} />{material}
            </mesh>
          ))}
        </>
      )}
      {category === "bakery" && (
        <>
          {[-0.42, 0.08, 0.58].map((y, index) => (
            <mesh key={y} castShadow position={[0, y, 0]} rotation={[Math.PI / 2, 0, index * 0.16]}>
              <cylinderGeometry args={[0.9, 0.9, 0.24, 14]} />{material}
            </mesh>
          ))}
        </>
      )}
      {category === "gifting" && (
        <>
          <mesh castShadow position={[0, -0.12, 0]}><boxGeometry args={[1.8, 1.35, 1.55]} />{material}</mesh>
          <mesh castShadow position={[0, 0.66, 0]} rotation={[0, 0, -0.08]}><boxGeometry args={[1.98, 0.25, 1.73]} /><meshStandardMaterial color="#f0be50" roughness={0.35} metalness={0.14} /></mesh>
          <mesh castShadow position={[0, -0.03, 0.79]}><boxGeometry args={[0.22, 1.52, 0.06]} /><meshStandardMaterial color="#f0be50" roughness={0.35} /></mesh>
        </>
      )}
    </group>
  );
}

export default function ProductScene({ category, color }: { category: CategorySlug; color: string }) {
  return (
    <Canvas dpr={[1, 1.55]} camera={{ position: [0, 0.2, 4.5], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }} shadows>
      <ambientLight intensity={1.75} />
      <directionalLight castShadow position={[4, 6, 4]} intensity={4.5} color="#fff2d3" />
      <pointLight position={[-4, 1, 3]} intensity={20} color={color} />
      <ProceduralProduct category={category} color={color} />
      <ContactShadows position={[0, -1.3, 0]} opacity={0.26} scale={5} blur={2.5} far={4} />
      <OrbitControls enablePan={false} minDistance={3.3} maxDistance={6.2} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 1.7} />
    </Canvas>
  );
}
