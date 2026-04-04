'use client';

import { PetStats, MonthData, ACTION_LABELS, ACTION_COSTS, ActionType } from '@/lib/gameLogic';
import { Heart, Zap, Coffee, Utensils } from 'lucide-react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    stats: PetStats;
    monthData: MonthData;
    income?: number;
    expenses?: number;
    onNextMonth: () => void;
    onAction: (type: ActionType) => void;
}

const STAT_CONFIG = [
    { key: 'hunger', label: 'HGR', icon: Utensils, color: 'bg-orange-500', textColor: 'text-orange-500' },
    { key: 'happy', label: 'HPY', icon: Heart, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
    { key: 'energy', label: 'NRG', icon: Zap, color: 'bg-sky-400', textColor: 'text-sky-400' },
    { key: 'health', label: 'HP', icon: Coffee, color: 'bg-indigo-400', textColor: 'text-indigo-400' },
] as const;

export function StatSidebar({ stats, monthData, onAction }: Props) {
    return (
        <div className="flex flex-col gap-0">
            {/* Horizontal stat strip */}
            <div className="stat-strip">
                {STAT_CONFIG.map((s) => {
                    const value = Math.round(stats[s.key] as number);
                    const isLow = value < 30;
                    return (
                        <div key={s.key} className="stat-strip-item">
                            <s.icon className={cn("w-4 h-4 flex-shrink-0", s.textColor, isLow && "animate-pulse")} />
                            <div className="stat-strip-bar">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value}%` }}
                                    className={cn("stat-strip-fill", s.color)}
                                />
                            </div>
                            <span className={cn(
                                "text-xs font-black tabular-nums min-w-[32px] text-right",
                                isLow ? 'text-rose-500' : 'text-muted-foreground'
                            )}>
                                {value}%
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Required actions row */}
            {monthData.requiredActions && monthData.requiredActions.length > 0 && (
                <div className="flex items-center justify-center gap-2 px-4 py-2.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground mr-2">Tasks:</span>
                    {monthData.requiredActions.map((action) => {
                        const isCompleted = (monthData.actionsCompleted[action] || 0) > 0;
                        const [iconName, ...labelParts] = ACTION_LABELS[action].split(' ');
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
                        const label = labelParts.join(' ');

                        return (
                            <motion.button
                                key={action}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => onAction(action)}
                                className={cn(
                                    "required-chip",
                                    isCompleted && "required-chip-done"
                                )}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span>{label}</span>
                                {isCompleted && <Icons.Check className="w-3.5 h-3.5" />}
                            </motion.button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
