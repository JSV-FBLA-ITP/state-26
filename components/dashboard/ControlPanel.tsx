'use client';

import { Button } from '@/components/ui/button';
import { ShoppingBag, GraduationCap, History, Settings2 } from 'lucide-react';

interface Props {
    onShopOpen: () => void;
    onQuizOpen: () => void;
    onStatsOpen: () => void;
    onOptionsOpen: () => void;
}

export function ControlPanel({ onShopOpen, onQuizOpen, onStatsOpen, onOptionsOpen }: Props) {
    const tools = [
        { label: 'Shop', icon: ShoppingBag, color: 'text-indigo-500', onClick: onShopOpen },
        { label: 'Quiz', icon: GraduationCap, color: 'text-amber-500', onClick: onQuizOpen },
        { label: 'Stats', icon: History, color: 'text-emerald-500', onClick: onStatsOpen },
        { label: 'Options', icon: Settings2, color: 'text-muted-foreground', onClick: onOptionsOpen },
    ];

    return (
        <div className="grid grid-cols-4 gap-3">
            {tools.map((tool) => (
                <Button
                    key={tool.label}
                    variant="ghost"
                    onClick={tool.onClick}
                    className="flex flex-col items-center justify-center py-4 px-2 h-auto rounded-[1.5rem] gap-2 hover:bg-primary/5 transition-all active:scale-95"
                >
                    <div className={`w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center transition-colors group-hover:bg-primary/10`}>
                        <tool.icon className={`w-6 h-6 ${tool.color}`} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{tool.label}</span>
                </Button>
            ))}
        </div>
    );
}
