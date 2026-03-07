/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
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
import { ChevronLeft, ChevronRight, Wand2, Sparkles, PawPrint, ArrowRight } from 'lucide-react';

const STEPS = ['Household', 'Pet Type', 'Customize', 'Name'];

function OnboardingInner() {
    const [step, setStep] = useState(1);
    const [householdName, setHouseholdName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState<number | undefined>();
    const [monthlyExpenses, setMonthlyExpenses] = useState<number | undefined>();
    const [petType, setPetType] = useState('');
    const [petImage, setPetImage] = useState('');
    const [petName, setPetName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    // Pre-fill household from URL param (e.g. /onboarding?household=The+Johnsons)
    const preselectedHousehold = searchParams.get('household') || undefined;

    const handleHouseholdChange = (name: string, owner: string, income?: number, expenses?: number) => {
        setHouseholdName(name);
        setOwnerName(owner || name);
        setMonthlyIncome(income);
        setMonthlyExpenses(expenses);
    };

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => setStep((s) => s - 1);

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
            ownerName,
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

        if (user && !isGuest) {
            const { data, error } = await savePetToCloud(newPet);
            if (!error && data) {
                localStorage.setItem('currentPetId', data.id);
                router.push('/dashboard');
            } else {
                alert('Something went wrong saving your pet. Please try again.');
            }
        } else {
            const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('currentPetId', guestId);
            localStorage.setItem(`pet_${guestId}`, JSON.stringify(newPet));
            router.push('/dashboard');
        }
        setIsSubmitting(false);
    };

    const canAdvance = () => {
        if (step === 1) return householdName.length >= 2;
        if (step === 2) return !!petType;
        if (step === 3) return true;
        if (step === 4) return !!petName;
        return false;
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px] animate-blob" />
                <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-[100px] animate-blob animation-delay-2000" />
            </div>

            <div className="max-w-3xl w-full">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40">
                        <PawPrint className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-black text-xl tracking-tighter">PetPal</span>
                </div>

                {/* Card */}
                <div className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">

                    {/* Gradient progress bar */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-muted overflow-hidden rounded-t-[2.5rem]">
                        <motion.div
                            className="h-full rounded-full bg-linear-to-r from-blue-500 via-emerald-500 to-sky-500"
                            initial={{ width: '25%' }}
                            animate={{ width: `${(step / 4) * 100}%` }}
                            transition={{ ease: 'easeOut', duration: 0.4 }}
                        />
                    </div>

                    {/* Step indicators */}
                    <div className="flex items-center justify-center gap-2 mb-10">
                        {STEPS.map((label, i) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-black transition-all ${i + 1 < step ? 'bg-primary text-primary-foreground' : i + 1 === step ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-muted text-muted-foreground'}`}>
                                    {i + 1 < step ? '✓' : i + 1}
                                </div>
                                <span className={`text-xs font-bold hidden sm:block transition-colors ${i + 1 === step ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
                                {i < STEPS.length - 1 && <div className={`w-8 h-0.5 rounded-full mx-1 transition-colors ${i + 1 < step ? 'bg-primary' : 'bg-muted'}`} />}
                            </div>
                        ))}
                    </div>

                    {/* Step content */}
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <UserOnboarding
                                    householdName={householdName}
                                    onHouseholdChange={handleHouseholdChange}
                                    preselectedHousehold={preselectedHousehold}
                                />
                            </motion.div>
                        )}
                        {step === 2 && (
                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <PetTypeSelector selected={petType} onSelect={setPetType} />
                            </motion.div>
                        )}
                        {step === 3 && (
                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <PetCustomizer petType={petType} image={petImage} onImageChange={setPetImage} />
                            </motion.div>
                        )}
                        {step === 4 && (
                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <PetNaming name={petName} onNameChange={setPetName} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="mt-10 flex items-center justify-between pt-8 border-t border-border/50">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={step === 1 || isSubmitting}
                            className="rounded-xl h-11 px-6 font-semibold gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </Button>

                        {step < 4 ? (
                            <div className="flex flex-col items-end gap-1.5">
                                <Button
                                    onClick={handleNext}
                                    disabled={!canAdvance()}
                                    className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-primary/20 gap-2"
                                >
                                    {step === 3 && !petImage ? 'Skip' : 'Next'} <ChevronRight className="w-4 h-4" />
                                </Button>
                                {step === 3 && !petImage && (
                                    <p className="text-xs text-muted-foreground mr-2">
                                        Optional
                                    </p>
                                )}
                            </div>
                        ) : (
                            <Button
                                onClick={() => handleFinalize(false)}
                                disabled={!petName || isSubmitting}
                                className="rounded-xl h-11 px-8 font-bold shadow-lg shadow-primary/20 gap-2 bg-linear-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white border-0"
                            >
                                {isSubmitting ? 'Bringing to Life...' : 'Finalize & Start'}
                                {!isSubmitting && <Wand2 className="w-4 h-4" />}
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Login Prompt Modal */}
            <AnimatePresence>
                {showLoginPrompt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-card/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-border/50 shadow-2xl max-w-md w-full text-center"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Almost There!</h2>
                            <p className="text-muted-foreground mb-8 leading-relaxed">
                                To save <strong>{petName}</strong> to your account and start your journey, sign in first.
                            </p>
                            <div className="grid grid-cols-1 gap-3">
                                <Link href="/login">
                                    <Button className="w-full h-12 rounded-xl font-bold gap-2 text-base shadow-lg shadow-primary/25">
                                        Sign In / Create Account <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={() => handleFinalize(true)}
                                    className="w-full h-12 rounded-xl font-bold border-2"
                                >
                                    Continue as Guest (Local Only)
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowLoginPrompt(false)}
                                    className="rounded-xl text-muted-foreground"
                                >
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
        <Suspense>
            <OnboardingInner />
        </Suspense>
    );
}
