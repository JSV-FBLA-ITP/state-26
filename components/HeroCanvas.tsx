'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
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
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
            groupRef.current.scale.setScalar(1.80);

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

function MouseTracker() {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
            
            const canvas = containerRef.current.querySelector('canvas');
            if (canvas) {
                canvas.dispatchEvent(new CustomEvent('mousemove', { 
                    detail: { x, y },
                    bubbles: true
                }));
            }
        }
    };

    return (
        <div ref={containerRef} className="w-full h-full" onMouseMove={handleMouseMove}>
            <MouseSync />
        </div>
    );
}

function MouseSync() {
    const groupRef = useRef<THREE.Group>(null);
    const tailRef = useRef<THREE.Mesh>(null);
    const headGroupRef = useRef<THREE.Group>(null);

    useFrame((state) => {
        const { x, y } = state.pointer;

        if (tailRef.current) {
            tailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 10) * 0.4;
        }

        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08;
            groupRef.current.scale.setScalar(1.80);

            const targetBodyX = (x * Math.PI) / 4;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetBodyX * 0.4,
                0.08
            );

            if (headGroupRef.current) {
                headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
                    headGroupRef.current.rotation.x,
                    -(y * Math.PI) / 6,
                    0.1
                );
                headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
                    headGroupRef.current.rotation.y,
                    targetBodyX * 1.0,
                    0.1
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

export function HeroCanvas() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
                opacity: 1, 
                scale: 1, 
            }}
            transition={{ 
                opacity: { duration: 1 },
                scale: { duration: 1 },
            }}
            className="relative w-full aspect-square max-w-[500px]"
        >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
            
            <div className="relative w-full h-full">
                <Canvas 
                    gl={{ antialias: true, alpha: true }}
                    camera={{ position: [0, -0.2, 6], fov: 40 }}
                    style={{ background: 'transparent' }}
                >
                    <ambientLight intensity={1.5} />
                    <spotLight position={[5, 5, 5]} angle={0.3} penumbra={1} intensity={2} />
                    <pointLight position={[-5, 3, 0]} intensity={1} />
                    <hemisphereLight args={['#ffffff', '#ffffff']} intensity={0.5} />
                    
                    <Suspense fallback={null}>
                        <MouseSync />
                    </Suspense>
                </Canvas>
            </div>

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-24 h-24 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center"
            >
                <div className="w-4 h-4 bg-primary rounded-full" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -bottom-16 left-4 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg border border-border"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage-100 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-sage-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Portfolio</p>
                        <p className="text-lg font-bold text-foreground">+$127.50</p>
                    </div>
                </div>
            </motion.div>
            

        </motion.div>
    );
}
