import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "motion/react";

interface ModelViewerProps {
  modelPath: string;
  alt: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
  cameraPosition?: [number, number, number];
  autoRotate?: boolean;
  floatAnim?: boolean;
  oscillate?: boolean;
  oscillationSpeed?: number;
  oscillationAmplitude?: number;
}

// Model loader component
function Model({
  modelPath,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  autoRotate = true,
  oscillate = false,
  oscillationSpeed = 0.14,
  oscillationAmplitude = 0.52,
}: Omit<ModelViewerProps, "alt" | "cameraPosition" | "floatAnim"> & {
  oscillate?: boolean;
  oscillationSpeed?: number;
  oscillationAmplitude?: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;

    if (oscillate) {
      group.current.rotation.y = rotation[1] + Math.sin(state.clock.getElapsedTime() * oscillationSpeed) * oscillationAmplitude;
    } else if (autoRotate) {
      group.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={group} position={position} rotation={rotation} scale={scale}>
      <primitive object={useGLTF(modelPath).scene} />
    </group>
  );
}

function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

export function ModelViewer({
  modelPath,
  alt,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
  cameraPosition = [0, 0, 3],
  autoRotate = true,
  floatAnim = true,
  oscillate = false,
  oscillationSpeed = 0.14,
  oscillationAmplitude = 0.52,
}: ModelViewerProps) {
  return (
    <motion.div
      animate={floatAnim ? { y: [0, -12, 0] } : { y: 0 }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Canvas
        camera={{
          position: cameraPosition,
          fov: 50,
        }}
        style={{
          width: "100%",
          height: "100%",
          background: "transparent",
        }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        }}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.9} />
        <directionalLight position={[-5, 3, 5]} intensity={0.6} />

        <Suspense fallback={<ModelFallback />}>
          <Model
            modelPath={modelPath}
            scale={scale}
            rotation={rotation}
            position={position}
            autoRotate={autoRotate}
            oscillate={oscillate}
            oscillationSpeed={oscillationSpeed}
            oscillationAmplitude={oscillationAmplitude}
          />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={3}
        />
        <Preload all />
      </Canvas>
    </motion.div>
  );
}
