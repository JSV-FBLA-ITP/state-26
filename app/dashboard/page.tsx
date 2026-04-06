/* eslint-disable @typescript-eslint/no-require-imports */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { ActionType, getEmotionData, PetData, areRequiredActionsCompleted, ACTION_COSTS } from '@/lib/gameLogic';
import { loadPet, savePetToCloud } from '@/lib/storage';
import { PetDisplay } from '@/components/dashboard/PetDisplay';
import { StatSidebar } from '@/components/dashboard/StatSidebar';
import { ActionGrid } from '@/components/dashboard/ActionGrid';
import { ControlPanel } from '@/components/dashboard/ControlPanel';
import { ShopOverlay } from '@/components/game/ShopOverlay';
import { QuizOverlay } from '@/components/game/QuizOverlay';
import { StatsOverlay } from '@/components/game/StatsOverlay';
import { OptionsOverlay } from '@/components/game/OptionsOverlay';
import { createClient } from '@/utils/supabase/client';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BarChart3, PawPrint, Calendar, ArrowRight, Wallet, TrendingUp, TrendingDown, Store, BrainCircuit, Settings } from 'lucide-react';
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
    const [loading, setLoading] = useState(true);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warn' | 'info' | null }>({ message: '', type: null });
    const [currentTab, setCurrentTab] = useState<TabView>('pet');

    const loadData = useCallback(async () => {
        let petId = localStorage.getItem('currentPetId');

        if (!petId) {
            const { data: cloudPets } = await (await import('@/lib/storage')).fetchUserPets();
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

    // Manual save removed, auto-save handles data persistence.

    useEffect(() => {
        if (!pet) return;
        const timeout = setTimeout(() => {
            savePetToCloud(pet);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [pet]);

    const handleAction = (type: ActionType) => {
        if (!pet) return;

        const cost = ACTION_COSTS[type];
        if ((pet.stats.money || 0) < cost) {
            setFeedback({ message: `Not enough money! Need $${cost}`, type: 'warn' });
            setTimeout(() => setFeedback({ message: '', type: null }), 3000);
            return;
        }

        const newPet = { ...pet };
        const statMap: Record<ActionType, keyof typeof newPet.stats> = {
            feed: 'hunger',
            play: 'happy',
            sleep: 'energy',
            clean: 'health',
            healthCheck: 'health'
        };

        const targetStat = statMap[type];

        const { getDiminishedBoost, recordClickForStat } = require('@/lib/gameLogic');
        recordClickForStat(targetStat);
        const boost = getDiminishedBoost(targetStat, 15, newPet.stats[targetStat]);

        newPet.stats[targetStat] = Math.min(100, newPet.stats[targetStat] + boost);
        newPet.stats.money = (newPet.stats.money || 0) - cost;
        newPet.totalExpenses += cost;
        newPet.interactionCount += 1;

        newPet.monthData.actionsCompleted[type] = (newPet.monthData.actionsCompleted[type] || 0) + 1;

        setPet({ ...newPet });

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

        const { processNextMonth } = require('@/lib/gameLogic');
        const nextPet = processNextMonth(pet);

        if (nextPet.stats.health <= 0) {
            setPet(nextPet);
            setGameOver(true);
            return;
        }

        setPet(nextPet);
        setFeedback({ message: `Welcome to Month ${nextPet.monthData.currentMonth}!`, type: 'success' });
        setTimeout(() => setFeedback({ message: '', type: null }), 3000);
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
                            <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                                    <PawPrint className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-black text-sm sm:text-base tracking-tight leading-none text-foreground">{pet.name}</p>
                                    <p className="hidden sm:block text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mt-0.5">Companion</p>
                                </div>
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
                                    className="flex-1 min-h-0 flex flex-col lg:flex-row w-full max-w-5xl mx-auto"
                                >
                                    {/* Pet hero area */}
                                    <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden p-3 lg:p-8">
                                        <div className="pet-zone-glow" aria-hidden />
                                        <div className="w-full max-w-[200px] lg:max-w-[400px] relative z-1">
                                            <PetDisplay pet={pet} emotion={emotion} isGameOver={gameOver} />
                                        </div>

                                        {/* Feedback toast */}
                                        <div className="feedback-area">
                                            <AnimatePresence>
                                                {feedback.message && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        className={cn(
                                                            "feedback-toast text-[10px] lg:text-sm",
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
                                    </div>

                                    {/* Command zone */}
                                    {showGameUI && (
                                        <div className="game-command-zone lg:w-[400px] shrink-0 border-t lg:border-t-0 lg:border-l border-border/10 bg-card/50 backdrop-blur-sm lg:p-6 lg:overflow-y-auto">
                                            <StatSidebar
                                                stats={pet.stats}
                                                monthData={pet.monthData}
                                                income={income}
                                                expenses={expenses}
                                                onNextMonth={handleNextMonth}
                                                onAction={handleAction}
                                            />
                                            <ActionGrid onAction={handleAction} />
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
                                    className="flex-1 min-h-0 flex flex-col w-full max-w-4xl mx-auto items-center justify-center p-4 lg:p-8"
                                >
                                    <div className="w-full h-full flex flex-col bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
                                        <StatsOverlay isOpen={true} onClose={() => { }} pet={pet} inline={true} />
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
                                    className="flex-1 min-h-0 flex flex-col w-full max-w-4xl mx-auto items-center justify-center p-4 lg:p-8"
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
                                    className="flex-1 min-h-0 flex flex-col w-full max-w-4xl mx-auto items-center justify-center p-4 lg:p-8"
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
                                    className="flex-1 min-h-0 flex flex-col w-full max-w-2xl mx-auto items-center justify-center p-4 lg:p-8"
                                >
                                    <div className="w-full h-full flex flex-col bg-card/60 backdrop-blur-xl border border-border/40 rounded-3xl overflow-hidden shadow-2xl">
                                        <OptionsOverlay isOpen={true} onClose={() => { }} onLogout={handleLogout} inline={true} />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Unified Tab Bar */}
                    <div className="mobile-tab-bar overflow-x-auto gap-3 pt-4 pb-2 px-4 safe-area-bottom scrollbar-hide justify-center shrink-0">
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
                                        "group relative flex items-center gap-2 px-3 py-2 rounded-2xl border-[1.5px] transition-all duration-200 shrink-0",
                                        isActive
                                            ? `${colors.activeBg} shadow-lg ${colors.glow}`
                                            : `${colors.bg} hover:border-white/10 text-transparent`
                                    )}
                                >
                                    <div className={cn(
                                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200",
                                        isActive
                                            ? 'bg-white/20 text-white'
                                            : `bg-white/5 ${colors.text}`
                                    )}>
                                        <Icon className={cn(
                                            "w-4 h-4 transition-transform duration-200",
                                            isActive && "scale-110"
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] sm:block hidden font-black uppercase tracking-widest transition-colors pr-1",
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
        </div>
    );
}
