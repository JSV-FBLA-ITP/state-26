'use client';

import { useState, useEffect, useCallback } from 'react';
import { ActionType, getEmotionData, PetData } from '@/lib/gameLogic';
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
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '@/components/dashboard/DashboardUserMenu';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
    const [pet, setPet] = useState<PetData | null>(null);
    const [loading, setLoading] = useState(true);
    const [shopOpen, setShopOpen] = useState(false);
    const [quizOpen, setQuizOpen] = useState(false);
    const [statsOpen, setStatsOpen] = useState(false);
    const [optionsOpen, setOptionsOpen] = useState(false);
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

        const newPet = { ...pet };
        // Determine which stat to boost based on action type
        const statMap: Record<ActionType, keyof typeof newPet.stats> = {
            feed: 'hunger',
            play: 'happy',
            sleep: 'energy',
            clean: 'health',
            healthCheck: 'health'
        };

        const targetStat = statMap[type];
        newPet.stats[targetStat] = Math.min(100, newPet.stats[targetStat] + 10);
        newPet.interactionCount += 1;

        setPet({ ...newPet });
        setFeedback({ message: `Your pet feels better after: ${type}!`, type: 'success' });
        setTimeout(() => setFeedback({ message: '', type: null }), 3000);
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

    if (loading) return null;
    if (!pet) return <div>Pet not found.</div>;

    const emotion = getEmotionData(pet.stats);

    return (
        <div className="flex flex-col lg:flex-row min-h-screen lg:h-screen lg:max-h-screen overflow-y-auto lg:overflow-hidden bg-background">
            {/* Left Column: Visuals */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-8 lg:p-12 bg-linear-to-br from-primary/5 to-transparent shrink-0">
                {/* Dashboard Header Icons */}
                <div className="absolute top-8 right-8 flex items-center gap-4 z-40">
                    <Button
                        variant="secondary"
                        className="rounded-2xl font-bold border-2 bg-card/50 backdrop-blur-xl hover:bg-primary/20 hover:border-primary/50"
                        onClick={handleManualSave}
                    >
                        <Save className="w-5 h-5 mr-2" />
                        Save Progress
                    </Button>
                    <ThemeToggle />
                    <UserMenu />
                </div>

                <PetDisplay pet={pet} emotion={emotion} />

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

                <ActionGrid onAction={handleAction} />
            </div>

            {/* Right Sidebar: Stats & Management */}
            <div className="w-full lg:w-[30%] lg:min-w-[340px] lg:max-w-[480px] bg-card/30 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-border/50 flex flex-col shrink-0 lg:shrink">
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar min-h-[400px] lg:min-h-0">
                    <StatSidebar stats={pet.stats} monthData={pet.monthData} />
                </div>

                <div className="p-4 pb-12 lg:pb-4 border-t border-border/50 bg-background/50 sticky bottom-0 z-50">
                    <ControlPanel
                        onShopOpen={() => setShopOpen(true)}
                        onQuizOpen={() => setQuizOpen(true)}
                        onStatsOpen={() => setStatsOpen(true)}
                        onOptionsOpen={() => setOptionsOpen(true)}
                    />
                </div>
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

        </div>
    );
}
