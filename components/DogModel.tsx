'use client';

/**
 * PetPal Interactive 3D Pet Model (React Three Fiber)
 * 
 * This component handles the visual representation of the pet, 
 * communicating its emotional and physical state through real-time 3D animations.
 * 
 * FBLA INNOVATION HIGHLIGHTS:
 * 1. Dynamic Scaling (Growth): Model scale increases as 'age' increases, 
 *    simulating life-stage development over time.
 * 2. Visual Feedback (Mood): Fur color dynamically lerps toward a greyish-green 
 *    tint when health stats are low (intuitive sick/sad status).
 * 3. Reactive Animation: Animation speed (tail wagging, breathing) is mathematically 
 *    weighted by happiness and energy levels.
 */

import { useRef, useEffect, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DogModelProps {
    stats?: {
        hunger: number;
        happy: number;
        energy: number;
        health: number;
    };
    age?: number; // months
    isGameOver?: boolean;
}

export function DogModel({ stats, age = 0, isGameOver }: DogModelProps) {
    const groupRef = useRef<THREE.Group>(null);
    const tailRef = useRef<THREE.Mesh>(null);
    const headGroupRef = useRef<THREE.Group>(null);

    // Stats influence
    const happy = stats?.happy ?? 50;
    const energy = stats?.energy ?? 50;
    const health = stats?.health ?? 50;

    // Growth: 0 months = 0.5 scale, 12 months = 1.0 scale
    const growthScale = useMemo(() => 0.5 + Math.min(0.5, (age / 12) * 0.5), [age]);

    // useRef keeps mouse position in sync with the render loop — no React re-renders
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        if (isGameOver) {
            if (groupRef.current) groupRef.current.rotation.z = Math.PI / 2;
            return;
        }

        // Tail wagging speed depends on happiness
        if (tailRef.current) {
            const wagSpeed = 5 + (happy / 100) * 15;
            tailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * wagSpeed) * 0.4;
        }

        const { x, y } = mouseRef.current;

        // Gentle floating - slower if low energy
        if (groupRef.current) {
            const floatSpeed = 1 + (energy / 100);
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * floatSpeed) * 0.1;
            groupRef.current.scale.setScalar(growthScale);

            // Body slightly turns toward cursor
            const targetBodyX = (x * Math.PI) / 4;
            groupRef.current.rotation.y = THREE.MathUtils.lerp(
                groupRef.current.rotation.y,
                targetBodyX * 0.5,
                0.06
            );

            // Head tracks cursor
            if (headGroupRef.current) {
                // Head hangs low if sad or tired
                const headHang = (1 - (happy + energy) / 200) * 0.3;
                headGroupRef.current.rotation.x = THREE.MathUtils.lerp(
                    headGroupRef.current.rotation.x,
                    -(y * Math.PI) / 5 + headHang,
                    0.08
                );
                headGroupRef.current.rotation.y = THREE.MathUtils.lerp(
                    headGroupRef.current.rotation.y,
                    targetBodyX * 1.0,
                    0.08
                );
            }
        }
    });

    // 1. Fur color - if sick (low health), turn slightly greyish-green
    const furColor = useMemo(() => {
        if (health < 30) {
            // Mix golden brown with a sickly grey-green
            const baseColor = new THREE.Color('#D4A373');
            const sickColor = new THREE.Color('#8C9278');
            const mixFactor = 1 - (health / 30);
            return baseColor.lerp(sickColor, mixFactor);
        }
        return new THREE.Color('#D4A373');
    }, [health]);

    const furMaterial = new THREE.MeshStandardMaterial({
        color: furColor,
        roughness: 0.9,
    });

    const darkFurMaterial = new THREE.MeshStandardMaterial({
        color: '#A87B51', // Darker brown for ears
        roughness: 0.9,
    });

    const blackMaterial = new THREE.MeshStandardMaterial({
        color: '#1A1A1A', // Nose and eyes
        roughness: 0.5,
    });

    const whiteMaterial = new THREE.MeshStandardMaterial({
        color: '#FAFAFA', // Snout/chest
        roughness: 0.9,
    });

    return (
        <group ref={groupRef} dispose={null} position={[0, 0, 0]}>
            {/* Body */}
            <mesh position={[0, 0, -0.2]} material={furMaterial}>
                <boxGeometry args={[0.7, 0.7, 1.4]} />
            </mesh>

            {/* Chest White Patch */}
            <mesh position={[0, -0.1, 0.51]} material={whiteMaterial}>
                <boxGeometry args={[0.4, 0.5, 0.05]} />
            </mesh>

            {/* Neck & Head Group */}
            <group ref={headGroupRef} position={[0, 0.4, 0.5]}>
                {/* Neck */}
                <mesh position={[0, -0.15, -0.1]} material={furMaterial}>
                    <boxGeometry args={[0.4, 0.4, 0.4]} />
                </mesh>

                {/* Main Head */}
                <mesh position={[0, 0.2, 0]} material={furMaterial}>
                    <boxGeometry args={[0.6, 0.6, 0.6]} />
                </mesh>

                {/* Snout */}
                <mesh position={[0, 0, 0.4]} material={whiteMaterial}>
                    <boxGeometry args={[0.3, 0.25, 0.3]} />
                </mesh>

                {/* Nose */}
                <mesh position={[0, 0.15, 0.55]} material={blackMaterial}>
                    <boxGeometry args={[0.12, 0.08, 0.08]} />
                </mesh>

                {/* Left Eye */}
                <mesh position={[-0.15, 0.3, 0.31]} material={blackMaterial}>
                    <boxGeometry args={[0.08, 0.08, 0.08]} />
                </mesh>

                {/* Right Eye */}
                <mesh position={[0.15, 0.3, 0.31]} material={blackMaterial}>
                    <boxGeometry args={[0.08, 0.08, 0.08]} />
                </mesh>

                {/* Left Ear */}
                <mesh position={[-0.35, 0.2, -0.1]} rotation={[0, 0, 0.2]} material={darkFurMaterial}>
                    <boxGeometry args={[0.12, 0.4, 0.3]} />
                </mesh>

                {/* Right Ear */}
                <mesh position={[0.35, 0.2, -0.1]} rotation={[0, 0, -0.2]} material={darkFurMaterial}>
                    <boxGeometry args={[0.12, 0.4, 0.3]} />
                </mesh>
            </group>

            {/* Front Left Leg */}
            <mesh position={[-0.2, -0.6, 0.3]} material={furMaterial}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
            </mesh>
            <mesh position={[-0.2, -0.9, 0.33]} material={whiteMaterial}>
                <boxGeometry args={[0.2, 0.1, 0.22]} />
            </mesh>

            {/* Front Right Leg */}
            <mesh position={[0.2, -0.6, 0.3]} material={furMaterial}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
            </mesh>
            <mesh position={[0.2, -0.9, 0.33]} material={whiteMaterial}>
                <boxGeometry args={[0.2, 0.1, 0.22]} />
            </mesh>

            {/* Back Left Leg */}
            <mesh position={[-0.2, -0.6, -0.7]} material={furMaterial}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
            </mesh>
            <mesh position={[-0.2, -0.9, -0.67]} material={furMaterial}>
                <boxGeometry args={[0.2, 0.1, 0.22]} />
            </mesh>

            {/* Back Right Leg */}
            <mesh position={[0.2, -0.6, -0.7]} material={furMaterial}>
                <boxGeometry args={[0.18, 0.6, 0.18]} />
            </mesh>
            <mesh position={[0.2, -0.9, -0.67]} material={furMaterial}>
                <boxGeometry args={[0.2, 0.1, 0.22]} />
            </mesh>

            {/* Tail */}
            <group position={[0, 0.2, -0.8]}>
                <mesh ref={tailRef} position={[0, 0.2, -0.15]} rotation={[-Math.PI / 4, 0, 0]} material={darkFurMaterial}>
                    <boxGeometry args={[0.1, 0.5, 0.1]} />
                </mesh>
            </group>
        </group>
    );
}
