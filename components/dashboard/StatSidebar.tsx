import { PetStats, MonthData, ACTION_LABELS, ACTION_COSTS, ActionType } from '@/lib/gameLogic';
import { Heart, Zap, Coffee, Utensils, Calendar, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface Props {
    stats: PetStats;
    monthData: MonthData;
    income?: number;
    expenses?: number;
    onNextMonth: () => void;
    onAction: (type: ActionType) => void;
}

export function StatSidebar({ stats, monthData, income = 0, expenses = 0, onNextMonth, onAction }: Props) {
    const netSavings = income - expenses;

    const statConfig = [
        { label: 'Hunger', value: stats.hunger, icon: Utensils, color: 'bg-blue-500' },
        { label: 'Happiness', value: stats.happy, icon: Heart, color: 'bg-emerald-500' },
        { label: 'Energy', value: stats.energy, icon: Zap, color: 'bg-sky-400' },
        { label: 'Health', value: stats.health, icon: Coffee, color: 'bg-indigo-400' },
    ];

    return (
        <div className="space-y-8">
            {/* Month Progression */}
            <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-2xl bg-primary/10 shadow-inner">
                                <Calendar className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-black text-lg tracking-tight">Month {monthData.currentMonth}</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Lifecycle</p>
                            </div>
                        </div>
                        <Button
                            onClick={onNextMonth}
                            size="sm"
                            className="rounded-xl font-bold gap-2 px-4 shadow-lg shadow-primary/20 bg-linear-to-r from-blue-600 to-primary hover:from-blue-700 hover:to-primary/90 border-0"
                        >
                            Next Month <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Required Actions */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Required Actions</h3>
                <div className="grid grid-cols-3 gap-2">
                    {monthData.requiredActions?.map((action) => {
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
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${isCompleted
                                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400'
                                        : 'bg-card/40 border-border/40 hover:border-primary/50 text-muted-foreground hover:text-primary'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all ${isCompleted ? 'bg-emerald-500 text-white' : 'bg-primary/5 text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
                                <span className="text-[8px] font-bold text-amber-500">${ACTION_COSTS[action]}</span>
                                {isCompleted && <span className="text-[8px] font-black text-emerald-500 mt-1">DONE</span>}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Financial Health Summary */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Budget Outlook</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-3xl">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Income</span>
                        </div>
                        <p className="font-black text-emerald-500 text-lg">${income}</p>
                    </div>
                    <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-3xl">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingDown className="w-3 h-3 text-rose-500" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Expenses</span>
                        </div>
                        <p className="font-black text-rose-500 text-lg">${expenses}</p>
                    </div>
                </div>
                {netSavings !== 0 && (
                    <div className={`text-center py-2 px-4 rounded-full text-[11px] font-black border ${netSavings > 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'}`}>
                        {netSavings > 0 ? `+$${netSavings} Net Surplus next month` : `-$${Math.abs(netSavings)} Net Deficit next month`}
                    </div>
                )}
            </div>

            {/* Wallet */}
            <div className="bg-linear-to-br from-blue-500 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-white/15 transition-colors" />
                <div className="relative z-10 flex flex-col items-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-70 mb-2">Available Liquidity</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold opacity-80">$</span>
                        <h2 className="text-5xl font-black tracking-tighter">{stats.money || 0}</h2>
                    </div>
                    <div className="mt-6 w-full h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>
            </div>

            {/* Core Stats */}
            <div className="space-y-6 pt-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Vital Signs</h3>
                <div className="grid grid-cols-1 gap-4">
                    {statConfig.map((s) => (
                        <div key={s.label} className="bg-card/40 backdrop-blur-md border border-border/50 p-5 rounded-[1.5rem] hover:border-primary/30 transition-all group">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-xl ${s.color} bg-opacity-10 group-hover:scale-110 transition-transform`}>
                                        <s.icon className={`w-4 h-4 ${s.color.replace('bg-', 'text-')}`} />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-wider">{s.label}</span>
                                </div>
                                <span className={`text-[11px] font-black ${s.value < 30 ? 'text-rose-500 animate-pulse' : 'text-muted-foreground'}`}>{Math.round(s.value)}%</span>
                            </div>
                            <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${s.value}%` }}
                                    className={`h-full transition-all duration-500 ${s.color} shadow-sm`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
