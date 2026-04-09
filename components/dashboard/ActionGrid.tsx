'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ActionType, ALL_ACTIONS, ACTION_LABELS, ACTION_COSTS } from '@/lib/gameLogic';
import * as Icons from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    onAction: (type: ActionType) => void;
}

const ACTION_COLORS: Record<ActionType, { bg: string; activeBg: string; text: string; glow: string }> = {
    feed: {
        bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 hover:border-amber-500/50',
        activeBg: 'bg-amber-500 border-amber-500 ring-4 ring-amber-500/25',
        text: 'text-amber-500',
        glow: 'shadow-amber-500/30',
    },
    play: {
        bg: 'bg-sky-500/10 hover:bg-sky-500/20 border-sky-500/20 hover:border-sky-500/50',
        activeBg: 'bg-sky-500 border-sky-500 ring-4 ring-sky-500/25',
        text: 'text-sky-500',
        glow: 'shadow-sky-500/30',
    },
    healthCheck: {
        bg: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 hover:border-rose-500/50',
        activeBg: 'bg-rose-500 border-rose-500 ring-4 ring-rose-500/25',
        text: 'text-rose-500',
        glow: 'shadow-rose-500/30',
    },
    sleep: {
        bg: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20 hover:border-indigo-500/50',
        activeBg: 'bg-indigo-500 border-indigo-500 ring-4 ring-indigo-500/25',
        text: 'text-indigo-500',
        glow: 'shadow-indigo-500/30',
    },
    clean: {
        bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 hover:border-emerald-500/50',
        activeBg: 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-500/25',
        text: 'text-emerald-500',
        glow: 'shadow-emerald-500/30',
    },
    train: {
        bg: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20 hover:border-purple-500/50',
        activeBg: 'bg-purple-500 border-purple-500 ring-4 ring-purple-500/25',
        text: 'text-purple-500',
        glow: 'shadow-purple-500/30',
    },
};

export function ActionGrid({ onAction }: Props) {
    const [activeAction, setActiveAction] = useState<ActionType | null>(null);

    const handleButtonClick = (action: ActionType) => {
        setActiveAction(action);
        onAction(action);
        setTimeout(() => setActiveAction(null), 800);
    };

    return (
        <div className="action-row py-2 sm:py-3 lg:py-4 flex-row !flex-nowrap justify-center">
            {ALL_ACTIONS.map((action) => {
                const [iconName, ...labelParts] = ACTION_LABELS[action].split(' ');
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
                const label = labelParts.join(' ');
                const isActive = activeAction === action;
                const colors = ACTION_COLORS[action];

                return (
                    <motion.button
                        key={action}
                        onClick={() => handleButtonClick(action)}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.96 }}
                        className={cn(
                            "group relative flex flex-col items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 py-3 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl border-[1.5px] transition-all duration-200 min-w-[60px] sm:min-w-[80px] md:min-w-[100px] lg:min-w-[120px] shrink-0 shadow-md hover:shadow-lg",
                            isActive
                                ? `${colors.activeBg} shadow-lg ${colors.glow}`
                                : `${colors.bg} hover:border-white/10 text-transparent`
                        )}
                    >
                        {/* Icon */}
                        <div className={cn(
                            "w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm",
                            isActive
                                ? 'bg-white/20 text-white'
                                : `bg-white/10 ${colors.text}`
                        )}>
                            <Icon className={cn(
                                "w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-transform duration-200",
                                isActive && "scale-110 rotate-3"
                            )} />
                        </div>

                        {/* Label & Cost Container */}
                        <div className="flex flex-col items-center gap-0">
                            {/* Label */}
                            <span className={cn(
                                "text-[8px] sm:text-[10px] lg:text-xs font-black uppercase tracking-wider transition-colors leading-tight",
                                isActive ? 'text-white' : 'text-foreground/80'
                            )}>
                                {label}
                            </span>

                            {/* Cost */}
                            <span className={cn(
                                "text-[9px] sm:text-[11px] lg:text-sm font-black tracking-wide leading-tight",
                                isActive ? 'text-white/70' : 'text-coral-500/80'
                            )}>
                                ${ACTION_COSTS[action]}
                            </span>
                        </div>

                        {/* Burst Ring */}
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 1 }}
                                    animate={{ scale: 2.2, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className={cn("absolute inset-0 border-2 rounded-xl sm:rounded-2xl pointer-events-none", `border-current ${colors.text}`)}
                                />
                            )}
                        </AnimatePresence>
                    </motion.button>
                );
            })}
        </div>
    );
}
