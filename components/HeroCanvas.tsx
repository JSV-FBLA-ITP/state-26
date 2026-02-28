'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Float } from '@react-three/drei';
import { DogModel } from './DogModel';

export function HeroCanvas() {
    return (
        <div className="w-full h-full min-h-[500px] md:min-h-[700px] relative z-10">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={0.5} color="#3B82F6" />

                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                    <group scale={[1.8, 1.8, 1.8]} position={[0, -0.6, 0]}>
                        <DogModel />
                    </group>
                </Float>

                <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={10}
                    blur={2}
                    far={4}
                />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
