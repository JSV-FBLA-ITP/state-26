'use client';

import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { DogModel } from './DogModel';

export function CursorDog() {
    return (
        <div className="fixed bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 p-4 pointer-events-none z-50">
            <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[3, 5, 3]} intensity={1.2} />
                <directionalLight position={[-2, 3, -2]} intensity={0.4} color="#3B82F6" />
                <DogModel />
                <Environment preset="city" />
            </Canvas>
        </div>
    );
}
