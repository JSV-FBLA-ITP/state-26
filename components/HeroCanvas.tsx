'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

function HeroDog() {
    const groupRef = useRef<THREE.Group>(null);
    const tailRef = useRef<THREE.Mesh>(null);
    const headGroupRef = useRef<THREE.Group>(null);

    const mouseRef = useRef({ x: 0, y: 0 });

    useFrame((state) => {
        const { x, y } = mouseRef.current;

        if (tailRef.current) {
            tailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 10) * 0.4;
        }

        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
            groupRef.current.scale.setScalar(1);

            const targetBodyX = (x * Math.PI) / 4;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetBodyX * 0.3,
                0.06
            );

            if (headGroupRef.current) {
                headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
                    headGroupRef.current.rotation.x,
                    -(y * Math.PI) / 5,
                    0.08
                );
                headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
                    headGroupRef.current.rotation.y,
                    targetBodyX * 0.8,
                    0.08
                );
            }
        }
    });

    const furMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#D4A373',
        roughness: 0.9,
    }), []);

    const darkFurMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#A87B51',
        roughness: 0.9,
    }), []);

    const blackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#1A1A1A',
        roughness: 0.5,
    }), []);

    const whiteMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#FAFAFA',
        roughness: 0.9,
    }), []);

    return (
        <group ref={groupRef} dispose={null} position={[0, 0, 0]}>
            <mesh position={[0, 0, -0.2]} material={furMaterial}>
                <boxGeometry args={[0.7, 0.7, 1.4]} />
            </mesh>

            <mesh position={[0, -0.1, 0.51]} material={whiteMaterial}>
                <boxGeometry args={[0.4, 0.5, 0.05]} />
            </mesh>

            <group ref={headGroupRef} position={[0, 0.4, 0.5]}>
                <mesh position={[0, -0.15, -0.1]} material={furMaterial}>
                    <boxGeometry args={[0.4, 0.4, 0.4]} />
                </mesh>

                <mesh position={[0, 0.2, 0]} material={furMaterial}>
                    <boxGeometry args={[0.6, 0.6, 0.6]} />
                </mesh>

                <mesh position={[0, 0, 0.4]} material={whiteMaterial}>
                    <boxGeometry args={[0.3, 0.25, 0.3]} />
                </mesh>

                <mesh position={[0, 0.15, 0.55]} material={blackMaterial}>
                    <boxGeometry args={[0.12, 0.08, 0.08]} />
                </mesh>

                <mesh position={[-0.15, 0.3, 0.31]} material={blackMaterial}>
                    <boxGeometry args={[0.08, 0.08, 0.08]} />
                </mesh>

                <mesh position={[0.15, 0.3, 0.31]} material={blackMaterial}>
                    <boxGeometry args={[0.08, 0.08, 0.08]} />
                </mesh>

                <mesh position={[-0.35, 0.2, -0.1]} rotation={[0, 0, 0.2]} material={darkFurMaterial}>
                    <boxGeometry args={[0.12, 0.4, 0.3]} />
                </mesh>

                <mesh position={[0.35, 0.2, -0.1]} rotation={[0, 0, -0.2]} material={darkFurMaterial}>
                    <boxGeometry args={[0.12, 0.4, 0.3]} />
                </mesh>
            </group>

            <mesh position={[-0.2, -0.6, 0.3]} material={furMaterial}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
            </mesh>
            <mesh position={[-0.2, -0.9, 0.33]} material={whiteMaterial}>
                <boxGeometry args={[0.2, 0.1, 0.22]} />
            </mesh>

            <mesh position={[0.2, -0.6, 0.3]} material={furMaterial}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
            </mesh>
            <mesh position={[0.2, -0.9, 0.33]} material={whiteMaterial}>
                <boxGeometry args={[0.2, 0.1, 0.22]} />
            </mesh>

            <mesh position={[-0.2, -0.6, -0.7]} material={furMaterial}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
            </mesh>
            <mesh position={[-0.2, -0.9, -0.67]} material={furMaterial}>
                <boxGeometry args={[0.2, 0.1, 0.22]} />
            </mesh>

            <mesh position={[0.2, -0.6, -0.7]} material={furMaterial}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
            </mesh>
            <mesh position={[0.2, -0.9, -0.67]} material={furMaterial}>
                <boxGeometry args={[0.2, 0.1, 0.22]} />
            </mesh>

            <group position={[0, 0.2, -0.8]}>
                <mesh ref={tailRef} position={[0, 0.2, -0.15]} rotation={[-Math.PI / 4, 0, 0]} material={darkFurMaterial}>
                    <boxGeometry args={[0.1, 0.5, 0.1]} />
                </mesh>
            </group>
        </group>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.6} />
            <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={1.2} />
            <pointLight position={[-5, 3, 0]} intensity={0.4} />
            
            <Suspense fallback={null}>
                <HeroDog />
                <ContactShadows 
                    position={[0, -1.2, 0]} 
                    opacity={0.3} 
                    scale={8} 
                    blur={2} 
                    far={4} 
                />
            </Suspense>
        </>
    );
}

export function HeroCanvas() {
    return (
        <div className="w-full h-full min-h-[400px] md:min-h-[600px] relative z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/50" />
            <Canvas 
                shadows 
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 0.5, 5], fov: 45 }}
                style={{ background: 'transparent' }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
