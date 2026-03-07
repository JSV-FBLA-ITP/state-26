'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { PetTypeSelector, PET_TYPES } from '@/components/onboarding/PetTypeSelector';
import { PetCustomizer } from '@/components/onboarding/PetCustomizer';
import { PetNaming } from '@/components/onboarding/PetNaming';
import { UserOnboarding } from '@/components/onboarding/UserOnboarding';
import { randomizeInitialStats, PetData } from '@/lib/gameLogic';
import { savePetToCloud } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Sparkles, PawPrint, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

const STEPS = ['Choose Pet', 'Give Name', 'Create Home', 'Style'];

function OnboardingInner() {
    const [step, setStep] = useState(0); // 0-indexed
    const [householdName, setHouseholdName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState<number | undefined>();
    const [monthlyExpenses, setMonthlyExpenses] = useState<number | undefined>();
    const [petType, setPetType] = useState('');
    const [petImage, setPetImage] = useState('');
    const [petName, setPetName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinishing, setIsFinishing] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedHousehold = searchParams.get('household') || undefined;

    const handleNext = () => {
        if (step < STEPS.length - 1) {
            setStep(s => s + 1);
        } else {
            handleFinalize();
        }
    };

    const handleBack = () => setStep((s) => Math.max(0, s - 1));

    const handleFinalize = async (isGuest = false) => {
        setIsSubmitting(true);
        const { data: { user } } = await (await import('@/utils/supabase/client')).createClient().auth.getUser();

        if (!user && !isGuest) {
            setShowLoginPrompt(true);
            setIsSubmitting(false);
            return;
        }

        const surplus = (monthlyIncome || 0) - (monthlyExpenses || 0);
        const startingMoney = (monthlyIncome && monthlyExpenses && surplus > 0) ? Math.max(100, Math.round(surplus * 0.2)) : 500;
        const finalPetImage = petImage || PET_TYPES.find(p => p.id === petType)?.icon || '';

        const newPet: PetData = {
            type: petType,
            name: petName,
            ownerName: ownerName || householdName,
            householdName,
            petImage: finalPetImage,
            stats: { ...randomizeInitialStats(), money: startingMoney },
            learnedTricks: [],
            totalExpenses: 0,
            savingsGoal: 500,
            savingsCurrent: 0,
            lastInteraction: Date.now(),
            interactionCount: 0,
            shop_multipliers: { hunger: 1.0, happy: 1.0, energy: 1.0, health: 1.0 },
            shop_upgrades: { hunger: 0, happy: 0, energy: 0, health: 0 },
            monthData: { currentMonth: 1, requiredActions: [], actionsCompleted: {} },
            monthlyIncome,
            monthlyExpenses,
        };

        try {
            if (user && !isGuest) {
                const { data, error } = await savePetToCloud(newPet);
                if (error) throw error;
                if (data) localStorage.setItem('currentPetId', data.id);
            } else {
                const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('currentPetId', guestId);
                localStorage.setItem(`pet_${guestId}`, JSON.stringify(newPet));
            }

            // Celebration sequence
            setIsFinishing(true);
            await new Promise(resolve => setTimeout(resolve, 3000));
            router.push('/dashboard');
        } catch (err) {
            console.error('Error saving pet:', err);
            alert('Something went wrong saving your pet. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const canAdvance = () => {
        if (step === 0) return !!petType;
        if (step === 1) return petName.trim().length >= 2;
        if (step === 2) return householdName.trim().length >= 2;
        if (step === 3) return true;
        return false;
    };

    if (isFinishing) {
        return (
            <div className="fixed inset-0 z-50 bg-background flex items-center justify-center overflow-hidden">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative text-center space-y-8 p-8 max-w-lg">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />

                    <motion.div
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', damping: 12, stiffness: 100, delay: 0.2 }}
                        className="w-32 h-32 bg-primary rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-primary/40 relative"
                    >
                        <Sparkles className="w-16 h-16 text-primary-foreground" />
                    </motion.div>

                    <div className="space-y-4">
                        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-5xl md:text-6xl font-black tracking-tight">
                            It&apos;s Official!
                        </motion.h2>
                        <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="text-xl md:text-2xl text-muted-foreground font-medium">
                            Welcome home, <span className="text-primary font-black uppercase tracking-wide">{petName}</span>.
                        </motion.p>
                    </div>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="flex flex-col items-center gap-4 pt-8">
                        <div className="flex items-center gap-3 text-primary font-bold">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Moving into the dashboard...</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-background via-background/95 to-muted/30 flex flex-col items-center py-12 px-4 relative overflow-x-hidden">
            {/* Ambient background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="w-full max-w-4xl mx-auto space-y-12 relative z-10">
                {/* Header & Steps */}
                <div className="flex flex-col items-center text-center space-y-8">
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 bg-card/50 backdrop-blur-md px-6 py-3 rounded-full border border-border/50 shadow-sm">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <PawPrint className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-black tracking-widest uppercase text-xs">Pet Onboarding</span>
                    </motion.div>

                    <div className="relative w-full max-w-2xl px-4">
                        <div className="absolute inset-0 flex items-center px-4" aria-hidden="true">
                            <div className="w-full h-2 bg-muted/30 rounded-full relative z-0 overflow-hidden">
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
                                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                                />
                            </div>
                        </div>

                        <div className="relative flex justify-between">
                            {STEPS.map((s, i) => (
                                <div key={s} className="flex flex-col items-center">
                                    <motion.button
                                        onClick={() => i < step && setStep(i)}
                                        className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all relative z-10 ${i <= step
                                            ? 'bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/25'
                                            : 'bg-card border-border text-muted-foreground'
                                            }`}
                                        animate={{ scale: i === step ? 1.15 : 1, y: i === step ? -4 : 0 }}
                                        whileHover={{ scale: i <= step ? 1.1 : 1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {i < step ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-sm font-black">{i + 1}</span>}
                                    </motion.button>
                                    <span className={`mt-3 text-[10px] uppercase tracking-widest font-black transition-colors ${i === step ? 'text-primary' : 'text-muted-foreground/60'}`}>
                                        {s}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <Card className="p-8 md:p-12 min-h-[550px] flex flex-col justify-center relative overflow-hidden bg-card/40 backdrop-blur-xl border-border/50 rounded-[3rem] shadow-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        >
                            {step === 0 && <PetTypeSelector selected={petType} onSelect={setPetType} />}
                            {step === 1 && <PetNaming name={petName} onNameChange={setPetName} />}
                            {step === 2 && (
                                <UserOnboarding
                                    householdName={householdName}
                                    onHouseholdChange={(name, owner, income, expenses) => {
                                        setHouseholdName(name);
                                        setOwnerName(owner);
                                        setMonthlyIncome(income);
                                        setMonthlyExpenses(expenses);
                                    }}
                                    preselectedHousehold={preselectedHousehold || undefined}
                                />
                            )}
                            {step === 3 && (
                                <PetCustomizer
                                    petType={petType}
                                    image={petImage}
                                    onImageChange={setPetImage}
                                />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </Card>

                {/* Footer */}
                <div className="flex items-center justify-between w-full max-w-2xl mx-auto pt-4">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 0 || isSubmitting}
                        className="rounded-2xl h-14 px-8 font-black gap-2 hover:bg-muted"
                    >
                        <ChevronLeft className="w-5 h-5" /> Back
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!canAdvance() || isSubmitting}
                        className={`rounded-2xl h-14 px-10 font-black gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-xl ${canAdvance() ? 'bg-primary shadow-primary/30' : 'bg-muted'}`}
                    >
                        {isSubmitting ? (
                            <>Creating Magic... <RefreshCw className="w-5 h-5 animate-spin" /></>
                        ) : step === STEPS.length - 1 ? (
                            <>Finish & Start Journey <CheckCircle2 className="w-5 h-5" /></>
                        ) : (
                            <>Continue <ArrowRight className="w-5 h-5" /></>
                        )}
                    </Button>
                </div>
            </div>

            {/* Login Prompt Tray */}
            <AnimatePresence>
                {showLoginPrompt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card p-8 rounded-[3rem] border border-border/50 shadow-2xl max-w-md w-full text-center space-y-6">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto border border-primary/20">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black">Hold on!</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                To save <strong>{petName}</strong> permanently, you should sign in first. Or continue as a guest (data will match this browser only).
                            </p>
                            <div className="flex flex-col gap-3">
                                <Link href="/login" className="w-full">
                                    <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/25">
                                        Sign In Now <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button variant="outline" onClick={() => handleFinalize(true)} className="h-14 rounded-2xl font-black border-2">
                                    Continue as Guest
                                </Button>
                                <Button variant="ghost" onClick={() => setShowLoginPrompt(false)} className="rounded-2xl font-bold">
                                    Cancel
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><RefreshCw className="w-10 h-10 animate-spin text-primary" /></div>}>
            <OnboardingInner />
        </Suspense>
    );
}
