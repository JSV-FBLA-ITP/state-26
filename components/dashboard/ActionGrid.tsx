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
        bg: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20 hover:border-orange-500/50',
        activeBg: 'bg-orange-500 border-orange-500 ring-4 ring-orange-500/25',
        text: 'text-orange-500',
        glow: 'shadow-orange-500/30',
    },
    play: {
        bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 hover:border-emerald-500/50',
        activeBg: 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-500/25',
        text: 'text-emerald-500',
        glow: 'shadow-emerald-500/30',
    },
    sleep: {
        bg: 'bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20 hover:border-violet-500/50',
        activeBg: 'bg-violet-500 border-violet-500 ring-4 ring-violet-500/25',
        text: 'text-violet-500',
        glow: 'shadow-violet-500/30',
    },
    clean: {
        bg: 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/20 hover:border-cyan-500/50',
        activeBg: 'bg-cyan-500 border-cyan-500 ring-4 ring-cyan-500/25',
        text: 'text-cyan-500',
        glow: 'shadow-cyan-500/30',
    },
    healthCheck: {
        bg: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 hover:border-rose-500/50',
        activeBg: 'bg-rose-500 border-rose-500 ring-4 ring-rose-500/25',
        text: 'text-rose-500',
        glow: 'shadow-rose-500/30',
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
        <div className="action-row flex-wrap">
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
                        whileHover={{ y: -2, scale: 1.06 }}
                        whileTap={{ scale: 0.92 }}
                        className={cn(
                            "group relative flex flex-col items-center justify-center rounded-xl border-[1.5px] transition-all duration-200 p-2.5 min-w-[72px] gap-1",
                            isActive
                                ? `${colors.activeBg} shadow-lg ${colors.glow}`
                                : colors.bg
                        )}
                    >
                        {/* Icon */}
                        <div className={cn(
                            "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200",
                            isActive
                                ? 'bg-white/20 text-white'
                                : `bg-transparent ${colors.text}`
                        )}>
                            <Icon className={cn(
                                "w-5 h-5 transition-transform duration-200",
                                isActive && "scale-110 rotate-3"
                            )} />
                        </div>

                        {/* Label */}
                        <span className={cn(
                            "text-[9px] font-bold uppercase tracking-wider leading-none transition-colors",
                            isActive ? 'text-white' : 'text-foreground/70'
                        )}>
                            {label}
                        </span>

                        {/* Cost */}
                        <span className={cn(
                            "text-[8px] font-black tracking-wide",
                            isActive ? 'text-white/70' : 'text-amber-500/70'
                        )}>
                            ${ACTION_COSTS[action]}
                        </span>

                        {/* Burst Ring */}
                        <AnimatePresence>
                            {isActive && (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 1 }}
                                    animate={{ scale: 2.2, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className={cn("absolute inset-0 border-2 rounded-xl pointer-events-none", `border-current ${colors.text}`)}
                                />
                            )}
                        </AnimatePresence>
                    </motion.button>
                );
            })}
        </div>
    );
}
