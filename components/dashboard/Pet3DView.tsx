'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { DogModel } from '../DogModel';
import { Suspense } from 'react';

interface Pet3DViewProps {
    stats: {
        hunger: number;
        happy: number;
        energy: number;
        health: number;
    };
    age: number;
    isGameOver?: boolean;
}

export function Pet3DView({ stats, age, isGameOver }: Pet3DViewProps) {
    return (
        <div className="w-full h-full min-h-[300px] cursor-grab active:cursor-grabbing">
            <Canvas shadows gl={{ antialias: true, alpha: true }}>
                <PerspectiveCamera makeDefault position={[0, 1, 4]} fov={45} />
                <OrbitControls 
                    enableZoom={false} 
                    minPolarAngle={Math.PI / 3} 
                    maxPolarAngle={Math.PI / 1.5}
                    enablePan={false}
                />
                
                <Environment preset="city" />
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                
                <Suspense fallback={null}>
                    <DogModel stats={stats} age={age} isGameOver={isGameOver} />
                    <ContactShadows 
                        position={[0, -1.2, 0]} 
                        opacity={0.4} 
                        scale={10} 
                        blur={2.5} 
                        far={4} 
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
