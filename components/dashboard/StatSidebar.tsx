'use client';

import { PetStats, MonthData } from '@/lib/gameLogic';
import { Progress } from '@/components/ui/progress';
import { Heart, Zap, Coffee, Utensils, Coins, Calendar } from 'lucide-react';

interface Props {
    stats: PetStats;
    monthData: MonthData;
}

export function StatSidebar({ stats, monthData }: Props) {
    const statConfig = [
        { label: 'Hunger', value: stats.hunger, icon: Utensils, color: 'bg-orange-500' },
        { label: 'Happiness', value: stats.happy, icon: Heart, color: 'bg-emerald-500' },
        { label: 'Energy', value: stats.energy, icon: Zap, color: 'bg-yellow' },
        { label: 'Health', value: stats.health, icon: Coffee, color: 'bg-rose-500' },
    ];

    return (
        <div className="space-y-10">
            {/* Month Progression */}
            <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-primary/10">
                        <Calendar className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Month {monthData.currentMonth}</h3>
                        <p className="text-sm text-muted-foreground">Journey Progress</p>
                    </div>
                </div>
                <Progress value={(monthData.currentMonth / 12) * 100} className="h-3 bg-primary/10" />
            </div>

            {/* Core Stats */}
            <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground ml-2">Vital Signs</h3>
                {statConfig.map((s) => (
                    <div key={s.label} className="space-y-3">
                        <div className="flex justify-between items-center text-sm font-bold">
                            <div className="flex items-center gap-2">
                                <s.icon className={`w-4 h-4 ${s.color.replace('bg-', 'text-')}`} />
                                <span>{s.label}</span>
                            </div>
                            <span className={s.value < 30 ? 'text-rose-500' : 'text-muted-foreground'}>{Math.round(s.value)}%</span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${s.color}`}
                                style={{ width: `${s.value}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Wallet */}
            <div className="pt-6 border-t border-border/50">
                <div className="bg-yellow/10 rounded-3xl p-6 border border-yellow/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-2xl bg-yellow/10">
                                <Coins className="w-6 h-6 text-yellow" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-yellow uppercase tracking-wider">Total Balance</p>
                                <p className="text-2xl font-black text-yellow">${stats.money || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
