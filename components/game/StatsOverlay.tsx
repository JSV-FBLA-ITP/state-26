'use client';

/**
 * PetPal Game: Financial Records & Stats
 * 
 * Aggregates game data into a professional dashboard format to demonstrate 
 * financial tracking capabilities.
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import { motion, AnimatePresence } from 'framer-motion';
import { X, History, TrendingUp, Award, ReceiptText, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PetData } from '@/lib/gameLogic';
import { Progress } from '@/components/ui/progress';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    pet: PetData;
    inline?: boolean;
}

export function StatsOverlay({ isOpen, onClose, pet, inline }: Props) {
    const savingsProgress = (pet.savingsCurrent / pet.savingsGoal) * 100;

    if (!isOpen && !inline) return null;

    const content = (
        <motion.div
            initial={inline ? { opacity: 0, x: 20 } : { scale: 0.9, opacity: 0, y: 20 }}
            animate={inline ? { opacity: 1, x: 0 } : { scale: 1, opacity: 1, y: 0 }}
            exit={inline ? { opacity: 0, x: 20 } : { scale: 0.9, opacity: 0, y: 20 }}
            className={inline
                ? "flex-1 min-h-0 flex flex-col w-full"
                : "relative w-full max-w-2xl bg-card rounded-[2.5rem] border-2 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"}
        >
            {/* Header */}
            <div className={`p-8 shrink-0 flex items-center justify-between ${inline ? 'pb-2' : 'border-b border-border/50 bg-linear-to-r from-emerald-500/10 to-transparent'}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-emerald-500/10">
                        <BarChart3 className="w-6 h-6 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">{pet.name}'s Analytics</h2>
                        <p className="text-muted-foreground text-sm">Lifetime growth and financial tracking</p>
                    </div>
                </div>
                {!inline && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                        <X className="w-6 h-6" />
                    </Button>
                )}
            </div>

            {/* Content */}
            <div className={`p-8 overflow-y-auto custom-scrollbar space-y-8 ${inline ? 'flex-1 min-h-0' : ''}`}>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-3 mb-2">
                            <Award className="w-5 h-5 text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-primary">Interactions</span>
                        </div>
                        <div className="text-3xl font-black tracking-tighter">{pet.interactionCount}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total quality time spent</p>
                    </div>

                    <div className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/10">
                        <div className="flex items-center gap-3 mb-2">
                            <ReceiptText className="w-5 h-5 text-rose-500" />
                            <span className="text-xs font-black uppercase tracking-widest text-rose-500">Expenses</span>
                        </div>
                        <div className="text-3xl font-black tracking-tighter">${pet.totalExpenses}</div>
                        <p className="text-xs text-muted-foreground mt-1">Lifetime care investment</p>
                    </div>
                </div>

                {/* Savings Track */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-yellow" />
                            <h3 className="font-bold">Next Milestone</h3>
                        </div>
                        <span className="text-sm font-black text-yellow">${pet.savingsGoal} Goal</span>
                    </div>
                    <div className="p-6 rounded-3xl bg-card border-2 space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Current Savings</span>
                            <span className="font-black">${pet.savingsCurrent}</span>
                        </div>
                        <Progress value={Math.min(100, savingsProgress)} className="h-4 bg-yellow/10" />
                        <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                            {savingsProgress >= 100 ? 'Goal Reached!' : `${Math.floor(100 - savingsProgress)}% remaining to target`}
                        </p>
                    </div>
                </div>

                {/* Learned Tricks */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-500" />
                        <h3 className="font-bold">Evolution History</h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {pet.learnedTricks.length > 0 ? (
                            pet.learnedTricks.map((trick) => (
                                <div key={trick} className="px-4 py-2 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs font-bold text-center">
                                    {trick}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full border-2 border-dashed rounded-2xl p-8 text-center">
                                <p className="text-sm text-muted-foreground">No special evolution traits yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-muted/30 border-t border-border/50 text-center shrink-0">
                <p className="text-xs text-muted-foreground">
                    Detailed reports help you make better financial decisions for your household.
                </p>
            </div>
        </motion.div>
    );

    if (inline) {
        return content;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />
                    {content}
                </div>
            )}
        </AnimatePresence>
    );
}
