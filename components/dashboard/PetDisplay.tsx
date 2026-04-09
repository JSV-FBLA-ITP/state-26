'use client';

/**
 * PetPal Dashboard: Pet Visualization Engine
 * 
 * Responsible for the real-time visual representation of the pet's state. 
 * Integrates 3D models via Pet3DView and provides status-based visual effects.
 * 
 * DESIGN FEATURES:
 * 1. Emotion-Driven Styling: Changes borders, glows, and background lints based on happiness level.
 * 2. Death State Handling: Implements a "grayscale" mortality toggle to communicate the 'Game Over' status clearly.
 * 3. Responsive Framing: Optimized aspect ratios to ensure the pet remains fixed and legible on all screen sizes.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { PetData, EmotionData } from '@/lib/gameLogic';
import Image from 'next/image';
import * as Icons from 'lucide-react';

interface Props {
    pet: PetData;
    emotion: EmotionData;
    isGameOver?: boolean;
}

export function PetDisplay({ pet, emotion, isGameOver }: Props) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const HeaderIcon = (Icons as any)[emotion.emoji] || Icons.Smile;

    return (
        <div className="relative w-full flex flex-col items-center gap-2">
            {/* Pet image container */}
            <div className="relative w-full aspect-square">
                {/* Glow ring */}
                <div className={`absolute inset-[-8px] rounded-[2.5rem] blur-[20px] transition-colors duration-500 ${isGameOver ? 'bg-rose-500/25' : 'bg-primary/15'}`} />

                {/* Floating platform shadow */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-[100%] blur-lg ${isGameOver ? 'bg-rose-500/15' : 'bg-black/8'}`} />

                <motion.div
                    className={`relative w-full h-full rounded-[2rem] overflow-hidden border-[3px] shadow-2xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-card transition-all duration-300 ${isGameOver ? 'border-rose-500/60 grayscale' : 'border-white/80 dark:border-white/20'}`}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pet.petImage}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                            className="w-full h-full flex items-center justify-center p-1.5 relative"
                        >
                            <Image 
                                src={pet.petImage || '/favicon.svg'} 
                                alt={pet.name} 
                                fill 
                                className={`object-contain transition-transform duration-700 hover:scale-105 ${isGameOver ? 'grayscale' : ''}`}
                                unoptimized
                            />
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Emotion badge — below pet, not overlaying */}
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1.5 sm:gap-2 bg-white/90 dark:bg-card/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg border border-border/30"
            >
                <HeaderIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                <span className="font-black text-[11px] sm:text-xs lg:text-sm text-primary uppercase tracking-wide">{emotion.emotion}</span>
            </motion.div>
        </div>
    );
}
