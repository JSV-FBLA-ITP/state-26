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
import { BarChart3, PawPrint, Calendar, ArrowRight, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type MobileTab = 'pet' | 'stats';

export default function DashboardPage() {
    const [pet, setPet] = useState<PetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [shopOpen, setShopOpen] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);
    const [statsOpen, setStatsOpen] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warn' | 'info' | null }>({ message: '', type: null });
    const [mobileTab, setMobileTab] = useState<MobileTab>('pet');

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

    const handleManualSave = async () => {
        if (!pet) return;
        const { error } = await savePetToCloud(pet);
        if (!error) {
            setFeedback({ message: 'Pet saved to account!', type: 'success' });
            setTimeout(() => setFeedback({ message: '', type: null }), 3000);
            loadData();
        } else {
            setFeedback({ message: 'Failed to save to cloud.', type: 'warn' });
        }
    };

    useEffect(() => {
        if (!pet) return;
        const timeout = setTimeout(() => {
            savePetToCloud(pet);
        }, 5000);
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

                {/* ── DESKTOP LAYOUT ─────────────────────────── */}
                <div className="hidden lg:flex flex-col h-full">

                    {/* Top info bar: Pet name | Month | Wallet | Next Month */}
                    <div className="game-topbar">
                        <div className="game-topbar-section">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                                    <PawPrint className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-black text-base tracking-tight leading-none">{pet.name}</p>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mt-0.5">Companion</p>
                                </div>
                            </div>

                            <div className="h-6 w-px bg-border/30" />

                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary/60" />
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">Month</span>
                                <span className="text-base font-black">{pet.monthData.currentMonth}</span>
                            </div>
                        </div>

                        <div className="game-topbar-section">
                            {/* Budget indicators */}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-xs font-black text-emerald-500">${income}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                                    <span className="text-xs font-black text-rose-500">${expenses}</span>
                                </div>
                                {netSavings !== 0 && (
                                    <span className={cn(
                                        "text-[10px] font-black px-2 py-1 rounded-full",
                                        netSavings > 0
                                            ? 'bg-emerald-500/15 text-emerald-500'
                                            : 'bg-rose-500/15 text-rose-500'
                                    )}>
                                        {netSavings > 0 ? `+$${netSavings}` : `-$${Math.abs(netSavings)}`}
                                    </span>
                                )}
                            </div>

                            <div className="h-6 w-px bg-border/30" />

                            {/* Wallet */}
                            <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-xl">
                                <Wallet className="w-5 h-5 text-primary" />
                                <span className="text-base font-black text-primary">${pet.stats.money || 0}</span>
                            </div>

                            <div className="h-6 w-px bg-border/30" />

                            {/* Next Month button */}
                            <Button
                                onClick={handleNextMonth}
                                size="sm"
                                className="rounded-xl font-bold gap-1.5 px-4 h-9 text-xs shadow-md shadow-primary/15 bg-linear-to-r from-coral-600 to-primary hover:from-coral-700 hover:to-primary/90 border-0"
                            >
                                Next <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Hero zone — the pet takes center stage */}
                    <div className="game-hero-zone">
                        <div className="pet-zone-glow" aria-hidden />

                        <div className="pet-display-wrap">
                            <PetDisplay pet={pet} emotion={emotion} isGameOver={gameOver} />
                        </div>

                        {/* Floating Side Controls */}
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
                            <ControlPanel
                                side="left"
                                onShopOpen={() => setShopOpen(true)}
                                onQuizOpen={() => setQuizOpen(true)}
                                onStatsOpen={() => setStatsOpen(true)}
                                onOptionsOpen={() => setOptionsOpen(true)}
                            />
                        </div>

                        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
                            <ControlPanel
                                side="right"
                                onShopOpen={() => setShopOpen(true)}
                                onQuizOpen={() => setQuizOpen(true)}
                                onStatsOpen={() => setStatsOpen(true)}
                                onOptionsOpen={() => setOptionsOpen(true)}
                            />
                        </div>

                        {/* Smaller Screens / Tablet: Move to edges but keep layout */}
                        <div className="absolute bottom-6 left-6 z-10 xl:hidden">
                            <ControlPanel
                                side="left"
                                onShopOpen={() => setShopOpen(true)}
                                onQuizOpen={() => setQuizOpen(true)}
                                onStatsOpen={() => setStatsOpen(true)}
                                onOptionsOpen={() => setOptionsOpen(true)}
                            />
                        </div>
                        <div className="absolute bottom-6 right-6 z-10 xl:hidden">
                            <ControlPanel
                                side="right"
                                onShopOpen={() => setShopOpen(true)}
                                onQuizOpen={() => setQuizOpen(true)}
                                onStatsOpen={() => setStatsOpen(true)}
                                onOptionsOpen={() => setOptionsOpen(true)}
                            />
                        </div>

                        {/* Feedback toast floating over hero */}
                        <div className="feedback-area">
                            <AnimatePresence>
                                {feedback.message && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                                        className={cn(
                                            "feedback-toast",
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

                    {/* Command zone — stats, actions, controls */}
                    {showGameUI && (
                        <div className="game-command-zone">
                            {/* Stat strip + required actions */}
                            <StatSidebar
                                stats={pet.stats}
                                monthData={pet.monthData}
                                income={income}
                                expenses={expenses}
                                onNextMonth={handleNextMonth}
                                onAction={handleAction}
                            />

                            {/* Action buttons */}
                            <ActionGrid onAction={handleAction} />
                        </div>
                    )}
                </div>

                {/* ── MOBILE LAYOUT ─────────────────────────── */}
                <div className="flex lg:hidden h-full flex-col">

                    {/* Mobile top info bar */}
                    <div className="game-topbar">
                        <div className="game-topbar-section">
                            <div className="flex items-center gap-1.5">
                                <PawPrint className="w-3 h-3 text-primary" />
                                <span className="text-xs font-black">{pet.name}</span>
                            </div>
                            <span className="text-[9px] font-bold text-muted-foreground">M{pet.monthData.currentMonth}</span>
                        </div>
                        <div className="game-topbar-section">
                            <div className="flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-md">
                                <Wallet className="w-3 h-3 text-primary" />
                                <span className="text-xs font-black text-primary">${pet.stats.money || 0}</span>
                            </div>
                            <Button
                                onClick={handleNextMonth}
                                size="sm"
                                className="rounded-md font-bold gap-1 px-2 h-6 text-[9px] bg-primary border-0"
                            >
                                Next <ArrowRight className="w-2.5 h-2.5" />
                            </Button>
                        </div>
                    </div>

                    {/* Mobile tab bar */}
                    <div className="mobile-tab-bar">
                        <button
                            onClick={() => setMobileTab('pet')}
                            className={cn("mobile-tab", mobileTab === 'pet' && 'mobile-tab-active')}
                        >
                            <PawPrint className="w-3.5 h-3.5" />
                            Pet
                        </button>
                        <button
                            onClick={() => setMobileTab('stats')}
                            className={cn("mobile-tab", mobileTab === 'stats' && 'mobile-tab-active')}
                        >
                            <BarChart3 className="w-3.5 h-3.5" />
                            Stats
                        </button>
                    </div>

                    {/* Mobile content */}
                    <AnimatePresence mode="wait">
                        {mobileTab === 'pet' && (
                            <motion.div
                                key="pet"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="flex-1 min-h-0 flex flex-col"
                            >
                                {/* Pet hero area */}
                                <div className="flex-1 min-h-0 flex items-center justify-center relative overflow-hidden p-3">
                                    <div className="pet-zone-glow" aria-hidden />
                                    <div className="w-full max-w-[180px] relative z-1">
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
                                                        "feedback-toast text-[10px]",
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

                                {/* Mobile command zone */}
                                {showGameUI && (
                                    <div className="game-command-zone">
                                        <StatSidebar
                                            stats={pet.stats}
                                            monthData={pet.monthData}
                                            income={income}
                                            expenses={expenses}
                                            onNextMonth={handleNextMonth}
                                            onAction={handleAction}
                                        />
                                        <ActionGrid onAction={handleAction} />
                                        <div className="flex justify-between px-2 pb-2">
                                            <ControlPanel
                                                side="left"
                                                onShopOpen={() => setShopOpen(true)}
                                                onQuizOpen={() => setQuizOpen(true)}
                                                onStatsOpen={() => setStatsOpen(true)}
                                                onOptionsOpen={() => setOptionsOpen(true)}
                                            />
                                            <ControlPanel
                                                side="right"
                                                onShopOpen={() => setShopOpen(true)}
                                                onQuizOpen={() => setQuizOpen(true)}
                                                onStatsOpen={() => setStatsOpen(true)}
                                                onOptionsOpen={() => setOptionsOpen(true)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {mobileTab === 'stats' && (
                            <motion.div
                                key="stats"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                                className="flex-1 min-h-0 flex flex-col"
                            >
                                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-4 space-y-4">
                                    {/* Wallet card */}
                                    <div className="bg-linear-to-br from-coral-500 to-coral-600 rounded-2xl p-4 text-white shadow-xl shadow-coral-500/20 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl" />
                                        <div className="relative z-10 flex flex-col items-center">
                                            <p className="text-[8px] font-black uppercase tracking-[0.25em] opacity-70 mb-1">Liquidity</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-base font-bold opacity-80">$</span>
                                                <h2 className="text-3xl font-black tracking-tighter">{pet.stats.money || 0}</h2>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Budget */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-sage-500/5 border border-sage-500/10 p-3 rounded-xl">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <TrendingUp className="w-2.5 h-2.5 text-sage-500" />
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase">Income</span>
                                            </div>
                                            <p className="font-black text-sage-500 text-sm">${income}</p>
                                        </div>
                                        <div className="bg-coral-600/5 border border-coral-600/10 p-3 rounded-xl">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <TrendingDown className="w-2.5 h-2.5 text-coral-600" />
                                                <span className="text-[8px] font-bold text-muted-foreground uppercase">Expenses</span>
                                            </div>
                                            <p className="font-black text-coral-600 text-sm">${expenses}</p>
                                        </div>
                                    </div>

                                    {/* Detailed stats */}
                                    <div className="space-y-2">
                                        <h3 className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground">Vital Signs</h3>
                                        {[
                                            { label: 'Hunger', value: pet.stats.hunger, color: 'bg-coral-400', icon: '🍖' },
                                            { label: 'Happy', value: pet.stats.happy, color: 'bg-sage-400', icon: '💚' },
                                            { label: 'Energy', value: pet.stats.energy, color: 'bg-coral-500', icon: '⚡' },
                                            { label: 'Health', value: pet.stats.health, color: 'bg-sage-500', icon: '💊' },
                                        ].map(s => (
                                            <div key={s.label} className="flex items-center gap-2">
                                                <span className="text-sm">{s.icon}</span>
                                                <span className="text-[10px] font-bold w-12 text-muted-foreground">{s.label}</span>
                                                <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${s.value}%` }}
                                                        className={cn("h-full rounded-full", s.color)}
                                                    />
                                                </div>
                                                <span className={cn(
                                                    "text-[10px] font-black w-8 text-right tabular-nums",
                                                    s.value < 30 ? 'text-rose-500' : 'text-muted-foreground'
                                                )}>
                                                    {Math.round(s.value)}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {showGameUI && (
                                    <div className="game-command-zone">
                                <div className="flex justify-between px-2 pb-2">
                                            <ControlPanel
                                                side="left"
                                                onShopOpen={() => setShopOpen(true)}
                                                onQuizOpen={() => setQuizOpen(true)}
                                                onStatsOpen={() => setStatsOpen(true)}
                                                onOptionsOpen={() => setOptionsOpen(true)}
                                            />
                                            <ControlPanel
                                                side="right"
                                                onShopOpen={() => setShopOpen(true)}
                                                onQuizOpen={() => setQuizOpen(true)}
                                                onStatsOpen={() => setStatsOpen(true)}
                                                onOptionsOpen={() => setOptionsOpen(true)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

            </div>{/* /game-window */}

            {/* ─── Overlays ─────────────────────── */}
            <ShopOverlay
                isOpen={shopOpen}
                onClose={() => setShopOpen(false)}
                money={pet.stats.money || 0}
                onPurchase={handlePurchase}
            />

            <QuizOverlay
                isOpen={quizOpen}
                onClose={() => setQuizOpen(false)}
                onComplete={handleQuizComplete}
            />

            <StatsOverlay
                isOpen={statsOpen}
                onClose={() => setStatsOpen(false)}
                pet={pet}
            />

            <OptionsOverlay
                isOpen={optionsOpen}
                onClose={() => setOptionsOpen(false)}
                onSave={handleManualSave}
                onLogout={handleLogout}
            />

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
