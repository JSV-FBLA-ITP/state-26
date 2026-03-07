'use client';

import { motion } from 'framer-motion';
import { PetData, EmotionData } from '@/lib/gameLogic';
import Image from 'next/image';
import * as Icons from 'lucide-react';

interface Props {
    pet: PetData;
    emotion: EmotionData;
    isGameOver?: boolean;
}

export function PetDisplay({ pet, emotion, isGameOver }: Props) {
    const HeaderIcon = (Icons as any)[emotion.emoji] || Icons.Smile;

    return (
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
            {/* Glow effect - red for dead pet */}
            <div className={`absolute inset-0 rounded-full blur-[100px] ${isGameOver ? 'bg-rose-500/30' : 'bg-primary/20 animate-pulse'}`} />

            {/* Floating platform */}
            <div className={`absolute bottom-4 w-3/4 h-12 rounded-[100%] blur-xl ${isGameOver ? 'bg-rose-500/20' : 'bg-black/10'}`} />

            <motion.div
                animate={isGameOver ? {} : {
                    y: [0, -20, 0],
                }}
                transition={isGameOver ? {} : {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`relative w-full h-full rounded-[3rem] overflow-hidden border-4 shadow-2xl bg-white ${isGameOver ? 'border-rose-500 grayscale' : 'border-white'}`}
            >
                <Image
                    src={pet.petImage}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                />

                {/* Emotion Overlay */}
                <div className="absolute top-6 left-6 right-6 flex items-start justify-center">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white/90 backdrop-blur-md px-5 py-3 rounded-[2rem] shadow-lg border border-border/50 flex flex-col items-center gap-1"
                    >
                        <p className="font-black text-2xl text-primary">{pet.name}</p>
                        <div className="flex items-center gap-2">
                            <HeaderIcon className="w-4 h-4 text-primary" />
                            <p className="font-bold text-sm text-primary uppercase tracking-wide">{emotion.emotion}</p>
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Speech Bubble (Optional/Future) */}
        </div>
        
    );
}
