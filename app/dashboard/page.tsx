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

export default function DashboardPage() {
    const [pet, setPet] = useState<PetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [shopOpen, setShopOpen] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);
    const [statsOpen, setStatsOpen] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'warn' | 'info' | null }>({ message: '', type: null });

    const loadData = useCallback(async () => {
        let petId = localStorage.getItem('currentPetId');

        if (!petId) {
            // Check if user has pets in cloud before redirecting
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

            // Auto-migrate guest pet to cloud if user just logged in
            if (petId!.startsWith('guest_')) {
                await savePetToCloud(data);
            }

            // Check if pet is already dead on load
            if (data.stats.health <= 0) {
                setGameOver(true);
            }
        } else {
            console.error('Error loading pet:', error);
            // If local pet not found, clear and onboarding
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
            loadData(); // Reload to update ID states
        } else {
            setFeedback({ message: 'Failed to save to cloud.', type: 'warn' });
        }
    };

    // Auto-save logic
    useEffect(() => {
        if (!pet) return;
        const timeout = setTimeout(() => {
            savePetToCloud(pet);
        }, 5000); // Save every 5 seconds of inactivity
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

        // Use logic from gameLogic for consistency
        const { getDiminishedBoost, recordClickForStat } = require('@/lib/gameLogic');
        recordClickForStat(targetStat);
        const boost = getDiminishedBoost(targetStat, 15, newPet.stats[targetStat]);

        newPet.stats[targetStat] = Math.min(100, newPet.stats[targetStat] + boost);
        newPet.stats.money = (newPet.stats.money || 0) - cost;
        newPet.totalExpenses += cost;
        newPet.interactionCount += 1;

        // Record action completion for the month
        newPet.monthData.actionsCompleted[type] = (newPet.monthData.actionsCompleted[type] || 0) + 1;

        setPet({ ...newPet });

        // Check for game over
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

        // Check for game over after monthly decay
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

    // Hide main game UI when game over
    const showGameUI = !gameOver;

    return (
        <div className={`flex flex-col lg:flex-row min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden bg-background ${gameOver ? 'pointer-events-none' : ''}`}>
            {/* Left Column: Visuals */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-8 lg:p-12 bg-linear-to-br from-primary/5 to-transparent shrink-0">
                <PetDisplay pet={pet} emotion={emotion} isGameOver={gameOver} />

                <div className="h-6 mt-4 mb-2 flex items-center justify-center">
                    <AnimatePresence>
                        {feedback.message && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`px-4 py-1.5 rounded-full text-xs font-black shadow-lg border z-50 ${feedback.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400' :
                                    feedback.type === 'warn' ? 'bg-rose-500 text-white border-rose-400' :
                                        'bg-primary text-white border-primary-foreground/20'
                                    }`}
                            >
                                {feedback.message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {showGameUI && <ActionGrid onAction={handleAction} />}
            </div>

            {/* Right Sidebar: Stats & Management */}
            <div className="w-full lg:w-[30%] lg:min-w-[340px] lg:max-w-[480px] bg-card/30 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-border/50 flex flex-col shrink-0 lg:shrink">
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar min-h-[400px] lg:min-h-0">
                    <StatSidebar
                        stats={pet.stats}
                        monthData={pet.monthData}
                        income={pet.monthlyIncome}
                        expenses={pet.monthlyExpenses}
                        onNextMonth={handleNextMonth}
                        onAction={handleAction}
                    />
                </div>

                {showGameUI && (
                    <div className="p-4 pb-12 lg:pb-4 border-t border-border/50 bg-background/50 sticky bottom-0 z-50">
                        <ControlPanel
                            onShopOpen={() => setShopOpen(true)}
                            onQuizOpen={() => setQuizOpen(true)}
                            onStatsOpen={() => setStatsOpen(true)}
                            onOptionsOpen={() => setOptionsOpen(true)}
                        />
                    </div>
                )}
            </div>

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

            {/* Game Over Overlay */}
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
                            className="bg-card border-2 border-rose-500/50 rounded-[2rem] p-8 max-w-md mx-4 text-center shadow-2xl shadow-rose-500/20"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/20 flex items-center justify-center">
                                <span className="text-5xl">💀</span>
                            </div>
                            <h2 className="text-3xl font-black text-rose-500 mb-2">GAME OVER</h2>
                            <p className="text-muted-foreground mb-6">
                                Your pet&apos;s health reached 0. Your pet has passed away after {pet.monthData.currentMonth} months together.
                            </p>
                            <div className="bg-muted/50 rounded-xl p-4 mb-6">
                                <p className="text-sm text-muted-foreground">Final Statistics</p>
                                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Months Survived:</span>
                                        <p className="font-black">{pet.monthData.currentMonth}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Money Saved:</span>
                                        <p className="font-black text-emerald-500">${pet.stats.money || 0}</p>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={handleGameOver}
                                className="w-full py-6 text-lg font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
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
