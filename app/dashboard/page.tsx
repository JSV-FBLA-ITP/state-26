/* eslint-disable @typescript-eslint/no-require-imports */
'use client';

/**
 * PetPal Game Dashboard
 * 
 * The central component in the PetPal ecosystem. This file orchestrates:
 * 1. State Management: Real-time pet statistics (hunger, happiness, health, energy).
 * 2. Action Handling: Feeding, Playing, Training, and Medical care with budget constraints.
 * 3. Monthly Progression: Processing time increments, income generation, and random events.
 * 4. Modals & Overlays: Shop, Quizzes, Financial Stats, and Help modules.
 * 
 * FBLA Competitive Requirements addressed:
 * - Interactive Virtual Pet caring logic.
 * - Dynamic 3D visual feedback system.
 * - Budgeting and Financial Responsibility (alert systems and expense categorization).
 * - Multi-pet support logic.
 */

import { useState, useEffect, useCallback } from 'react';
import { ActionType, getEmotionData, PetData, areRequiredActionsCompleted, ACTION_COSTS, processNextMonth } from '@/lib/gameLogic';
import { loadPet, savePetToCloud, saveExpense } from '@/lib/storage';
import { PetDisplay } from '@/components/dashboard/PetDisplay';
import { ShopOverlay } from '@/components/game/ShopOverlay';
import { QuizOverlay } from '@/components/game/QuizOverlay';
import { StatsOverlay } from '@/components/game/StatsOverlay';
import { OptionsOverlay } from '@/components/game/OptionsOverlay';
import { createClient } from '@/utils/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, PawPrint, Calendar, ArrowRight, Wallet, TrendingUp, TrendingDown, Store, BrainCircuit, Settings, Heart, Utensils, Zap, Coffee, Moon, Sparkles, Stethoscope, LucideIcon, ChevronLeft, ChevronRight, HelpCircle, X, Info } from 'lucide-react';

function StatItem({ icon: Icon, value, color }: { icon: LucideIcon; value: number; color: string }) {
    const isLow = value < 30;
    return (
        <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-muted/50 sm:bg-muted/30 backdrop-blur-sm">
            <Icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0", color, isLow && "animate-pulse")} />
            <div className="hidden sm:block w-12 sm:w-16 h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${value}%` }} />
            </div>
            <span className={cn("text-[10px] sm:text-xs font-black tabular-nums w-4 sm:w-10 text-right", isLow ? "text-rose-500" : "text-muted-foreground")}>
                {value}
            </span>
        </div>
    );
}

function ActionButton({ label, cost, icon: Icon, color, onClick }: { action: string; label: string; cost: number; icon: LucideIcon; color: string; onClick: () => void }) {
    const [active, setActive] = useState(false);
    
    const handleClick = () => {
        setActive(true);
        onClick();
        setTimeout(() => setActive(false), 300);
    };
    
    return (
        <motion.button
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "flex flex-col items-center justify-center gap-1 px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-200 min-w-[50px] sm:min-w-[70px] lg:min-w-[80px]",
                active
                    ? `${color}/20 border-current`
                    : `bg-muted/30 hover:bg-muted/50 border-border/50`
            )}
        >
            <Icon className={cn("w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7", color)} />
            <span className="text-[9px] sm:text-[10px] lg:text-xs font-bold uppercase tracking-wide">{label}</span>
            <span className={cn("text-[8px] sm:text-[9px] lg:text-[10px] font-black", color)}>${cost}</span>
        </motion.button>
    );
}
import { cn } from '@/lib/utils';

type TabView = 'pet' | 'stats' | 'shop' | 'quiz' | 'settings';

const TAB_COLORS = {
    shop: {
        bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20',
        activeBg: 'bg-amber-500 border-amber-500 ring-4 ring-amber-500/25',
        text: 'text-amber-500',
        glow: 'shadow-amber-500/30',
    },
    quiz: {
        bg: 'bg-indigo-500/10 hover:bg-indigo-500/20 border-indigo-500/20',
        activeBg: 'bg-indigo-500 border-indigo-500 ring-4 ring-indigo-500/25',
        text: 'text-indigo-500',
        glow: 'shadow-indigo-500/30',
    },
    pet: {
        bg: 'bg-primary/10 hover:bg-primary/20 border-primary/20',
        activeBg: 'bg-primary border-primary ring-4 ring-primary/25',
        text: 'text-primary',
        glow: 'shadow-primary/30',
    },
    stats: {
        bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20',
        activeBg: 'bg-emerald-500 border-emerald-500 ring-4 ring-emerald-500/25',
        text: 'text-emerald-500',
        glow: 'shadow-emerald-500/30',
    },
    settings: {
        bg: 'bg-slate-500/10 hover:bg-slate-500/20 border-slate-500/20',
        activeBg: 'bg-slate-500 border-slate-500 ring-4 ring-slate-500/25',
        text: 'text-slate-500',
        glow: 'shadow-slate-500/30',
    }
};

export default function DashboardPage() {
    const [pet, setPet] = useState<PetData | null>(null);
    const [availablePets, setAvailablePets] = useState<PetData[]>([]);
    const [loading, setLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warn' | 'info' | null }>({ message: '', type: null });
    const [showHelp, setShowHelp] = useState(false);
    const [monthlySummary, setMonthlySummary] = useState<any>(null);
    const [currentTab, setCurrentTab] = useState<TabView>('pet');

    const loadData = useCallback(async () => {
        let petId = localStorage.getItem('currentPetId');

        const { data: cloudPets } = await (await import('@/lib/storage')).fetchUserPets();
        setAvailablePets(cloudPets || []);

        if (!petId) {
            if (cloudPets && cloudPets.length > 0) {
                petId = cloudPets[0].id;
                localStorage.setItem('currentPetId', petId!);
            } else {
                window.location.href = '/onboarding';
                return;
            }
        }

        const { data, error } = await loadPet(petId!);
        if (!error && data) {
            setPet(data);

            if (petId!.startsWith('guest_')) {
                await savePetToCloud(data);
            }

            if (data.stats.health <= 0) {
                setGameOver(true);
            }
        } else {
            console.error('Error loading pet:', error);
            localStorage.removeItem('currentPetId');
            window.location.href = '/onboarding';
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleSwitchPet = (direction: 'next' | 'prev') => {
        if (!availablePets || availablePets.length <= 1 || !pet) return;
        const currentIndex = availablePets.findIndex(p => p.id === pet.id);
        if (currentIndex === -1) return;
        let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= availablePets.length) newIndex = 0;
        if (newIndex < 0) newIndex = availablePets.length - 1;
        const nextPetId = availablePets[newIndex].id;
        if (nextPetId) {
            localStorage.setItem('currentPetId', nextPetId);
        }
        setLoading(true);
        loadData();
    };

    // Manual save removed, auto-save handles data persistence.

    useEffect(() => {
        if (!pet) return;
        const timeout = setTimeout(() => {
            savePetToCloud(pet);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [pet]);

    /**
     * Executes a pet care action (feed, play, train, etc.)
     * Includes FBLA-required budget validation and categorization logic.
     */
    const handleAction = (type: ActionType) => {
        if (!pet) return;

        // 1. Financial check: Ensure user has sufficient virtual currency
        const cost = ACTION_COSTS[type];
        if ((pet.stats.money || 0) < cost) {
            setFeedback({ message: `Not enough money! Need $${cost}`, type: 'warn' });
            setTimeout(() => setFeedback({ message: '', type: null }), 3000);
            return;
        }

        // 2. FBLA Budget Compliance: Warn user if spending exceeds their monthly limit
        const currentMonthExpenses = Object.values(pet.monthData.actionsCompleted).reduce((sum, count) => sum + (count * 10), 0);
        if (currentMonthExpenses + cost > (pet.budgetLimit || 1000)) {
             setFeedback({ message: `Budget Alert! You are exceeding your $${pet.budgetLimit} limit!`, type: 'warn' });
        }

        const newPet = { ...pet };
        const statMap: Record<ActionType, keyof typeof newPet.stats> = {
            feed: 'hunger',
            play: 'happy',
            sleep: 'energy',
            clean: 'health',
            healthCheck: 'health',
            train: 'happy'
        };

        const targetStat = statMap[type];

        // 3. Dynamic Boost Calculation: Uses diminishing returns to encourage balanced care
        const { getDiminishedBoost, recordClickForStat } = require('@/lib/gameLogic');
        recordClickForStat(targetStat);
        const boost = getDiminishedBoost(targetStat, 15, newPet.stats[targetStat]);

        // 4. Update state: Apply stat changes and deduct currency
        newPet.stats[targetStat] = Math.min(100, newPet.stats[targetStat] + boost);
        newPet.stats.money = (newPet.stats.money || 0) - cost;
        newPet.totalExpenses += cost;
        newPet.interactionCount += 1;

        // 5. Track completion for fbla "Monthly Care Requirements"
        newPet.monthData.actionsCompleted[type] = (newPet.monthData.actionsCompleted[type] || 0) + 1;

        setPet({ ...newPet });

        // 6. Persistence & Ledger: Record categorized expense for financial reporting
        const { saveExpense } = require('@/lib/storage');
        const { ACTION_CATEGORIES } = require('@/lib/gameLogic');
        saveExpense(newPet.id, type.charAt(0).toUpperCase() + type.slice(1), cost, ACTION_CATEGORIES[type]);

        if (newPet.stats.health <= 0) {
            setGameOver(true);
            return;
        }

        if (boost > 0) {
            setFeedback({ message: `Your pet feels better! (+${boost} ${targetStat}, -$${cost})`, type: 'success' });
        } else {
            setFeedback({ message: `Your pet is already full or bored of this! (-$${cost})`, type: 'info' });
        }
        setTimeout(() => setFeedback({ message: '', type: null }), 3000);
    };

    const handleNextMonth = () => {
        if (!pet) return;

        if (!areRequiredActionsCompleted(pet.monthData)) {
            const missingActions = pet.monthData.requiredActions
                .filter(action => (pet.monthData.actionsCompleted[action] || 0) === 0)
                .map(action => action.charAt(0).toUpperCase() + action.slice(1).replace(/([A-Z])/g, ' $1'))
                .join(', ');
            setFeedback({ message: `Complete these actions first: ${missingActions}`, type: 'warn' });
            setTimeout(() => setFeedback({ message: '', type: null }), 4000);
            return;
        }

        const { pet: nextPet, emergencyCost, newTrick } = processNextMonth(pet);

        if (nextPet.stats.health <= 0) {
            setPet(nextPet);
            setGameOver(true);
            return;
        }

        // Record emergency expense if it happened
        if (emergencyCost > 0 && nextPet.id) {
            saveExpense(nextPet.id, 'Vet Emergency', emergencyCost, 'Health');
        }

        setPet(nextPet);
        setMonthlySummary({
            month: nextPet.monthData.currentMonth - 1,
            income: nextPet.monthlyIncome || 0,
            expenses: nextPet.monthlyExpenses || 0,
            emergency: emergencyCost,
            trick: newTrick
        });
        savePetToCloud(nextPet);
    };

    const handlePurchase = (stat: string, cost: number) => {
        if (!pet || (pet.stats.money || 0) < cost) {
            setFeedback({ message: "Not enough money!", type: 'warn' });
            return;
        }
        const newPet = { ...pet };
        newPet.stats.money -= cost;
        newPet.totalExpenses += cost;
        newPet.shop_upgrades[stat] = (newPet.shop_upgrades[stat] || 0) + 1;
        newPet.shop_multipliers[stat] = (newPet.shop_multipliers[stat] || 1.0) * 0.9;

        setPet({ ...newPet });
        setFeedback({ message: `Levelled up ${stat}!`, type: 'success' });
    };

    const handleQuizComplete = (reward: number) => {
        if (!pet) return;
        const newPet = { ...pet };
        newPet.stats.money += reward;
        newPet.savingsCurrent += reward;

        setPet({ ...newPet });
        setFeedback({ message: `Excellence! Earned $${reward}`, type: 'success' });
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const handleGameOver = () => {
        localStorage.removeItem('currentPetId');
        window.location.href = '/dashboard/pets';
    };

    if (loading) return null;
    if (!pet) return <div>Pet not found.</div>;

    const emotion = getEmotionData(pet.stats);
    const showGameUI = !gameOver;
    const income = pet.monthlyIncome || 0;
    const expenses = pet.monthlyExpenses || 0;
    const netSavings = income - expenses;

    return (
        <div className="game-screen-wrapper">
            <div className={cn("game-window", gameOver && 'pointer-events-none')}>

                {/* Dot grid texture */}
                <div className="game-window-grid" aria-hidden />

                {/* ── UNIFIED LAYOUT ─────────────────────────── */}
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Unified Responsive Topbar */}
                    <div className="flex game-topbar overflow-x-auto scrollbar-hide px-3 sm:px-6 py-3 items-center justify-between shrink-0 border-b border-border/10 bg-background/50 backdrop-blur-md relative z-10 w-full min-h-[60px]">

                        {/* Left Side: Pet Identity & Time */}
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                            {/* Identity */}
                            <div className="flex items-center gap-1 sm:gap-2">
                                {availablePets.length > 1 && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 hover:bg-muted" onClick={() => handleSwitchPet('prev')}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                )}
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                                        <PawPrint className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="font-black text-sm sm:text-base tracking-tight leading-none text-foreground whitespace-nowrap">{pet.name}</p>
                                        <p className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mt-0.5">Companion</p>
                                    </div>
                                </div>
                                {availablePets.length > 1 && (
                                    <Button variant="ghost" size="icon" className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 hover:bg-muted" onClick={() => handleSwitchPet('next')}>
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="hidden sm:block h-6 w-px bg-border/30 mx-1" />

                            {/* Time / Month */}
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <Calendar className="hidden sm:block w-4 h-4 text-primary/60" />
                                <div className="flex flex-col sm:flex-row sm:items-baseline gap-0 sm:gap-2">
                                    <span className="text-[9px] sm:text-xs font-black text-muted-foreground uppercase tracking-wider">Month</span>
                                    <span className="text-sm sm:text-base font-black text-foreground leading-none">{pet.monthData.currentMonth}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Finances & Action */}
                        <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-auto">
                            {/* Full Financial Stats (Hidden on narrow screens) */}
                            <div className="hidden md:flex items-center gap-3 pr-2 border-r border-border/30">
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-black text-emerald-500">${income}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                    <span className="text-xs font-black text-rose-500">${expenses}</span>
                                </div>
                                {netSavings !== 0 && (
                                    <span className={cn("text-[10px] font-black px-2 py-1 rounded-full", netSavings > 0 ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500')}>
                                        {netSavings > 0 ? `+$${netSavings}` : `-$${Math.abs(netSavings)}`}
                                    </span>
                                )}
                            </div>

                            <button 
                                onClick={() => setShowHelp(true)}
                                className="p-1 sm:p-2 rounded-lg sm:rounded-xl bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground transition-all shrink-0"
                                title="How to Play"
                            >
                                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            {/* Wallet */}
                            <div className="flex items-center gap-1.5 sm:gap-2 bg-primary/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl shrink-0">
                                <Wallet className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-primary" />
                                <span className="text-sm sm:text-base font-black text-primary">${pet.stats.money || 0}</span>
                            </div>

                            <div className="hidden sm:block h-6 w-px bg-border/30" />

                            {/* Next Turn Button */}
                            <Button
                                onClick={handleNextMonth}
                                size="sm"
                                className="rounded-lg sm:rounded-xl font-bold gap-1 sm:gap-1.5 px-3 sm:px-4 h-7 sm:h-9 text-[10px] sm:text-xs shadow-md shadow-primary/15 bg-linear-to-r from-coral-600 to-primary hover:from-coral-700 hover:to-primary/90 border-0 shrink-0"
                            >
                                Next <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Unified Content Area */}
                    <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
                        <AnimatePresence mode="wait">
                            {currentTab === 'pet' && (
                                <motion.div
                                    key="pet"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex flex-col h-full w-full"
                                >
                                    {/* Pet Display Area - Centered */}
                                    <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-0 py-2 sm:py-4">
                                        <div className="pet-zone-glow" aria-hidden />
                                        <div className="w-full max-w-[140px] sm:max-w-[180px] md:max-w-[220px] lg:max-w-[280px] relative z-1">
                                            <PetDisplay pet={pet} emotion={emotion} isGameOver={gameOver} />
                                        </div>

                                        {/* Feedback toast */}
                                        <AnimatePresence>
                                            {feedback.message && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                                    className={cn(
                                                        "feedback-toast text-[10px] sm:text-xs mt-3",
                                                        feedback.type === 'success' && 'feedback-success',
                                                        feedback.type === 'warn' && 'feedback-warn',
                                                        feedback.type === 'info' && 'feedback-info',
                                                    )}
                                                >
                                                    {feedback.message}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Controls Panel */}
                                    {showGameUI && (
                                        <div className="shrink-0 bg-card/95 backdrop-blur-xl border-t border-border/30">
                                            {/* Stats Bar */}
                                            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 py-1.5 sm:py-2 border-b border-border/10">
                                                <StatItem icon={Utensils} value={pet.stats.hunger} color="bg-orange-500" />
                                                <StatItem icon={Heart} value={pet.stats.happy} color="bg-emerald-500" />
                                                <StatItem icon={Zap} value={pet.stats.energy} color="bg-sky-400" />
                                                <StatItem icon={Coffee} value={pet.stats.health} color="bg-indigo-400" />
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 py-2 sm:py-2.5">
                                                <ActionButton action="feed" label="Feed" cost={5} icon={Utensils} color="text-orange-500" onClick={() => handleAction('feed')} />
                                                <ActionButton action="play" label="Play" cost={8} icon={Heart} color="text-emerald-500" onClick={() => handleAction('play')} />
                                                <ActionButton action="sleep" label="Sleep" cost={6} icon={Moon} color="text-indigo-500" onClick={() => handleAction('sleep')} />
                                                <ActionButton action="clean" label="Clean" cost={4} icon={Sparkles} color="text-cyan-500" onClick={() => handleAction('clean')} />
                                                <ActionButton action="healthCheck" label="Health" cost={25} icon={Stethoscope} color="text-rose-500" onClick={() => handleAction('healthCheck')} />
                                                <ActionButton action="train" label="Train" cost={12} icon={BrainCircuit} color="text-indigo-400" onClick={() => handleAction('train')} />
                                            </div>

                                            {/* Required Tasks (if any) */}
                                            {pet.monthData.requiredActions && pet.monthData.requiredActions.length > 0 && (
                                                <div className="flex items-center justify-center gap-2 px-3 pb-1.5 overflow-x-auto scrollbar-hide">
                                                    <span className="text-[10px] font-black text-muted-foreground shrink-0">Tasks:</span>
                                                    {pet.monthData.requiredActions.map((action) => {
                                                        const isCompleted = (pet.monthData.actionsCompleted[action] || 0) > 0;
                                                        return (
                                                            <span key={action} className={cn(
                                                                "text-[9px] sm:text-[10px] font-black px-2 py-1 rounded-full shrink-0",
                                                                isCompleted ? "bg-emerald-500/20 text-emerald-500" : "bg-amber-500/20 text-amber-500"
                                                            )}>
                                                                {action.charAt(0).toUpperCase() + action.slice(1)}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {currentTab === 'stats' && (
                                <motion.div
                                    key="stats"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-h-0 flex flex-col w-full max-w-4xl xl:max-w-5xl mx-auto items-center justify-center p-4 sm:p-6 lg:p-8"
                                >
                                    <div className="w-full h-full flex flex-col bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
                                        <StatsOverlay 
                                            isOpen={true} 
                                            onClose={() => { }} 
                                            pet={pet} 
                                            inline={true} 
                                            onUpdatePet={(updates) => setPet(prev => prev ? { ...prev, ...updates } : null)}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {currentTab === 'shop' && (
                                <motion.div
                                    key="shop"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-h-0 flex flex-col w-full max-w-4xl xl:max-w-5xl mx-auto items-center justify-center p-4 sm:p-6 lg:p-8"
                                >
                                    <div className="w-full h-full flex flex-col bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
                                        <ShopOverlay isOpen={true} onClose={() => { }} money={pet.stats.money || 0} onPurchase={handlePurchase} inline={true} />
                                    </div>
                                </motion.div>
                            )}

                            {currentTab === 'quiz' && (
                                <motion.div
                                    key="quiz"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-h-0 flex flex-col w-full max-w-4xl xl:max-w-5xl mx-auto items-center justify-center p-4 sm:p-6 lg:p-8"
                                >
                                    <div className="w-full h-full flex flex-col bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
                                        <QuizOverlay isOpen={true} onClose={() => { }} onComplete={handleQuizComplete} inline={true} />
                                    </div>
                                </motion.div>
                            )}

                            {currentTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex-1 min-h-0 flex flex-col w-full max-w-2xl xl:max-w-3xl mx-auto items-center justify-center p-4 sm:p-6 lg:p-8"
                                >
                                    <div className="w-full h-full flex flex-col bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
                                        <OptionsOverlay isOpen={true} onClose={() => { }} onLogout={handleLogout} inline={true} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Unified Tab Bar */}
                    <div className="mobile-tab-bar overflow-x-auto gap-3 sm:gap-4 lg:gap-5 py-2 sm:py-3 px-4 sm:px-6 lg:px-8 scrollbar-hide justify-center shrink-0">
                        {[
                            { id: 'shop', label: 'Shop', icon: Store },
                            { id: 'quiz', label: 'Quiz', icon: BrainCircuit },
                            { id: 'pet', label: 'Pet', icon: PawPrint },
                            { id: 'stats', label: 'Stats', icon: BarChart3 },
                            { id: 'settings', label: 'Settings', icon: Settings },
                        ].map((tab) => {
                            const colors = TAB_COLORS[tab.id as keyof typeof TAB_COLORS];
                            const Icon = tab.icon;
                            const isActive = currentTab === tab.id;
                            return (
                                <motion.button
                                    key={tab.id}
                                    onClick={() => setCurrentTab(tab.id as TabView)}
                                    whileHover={{ y: -2, scale: 1.02 }}
                                    whileTap={{ scale: 0.96 }}
                                    className={cn(
                                        "group relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl sm:rounded-2xl border-[1.5px] transition-all duration-200 shrink-0",
                                        isActive
                                            ? `${colors.activeBg} shadow-lg ${colors.glow}`
                                            : `${colors.bg} hover:border-white/10 text-transparent`
                                    )}
                                >
                                    <div className={cn(
                                        "flex sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-none sm:rounded-2xl items-center justify-center transition-all duration-200",
                                        isActive
                                            ? 'bg-transparent sm:bg-white/20 text-white'
                                            : `bg-transparent sm:bg-white/5 ${colors.text}`
                                    )}>
                                        <Icon className={cn(
                                            "w-5 h-5 sm:w-5 sm:h-5 transition-transform duration-200",
                                            isActive && "scale-110"
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] sm:text-xs lg:text-sm font-black uppercase tracking-widest transition-colors pr-1 hidden sm:block",
                                        isActive ? 'text-white' : 'text-foreground/70'
                                    )}>
                                        {tab.label}
                                    </span>
                                </motion.button>
                            );
                        })}
                    </div>

                </div>
            </div>{/* /game-window */}

            {/* ─── Game Over Modal ─────────────────────── */}
            <AnimatePresence>
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-card border-2 border-rose-500/50 rounded-[2rem] p-6 max-w-sm mx-4 text-center shadow-2xl shadow-rose-500/20"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 flex items-center justify-center">
                                <span className="text-4xl">💀</span>
                            </div>
                            <h2 className="text-2xl font-black text-rose-500 mb-2">GAME OVER</h2>
                            <p className="text-sm text-muted-foreground mb-4">
                                Your pet has passed away after {pet.monthData.currentMonth} months together.
                            </p>
                            <div className="bg-muted/50 rounded-xl p-3 mb-4">
                                <p className="text-xs text-muted-foreground">Final Statistics</p>
                                <div className="grid grid-cols-2 gap-3 mt-2 text-xs">
                                    <div>
                                        <span className="text-muted-foreground">Months:</span>
                                        <p className="font-black">{pet.monthData.currentMonth}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Saved:</span>
                                        <p className="font-black text-emerald-500">${pet.stats.money || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleGameOver}
                                className="w-full py-4 text-base font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                            >
                                Return to Pet Selection
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setShowHelp(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-card w-full max-w-lg rounded-[2.5rem] p-8 sm:p-10 border border-white/20 shadow-2xl relative"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-black flex items-center gap-3">
                                    <HelpCircle className="w-6 h-6 text-primary" />
                                    How to Play PetPal
                                </h2>
                                <button onClick={() => setShowHelp(false)} className="p-2 rounded-full hover:bg-muted transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6 overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
                                <div className="space-y-4">
                                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                                        <h3 className="font-bold text-primary mb-1 italic">The Golden Rule</h3>
                                        <p className="text-sm text-primary/80">Every action has a cost. Balance your pet&apos;s happiness with your personal savings goal to succeed.</p>
                                    </div>
                                    
                                    <section>
                                        <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3 px-1">Core Concepts</h4>
                                        <div className="grid gap-3">
                                            <div className="flex gap-4 p-3 rounded-xl bg-muted/30">
                                                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                                                    <BrainCircuit className="w-4 h-4 text-orange-500" />
                                                </div>
                                                <p className="text-xs leading-relaxed"><span className="font-bold">Budgeting:</span> Watch the progress bar in stats. Exceeding your limit hurts your financial health score!</p>
                                            </div>
                                            <div className="flex gap-4 p-3 rounded-xl bg-muted/30">
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                                    <Stethoscope className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <p className="text-xs leading-relaxed"><span className="font-bold">Emergencies:</span> Vet visits are random and expensive. Always keep an &quot;Emergency Fund&quot; in your balance.</p>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-3 px-1">Pro Tips</h4>
                                        <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                                            <li>Training your pet enough will unlock new tricks and traits.</li>
                                            <li>Complete the monthly quiz for extra cash.</li>
                                            <li>Don&apos;t let health hit 0, or your pet will have to go to a spa... forever!</li>
                                        </ul>
                                    </section>
                                </div>
                            </div>

                            <Button 
                                onClick={() => setShowHelp(false)} 
                                className="w-full mt-8 rounded-2xl font-black py-6 h-auto"
                            >
                                Got it, Boss!
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {monthlySummary && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[101] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-card w-full max-w-sm rounded-[2.5rem] p-8 border border-white/20 shadow-2xl text-center"
                        >
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-2xl font-black mb-1">Month {monthlySummary.month} Complete!</h2>
                            <p className="text-muted-foreground text-sm mb-6">Here is your financial and growth summary.</p>

                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                                    <span className="text-xs font-bold text-emerald-600">Net Savings</span>
                                    <span className="font-black text-emerald-600">+${monthlySummary.income - monthlySummary.expenses}</span>
                                </div>
                                {monthlySummary.emergency > 0 && (
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-orange-500/5 border border-orange-500/10 text-left">
                                        <div className="flex items-center gap-2">
                                            <Stethoscope className="w-3.5 h-3.5 text-orange-500" />
                                            <span className="text-xs font-bold text-orange-600 uppercase">Emergency Vet Trip</span>
                                        </div>
                                        <span className="font-black text-orange-600">-${monthlySummary.emergency}</span>
                                    </div>
                                )}
                                {monthlySummary.trick && (
                                    <div className="flex justify-between items-center p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 text-left">
                                        <div>
                                            <p className="text-[10px] uppercase font-black text-purple-600 tracking-widest leading-none mb-1">New Skill Learned!</p>
                                            <p className="font-black text-purple-700">{monthlySummary.trick}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <BrainCircuit className="w-4 h-4 text-purple-600" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Button 
                                onClick={() => setMonthlySummary(null)}
                                className="w-full rounded-2xl font-black py-4 h-auto shadow-lg shadow-primary/20"
                            >
                                Start Month {monthlySummary.month + 1}
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
