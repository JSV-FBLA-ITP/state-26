'use client';

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DogModel() {
    const groupRef = useRef<THREE.Group>(null);
    const tailRef = useRef<THREE.Mesh>(null);
    const headGroupRef = useRef<THREE.Group>(null);

    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            setMouse({ x, y });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useFrame((state) => {
        // Tail wagging animation
        if (tailRef.current) {
            tailRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 15) * 0.4;
        }

        // Gentle floating
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;

            // Mouse tracking interpolation based on global window mouse
            const targetX = (mouse.x * Math.PI) / 6;
            const targetY = (mouse.y * Math.PI) / 8;

            // Body slightly turns
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetX * 0.5, 0.1);

            // Head turns more towards the mouse
            if (headGroupRef.current) {
                headGroupRef.current.rotation.y = THREE.MathUtils.lerp(headGroupRef.current.rotation.y, targetX * 0.8, 0.1);
                headGroupRef.current.rotation.x = THREE.MathUtils.lerp(headGroupRef.current.rotation.x, -targetY, 0.1);
            }
        }
    });

    const furMaterial = new THREE.MeshStandardMaterial({
        color: '#D4A373', // Golden brown
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
