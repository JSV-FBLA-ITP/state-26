'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchExpenses, loadPet } from '@/lib/storage';
import {
    ReceiptText,
    ArrowUpRight,
    ArrowDownLeft,
    Calendar,
    Coins,
    TrendingDown,
    Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [pet, setPet] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPageData = async () => {
            const petId = localStorage.getItem('currentPetId');
            if (!petId) return;

            const [petRes, expRes] = await Promise.all([
                loadPet(petId),
                fetchExpenses(petId)
            ]);

            if (petRes.data) setPet(petRes.data);
            if (expRes.data) setExpenses(expRes.data);
            setLoading(false);
        };

        loadPageData();
    }, []);

    const totalSpent = expenses.reduce((acc, curr) => acc + curr.cost, 0);

    if (loading) return null;

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2">Expense Analytics</h1>
                    <p className="text-muted-foreground text-lg italic">
                        "Tracking the cost of companionship." — {pet?.name}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-card border-2 border-border/50 rounded-2xl p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-yellow/10">
                            <TrendingDown className="w-6 h-6 text-yellow" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Total Spent</p>
                            <p className="text-2xl font-black">${totalSpent.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List of Transactions */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-2 px-2">
                        <h2 className="font-bold flex items-center gap-2">
                            <ReceiptText className="w-5 h-5" />
                            Transaction History
                        </h2>
                        <Button variant="ghost" size="sm" className="rounded-lg font-bold">
                            <Filter className="w-4 h-4 mr-2" />
                            Filter
                        </Button>
                    </div>

                    {expenses.length === 0 ? (
                        <div className="text-center py-24 bg-card/30 rounded-3xl border-2 border-dashed border-border/50">
                            <p className="text-muted-foreground font-bold">No expenses recorded yet.</p>
                        </div>
                    ) : (
                        expenses.map((exp, i) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-card border-2 border-border/50 rounded-2xl p-5 flex items-center justify-between hover:border-primary/30 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg">{exp.item}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(exp.created_at).toLocaleDateString()}
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            {exp.category || 'Maintenance'}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-rose-500">-${exp.cost}</p>
                                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Settled</p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Summary Sidebar */}
                <div className="space-y-6">
                    <div className="p-8 rounded-[2rem] bg-indigo-500/5 border-2 border-indigo-500/10">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <Coins className="w-6 h-6 text-indigo-500" />
                            Economic Outlook
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">Current Liquidity</p>
                                <p className="text-3xl font-black text-primary">${pet?.stats.money}</p>
                            </div>
                            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (pet?.stats.money / 1000) * 100)}%` }}
                                />
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Maintaining a healthy reserve of at least <strong>$200</strong> is recommended for emergency vet consultations.
                            </p>
                        </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-emerald-500/5 border-2 border-emerald-500/10">
                        <h3 className="text-lg font-bold mb-4">Financial Advice</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Your pet's happiness is the primary driver of ROI. Investing in treats early can reduce long-term medical liabilities.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
