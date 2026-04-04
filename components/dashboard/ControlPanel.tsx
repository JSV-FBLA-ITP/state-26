'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, GraduationCap, History, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    onShopOpen: () => void;
    onQuizOpen: () => void;
    onStatsOpen: () => void;
    onOptionsOpen: () => void;
}

const tools = [
    { label: 'Shop', icon: ShoppingBag, color: 'text-blue-500', hoverBg: 'hover:bg-blue-500/15', activeBg: 'active:bg-blue-500/25' },
    { label: 'Quiz', icon: GraduationCap, color: 'text-amber-500', hoverBg: 'hover:bg-amber-500/15', activeBg: 'active:bg-amber-500/25' },
    { label: 'Stats', icon: History, color: 'text-emerald-500', hoverBg: 'hover:bg-emerald-500/15', activeBg: 'active:bg-emerald-500/25' },
    { label: 'Settings', icon: Settings2, color: 'text-muted-foreground', hoverBg: 'hover:bg-muted/50', activeBg: 'active:bg-muted' },
];

export function ControlPanel({ onShopOpen, onQuizOpen, onStatsOpen, onOptionsOpen }: Props) {
    const handlers = [onShopOpen, onQuizOpen, onStatsOpen, onOptionsOpen];

    return (
        <div className="control-row">
            {tools.map((tool, i) => (
                <motion.button
                    key={tool.label}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handlers[i]}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl transition-all",
                        tool.hoverBg,
                        tool.activeBg
                    )}
                >
                    <tool.icon className={cn("w-5 h-5", tool.color)} />
                    <span className={cn("text-xs font-black uppercase tracking-wider", tool.color)}>
                        {tool.label}
                    </span>
                </motion.button>
            ))}
        </div>
    );
}
