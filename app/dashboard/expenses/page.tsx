'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchExpenses, loadPet } from '@/lib/storage';
import {
    ReceiptText,
    ArrowUpRight,
    Calendar,
    Coins,
    TrendingDown,
    Wallet,
    Lightbulb,
} from 'lucide-react';

export default function ExpensesPage() {
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

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 rounded-2xl bg-primary/20 animate-pulse" />
        </div>
    );

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto pb-24">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Expense Analytics</h1>
                    <p className="text-muted-foreground italic">
                        &ldquo;Tracking the cost of companionship.&rdquo; — <span className="font-bold text-foreground">{pet?.name}</span>
                    </p>
                </div>

                {/* Total spent card */}
                <div className="flex gap-4 shrink-0">
                    <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-4 flex items-center gap-4">
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
                {/* Transaction List */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="flex items-center justify-between mb-2 px-1">
                        <h2 className="font-bold flex items-center gap-2">
                            <ReceiptText className="w-4 h-4 text-primary" />
                            Transaction History
                        </h2>
                        <span className="text-xs text-muted-foreground font-semibold">{expenses.length} records</span>
                    </div>

                    {expenses.length === 0 ? (
                        <div className="text-center py-20 bg-card/30 rounded-3xl border-2 border-dashed border-border/50">
                            <ReceiptText className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground font-bold">No expenses recorded yet.</p>
                            <p className="text-sm text-muted-foreground">Shop upgrades and purchases will appear here.</p>
                        </div>
                    ) : (
                        expenses.map((exp, i) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: -16 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.04 }}
                                className="bg-card border border-border/50 rounded-2xl px-5 py-4 flex items-center justify-between hover:border-rose-500/30 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
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
                                <div className="text-right">
                                    <p className="text-lg font-black text-rose-500">-${exp.cost}</p>
                                    <p className="text-[9px] uppercase font-bold tracking-widest text-muted-foreground">Settled</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-5">
                    {/* Balance */}
                    <div className="p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-4">
                            <Wallet className="w-4 h-4 text-blue-500" />
                            <span className="text-blue-500">Economic Outlook</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-3xl font-black text-blue-500">${pet?.stats.money ?? 0}</p>
                                <p className="text-sm font-bold text-blue-500/70">Available Cash</p>
                            </div>
                            <div className="w-24 h-2 bg-blue-500/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, ((pet?.stats.money || 0) / 1000) * 100)}%` }}
                                    transition={{ ease: 'easeOut', duration: 0.8 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Balance coins */}
                    <div className="p-5 rounded-2xl bg-yellow/10 border border-yellow/20 flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-yellow/15">
                            <Coins className="w-5 h-5 text-yellow" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-yellow uppercase tracking-widest">Total Invested</p>
                            <p className="text-xl font-black">${totalSpent.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Advice */}
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-emerald-500" />
                            <span className="text-emerald-500">Financial Advice</span>
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your pet&apos;s happiness is the primary driver of ROI. Investing in treats early
                            can reduce long-term medical liabilities significantly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
