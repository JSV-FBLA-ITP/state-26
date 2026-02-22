'use client';

import { motion } from 'framer-motion';
import { PetData, EmotionData } from '@/lib/gameLogic';
import Image from 'next/image';
import * as Icons from 'lucide-react';

interface Props {
    pet: PetData;
    emotion: EmotionData;
}

export function PetDisplay({ pet, emotion }: Props) {
    const HeaderIcon = (Icons as any)[emotion.emoji] || Icons.Smile;

    return (
        <div className="relative w-full max-w-lg aspect-square flex items-center justify-center">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />

            {/* Floating platform */}
            <div className="absolute bottom-4 w-3/4 h-12 bg-black/10 rounded-[100%] blur-xl" />

            <motion.div
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="relative w-full h-full rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl bg-white"
            >
                <Image
                    src={pet.petImage}
                    alt={pet.name}
                    fill
                    className="object-cover"
                    priority
                />

                {/* Emotion Overlay */}
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-border/50 flex items-center gap-3"
                    >
                        <div className="p-2 rounded-lg bg-primary/10">
                            <HeaderIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Currently</p>
                            <p className="font-bold text-primary">{emotion.emotion}</p>
                        </div>
                    </motion.div>

                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-border/50">
                        <p className="font-black text-xl text-primary">{pet.name}</p>
                    </div>
                </div>
            </motion.div>

            {/* Speech Bubble (Optional/Future) */}
        </div>
    );
}
