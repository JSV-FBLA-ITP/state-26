'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ActionType, ALL_ACTIONS, ACTION_LABELS } from '@/lib/gameLogic';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';
import { useState } from 'react';

interface Props {
    onAction: (type: ActionType) => void;
}

export function ActionGrid({ onAction }: Props) {
    const [activeAction, setActiveAction] = useState<ActionType | null>(null);

    const handleButtonClick = (action: ActionType) => {
        setActiveAction(action);
        onAction(action);
        setTimeout(() => setActiveAction(null), 1000);
    };

    return (
        <div className="w-full max-w-2xl mt-8 flex flex-wrap justify-center gap-4 md:gap-6 px-4 pb-8">
            {ALL_ACTIONS.map((action, i) => {
                const [iconName, ...labelParts] = ACTION_LABELS[action].split(' ');
                const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
                const label = labelParts.join(' ');
                const isActive = activeAction === action;

                return (
                    <motion.div
                        key={action}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            delay: 0.2 + i * 0.05,
                            type: 'spring',
                            damping: 12,
                            stiffness: 200
                        }}
                        className="flex-1 min-w-[85px] max-w-[110px] md:max-w-none md:w-32"
                    >
                        <motion.button
                            onClick={() => handleButtonClick(action)}
                            whileHover={{ y: -8, scale: 1.05 }}
                            whileTap={{ scale: 0.9 }}
                            className={`group relative flex flex-col items-center justify-center w-full aspect-square rounded-[2.5rem] bg-card/40 backdrop-blur-2xl border-2 transition-all duration-300 shadow-2xl ${isActive ? 'border-primary ring-4 ring-primary/20' : 'border-border/40 hover:border-primary/50'
                                } p-4`}
                        >
                            {/* Icon Container */}
                            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center mb-3 transition-all duration-500 shadow-inner ${isActive ? 'bg-primary text-white scale-110 rotate-12' : 'bg-primary/5 text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary'
                                }`}>
                                <Icon className={`w-7 h-7 md:w-8 md:h-8 transition-transform duration-300 ${isActive ? 'scale-125' : 'group-hover:scale-110'}`} />
                            </div>

                            {/* Label */}
                            <span className={`text-[10px] md:text-[12px] font-black uppercase tracking-tighter text-center leading-none transition-colors duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
                                }`}>
                                {label}
                            </span>

                            {/* Burst Rings */}
                            <AnimatePresence>
                                {isActive && (
                                    <>
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0.8 }}
                                            animate={{ scale: 2.2, opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 border-4 border-primary rounded-[2.5rem] pointer-events-none"
                                        />
                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0.5 }}
                                            animate={{ scale: 3, opacity: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 border-2 border-primary/30 rounded-[2.5rem] pointer-events-none"
                                        />
                                        {/* Particle flying icons */}
                                        {[...Array(4)].map((_, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
                                                animate={{
                                                    x: (idx % 2 === 0 ? 1 : -1) * (40 + Math.random() * 40),
                                                    y: (idx < 2 ? -1 : 1) * (40 + Math.random() * 40),
                                                    opacity: 0,
                                                    scale: 1,
                                                    rotate: Math.random() * 360
                                                }}
                                                className="absolute pointer-events-none"
                                            >
                                                <Icon className="w-4 h-4 text-primary" />
                                            </motion.div>
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Corner Badge */}
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary/20 group-hover:bg-primary transition-colors duration-500" />
                        </motion.button>
                    </motion.div>
                );
            })}
        </div>
    );
}
