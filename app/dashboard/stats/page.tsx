/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchExpenses, loadPet } from '@/lib/storage';
import {
    ReceiptText,
    ArrowUpRight,
    Calendar,
    TrendingDown,
    Wallet,
    Target,
    History,
    Award
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function StatsPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [pet, setPet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPageData = async () => {
            const petId = localStorage.getItem('currentPetId');
            if (!petId) return;
            const [petRes, expRes] = await Promise.all([loadPet(petId), fetchExpenses(petId)]);
            if (petRes.data) setPet(petRes.data);
            if (expRes.data) setExpenses(expRes.data);
            setLoading(false);
        };
        loadPageData();
    }, []);

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);
    const savingsProgress = pet ? (pet.savingsCurrent / pet.savingsGoal) * 100 : 0;

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 animate-pulse" />
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-6xl mx-auto pb-24">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">{pet?.name}&apos;s Statistics</h1>
                    <p className="text-muted-foreground italic">
                        Comprehensive ledger and analytics for your companion.
                    </p>
                </div>

                <div className="flex gap-4 shrink-0 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                    <div className="bg-primary/10 border border-primary/20 rounded-2xl px-5 py-4 flex items-center gap-4 shrink-0">
                        <div className="p-2.5 rounded-xl bg-primary/15">
                            <Award className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Interactions</p>
                            <p className="text-2xl font-black">{pet?.interactionCount || 0}</p>
                        </div>
                    </div>
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-4 flex items-center gap-4 shrink-0">
                        <div className="p-2.5 rounded-xl bg-rose-500/15">
                            <TrendingDown className="w-5 h-5 text-rose-500" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Total Spent</p>
                            <p className="text-2xl font-black">${totalSpent.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Stats / Sidebar equivalent */}
                <div className="space-y-5 lg:col-span-1">
                    {/* Balance */}
                    <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-4">
                            <Wallet className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-500 font-bold">Available Cash</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-3xl font-black text-blue-500">${pet?.stats?.money ?? 0}</p>
                            </div>
                            <div className="w-24 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, ((pet?.stats?.money || 0) / 1000) * 100)}%` }}
                                    transition={{ ease: 'easeOut', duration: 0.8 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Savings Goal */}
                    <div className="p-6 rounded-2xl bg-yellow/10 border border-yellow/20">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-yellow" />
                                <span className="text-yellow font-bold">Savings Goal</span>
                            </div>
                            <span className="text-sm font-black text-yellow">${pet?.savingsGoal || 0}</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-yellow/70">Current Savings</span>
                                <span className="font-black text-yellow">${pet?.savingsCurrent || 0}</span>
                            </div>
                            <Progress value={Math.min(100, savingsProgress || 0)} className="h-4 bg-yellow/20" />
                            <p className="text-[10px] text-center text-yellow/70 uppercase font-bold tracking-widest">
                                {savingsProgress >= 100 ? 'Goal Reached!' : `${Math.floor(100 - (savingsProgress || 0))}% remaining`}
                            </p>
                        </div>
                    </div>

                    {/* Learned Tricks */}
                    <div className="p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                        <div className="flex items-center gap-2 mb-4">
                            <History className="w-5 h-5 text-indigo-500" />
                            <span className="text-indigo-500 font-bold">Evolution History</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {pet?.learnedTricks && pet.learnedTricks.length > 0 ? (
                                pet.learnedTricks.map((trick: string) => (
                                    <div key={trick} className="px-3 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-xs font-bold text-indigo-500">
                                        {trick}
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-indigo-500/60 w-full text-center py-4 border-2 border-dashed border-indigo-500/20 rounded-xl">No evolution traits yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h2 className="font-bold flex items-center gap-2 text-lg">
                            <ReceiptText className="w-5 h-5 text-foreground" />
                            Ledger & Transactions
                        </h2>
                        <span className="text-xs text-muted-foreground font-semibold bg-muted/50 px-3 py-1 rounded-full">{expenses.length} records</span>
                    </div>

                    {expenses.length === 0 ? (
                        <div className="text-center py-24 bg-card/30 rounded-3xl border-2 border-dashed border-border/50">
                            <ReceiptText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <p className="text-muted-foreground font-bold text-lg">No expenses recorded yet.</p>
                            <p className="text-sm text-muted-foreground mt-1">Shop upgrades and purchases will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {expenses.map((exp, i) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="bg-card border border-border/50 rounded-2xl px-5 py-4 flex items-center justify-between hover:border-rose-500/30 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                                            <ArrowUpRight className="w-5 h-5 text-rose-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold">{exp.item}</p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(exp.created_at).toLocaleDateString()}
                                                <span className="w-1 h-1 rounded-full bg-border inline-block" />
                                                {exp.category || 'Maintenance'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-2">
                                        <p className="text-lg font-black text-rose-500">-${exp.cost}</p>
                                        <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground mt-0.5">Settled</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
