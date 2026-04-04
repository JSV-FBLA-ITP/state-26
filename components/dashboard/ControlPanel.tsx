'use client';

import { motion } from 'framer-motion';
import { ShoppingBag, GraduationCap, History, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    side: 'left' | 'right';
    onShopOpen: () => void;
    onQuizOpen: () => void;
    onStatsOpen: () => void;
    onOptionsOpen: () => void;
}

const tools = [
    { id: 'shop', label: 'Shop', icon: ShoppingBag, color: 'text-violet-500', hoverBg: 'hover:bg-violet-500/15', activeBg: 'active:bg-violet-500/25', side: 'left' },
    { id: 'quiz', label: 'Quiz', icon: GraduationCap, color: 'text-fuchsia-500', hoverBg: 'hover:bg-fuchsia-500/15', activeBg: 'active:bg-fuchsia-500/25', side: 'left' },
    { id: 'stats', label: 'Stats', icon: History, color: 'text-cyan-500', hoverBg: 'hover:bg-cyan-500/15', activeBg: 'active:bg-cyan-500/25', side: 'right' },
    { id: 'settings', label: 'Settings', icon: Settings2, color: 'text-slate-400', hoverBg: 'hover:bg-slate-400/15', activeBg: 'active:bg-slate-400/25', side: 'right' },
];

export function ControlPanel({ side, onShopOpen, onQuizOpen, onStatsOpen, onOptionsOpen }: Props) {
    const sideTools = tools.filter(t => t.side === side);
    const handlers: Record<string, () => void> = {
        shop: onShopOpen,
        quiz: onQuizOpen,
        stats: onStatsOpen,
        settings: onOptionsOpen
    };

    return (
        <div className={cn(
            "flex flex-col gap-3 p-2",
            side === 'left' ? "items-start" : "items-end"
        )}>
            {sideTools.map((tool) => (
                <motion.button
                    key={tool.label}
                    whileHover={{ scale: 1.1, x: side === 'left' ? 4 : -4 }}
                    whileTap={{ scale: 0.92 }}
                    onClick={handlers[tool.id]}
                    className={cn(
                        "group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 border-[1.5px] border-transparent",
                        tool.hoverBg,
                        "bg-white/5 backdrop-blur-md shadow-lg shadow-black/5 hover:border-white/10"
                    )}
                >
                    <div className={cn("p-2 rounded-xl bg-white/5 transition-colors group-hover:bg-white/10")}>
                        <tool.icon className={cn("w-5 h-5", tool.color)} />
                    </div>
                    <div className="flex flex-col items-start leading-none gap-1">
                        <span className={cn("text-[10px] font-black uppercase tracking-widest", tool.color)}>
                            {tool.label}
                        </span>
                    </div>
                </motion.button>
            ))}
        </div>
    );
}
