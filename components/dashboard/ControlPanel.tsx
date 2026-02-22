'use client';

import { Button } from '@/components/ui/button';
import { ShoppingBag, GraduationCap, History, Settings2 } from 'lucide-react';

interface Props {
    onShopOpen: () => void;
    onQuizOpen: () => void;
    onStatsOpen: () => void;
    onOptionsOpen: () => void;
}

const tools = [
    { label: 'Shop', icon: ShoppingBag, bg: 'bg-violet-500/10 group-hover:bg-violet-500/20', color: 'text-violet-500', glow: 'hover:shadow-violet-500/20' },
    { label: 'Quiz', icon: GraduationCap, bg: 'bg-amber-500/10 group-hover:bg-amber-500/20', color: 'text-amber-500', glow: 'hover:shadow-amber-500/20' },
    { label: 'Stats', icon: History, bg: 'bg-emerald-500/10 group-hover:bg-emerald-500/20', color: 'text-emerald-500', glow: 'hover:shadow-emerald-500/20' },
    { label: 'Settings', icon: Settings2, bg: 'bg-muted/50 group-hover:bg-muted', color: 'text-muted-foreground', glow: '' },
];

export function ControlPanel({ onShopOpen, onQuizOpen, onStatsOpen, onOptionsOpen }: Props) {
    const handlers = [onShopOpen, onQuizOpen, onStatsOpen, onOptionsOpen];

    return (
        <div className="grid grid-cols-4 gap-2">
            {tools.map((tool, i) => (
                <Button
                    key={tool.label}
                    variant="ghost"
                    onClick={handlers[i]}
                    className={`group flex flex-col items-center justify-center py-3 px-2 h-auto rounded-2xl gap-1.5 transition-all active:scale-95 hover:shadow-lg ${tool.glow}`}
                >
                    <div className={`w-11 h-11 rounded-xl ${tool.bg} flex items-center justify-center transition-all`}>
                        <tool.icon className={`w-5 h-5 ${tool.color}`} />
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-wider ${tool.color}`}>{tool.label}</span>
                </Button>
            ))}
        </div>
    );
}
