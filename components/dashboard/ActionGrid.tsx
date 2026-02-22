'use client';

import { motion } from 'framer-motion';
import { ActionType, ALL_ACTIONS, ACTION_LABELS } from '@/lib/gameLogic';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

interface Props {
    onAction: (type: ActionType) => void;
}

export function ActionGrid({ onAction }: Props) {
    return (
        <div className="w-full max-w-2xl mt-8 flex flex-wrap justify-center gap-3 md:gap-4 px-4">
            {ALL_ACTIONS.map((action, i) => {
                const [iconName, ...labelParts] = ACTION_LABELS[action].split(' ');
                const Icon = (Icons as any)[iconName] || Icons.HelpCircle;
                const label = labelParts.join(' ');

                return (
                    <motion.div
                        key={action}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex-1 min-w-[70px] max-w-[100px] md:max-w-none md:w-24"
                    >
                        <Button
                            variant="outline"
                            onClick={() => onAction(action)}
                            className="group relative flex flex-col items-center justify-center w-full h-auto aspect-square rounded-[1.5rem] md:rounded-[2rem] bg-card/60 backdrop-blur-xl border-2 border-border/50 hover:border-primary hover:bg-card transition-all shadow-lg hover:shadow-primary/20 p-3 md:p-4"
                        >
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                <Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <span className="text-[9px] md:text-[11px] font-black uppercase tracking-tighter text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight">
                                {label}
                            </span>

                            {/* Tooltip-like effect */}
                            <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-all bg-primary text-white text-[10px] py-1.5 px-3 rounded-full pointer-events-none whitespace-nowrap z-50 shadow-lg scale-90 group-hover:scale-100 origin-bottom">
                                {action} boosted!
                            </div>
                        </Button>
                    </motion.div>
                );
            })}
        </div>
    );
}
