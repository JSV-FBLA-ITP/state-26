'use client';

/**
 * PetPal Onboarding Flow
 * 
 * A multi-step wizard that guides users through creating their first pet and 
 * setting up their financial baseline. This flow is critical for the "Initialization"
 * aspect of the FBLA Programming rubric.
 * 
 * Steps:
 * 1. Choose Pet: Select species (Dog, Cat, etc.)
 * 2. Create Home: Define household parameters (Income & Expenses).
 * 3. Style: Customize pet appearance.
 * 4. Give Name: Finalize naming with character validation.
 * 
 * Logic Highlights:
 * - Starting capital calculation based on user-provided income/expenses.
 * - Dynamic 3D model state initialization (age, stats, budget limits).
 * - Guest mode vs Cloud sync handling for data persistence using Supabase.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PetTypeSelector, PET_TYPES } from '@/components/onboarding/PetTypeSelector';
import { PetCustomizer } from '@/components/onboarding/PetCustomizer';
import { PetNaming } from '@/components/onboarding/PetNaming';
import { UserOnboarding } from '@/components/onboarding/UserOnboarding';
import { randomizeInitialStats, PetData } from '@/lib/gameLogic';
import { validatePetName } from '@/lib/validation';
import { savePetToCloud } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronLeft, Sparkles, ArrowRight, CheckCircle2, RefreshCw } from 'lucide-react';

const STEPS = ['Choose Pet', 'Create Home', 'Style', 'Give Name'];

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

    const handleBack = () => {
        if (step === 0) {
            router.push('/');
        } else {
            setStep((s) => Math.max(0, s - 1));
        }
    };

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
            id: undefined, // Force new pet creation
            type: petType,
            name: petName,
            ownerName: ownerName || householdName,
            householdName,
            petImage: finalPetImage,
            stats: { ...randomizeInitialStats(), money: startingMoney },
            learnedTricks: [],
            totalExpenses: 0,
            budgetLimit: 500, // Default FBLA budget
            age: 0, // Months
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
                const { data, error } = await savePetToCloud(newPet, user.id);
                if (error) {
                    console.error('Finalize save error:', error);
                    throw new Error(error.message || JSON.stringify(error) || 'Cloud save failed');
                }
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
        } catch (err: unknown) {
            console.error('Final handleFinalize error structure:', err);
            const errMsg = err instanceof Error ? err.message : 
                          (typeof err === 'string' ? err : 'Unknown error');
            console.error('Error saving pet (detailed):', errMsg);
            alert(`Something went wrong saving your pet: ${errMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const canAdvance = () => {
        if (step === 0) return !!petType;
        if (step === 1) return householdName.trim().length >= 2;
        if (step === 2) return true;
        if (step === 3) return validatePetName(petName).isValid;
        return false;
    };

    if (isFinishing) {
        const selectedPetTypeIcon = PET_TYPES.find(p => p.id === petType)?.icon || '';
        const displayImage = petImage || selectedPetTypeIcon;

        return (
            <div className="fixed inset-0 z-50 bg-linear-to-br from-background via-muted/20 to-primary/5 flex items-center justify-center overflow-hidden">
                {/* Background Sparkles / Ambient Glow */}
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-sage-500/10 rounded-full blur-[150px] animate-pulse delay-1000" />
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="relative text-center space-y-10 p-8 max-w-2xl w-full"
                >
                    {/* Celebration Banner Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-20 flex gap-4">
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: -100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 * i, type: 'spring' }}
                                className={`w-3 h-12 rounded-full ${i % 2 === 0 ? 'bg-primary/40' : 'bg-sage-400/40'}`}
                            />
                        ))}
                    </div>

                    {/* Pet Portrait Frame */}
                    <div className="relative mx-auto">
                        {/* Decorative Rings */}
                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.1, opacity: 1 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
                            className="absolute inset-0 border-2 border-primary/20 rounded-[3rem] -m-4" 
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1.05, opacity: 1 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse', delay: 0.5 }}
                            className="absolute inset-0 border border-sage-500/30 rounded-[3.5rem] -m-8" 
                        />

                        <motion.div
                            initial={{ scale: 0, rotate: -15, y: 50 }}
                            animate={{ scale: 1, rotate: 0, y: 0 }}
                            transition={{ type: 'spring', damping: 15, stiffness: 80, delay: 0.2 }}
                            className="w-56 h-56 bg-card border-8 border-white rounded-[3rem] overflow-hidden mx-auto shadow-2xl shadow-primary/30 relative z-10 group"
                        >
                            {displayImage ? (
                                <Image 
                                    src={displayImage} 
                                    alt={petName} 
                                    fill 
                                    className="object-contain group-hover:scale-110 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-card p-12">
                                    <Image 
                                        src="/favicon.svg" 
                                        alt="PetPal" 
                                        width={160}
                                        height={160}
                                        className="opacity-20 grayscale brightness-125"
                                    />
                                </div>
                            )}
                            
                            {/* Overlay Sparkle */}
                            <motion.div
                                animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute top-4 right-4"
                            >
                                <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
                            </motion.div>
                        </motion.div>
                        
                        {/* Name Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-8 py-2 rounded-full font-black text-xl shadow-xl z-20 border-4 border-white whitespace-nowrap"
                        >
                            {petName}
                        </motion.div>
                    </div>

                    <div className="space-y-4 pt-4">
                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            transition={{ delay: 1 }} 
                            className="text-5xl md:text-6xl font-black tracking-tight text-foreground"
                        >
                            It&apos;s Official!
                        </motion.h2>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            transition={{ delay: 1.2 }} 
                            className="text-xl md:text-2xl text-muted-foreground font-medium max-w-md mx-auto leading-relaxed"
                        >
                            A new journey begins with your best friend. Get ready to explore together!
                        </motion.p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ delay: 1.8 }} 
                        className="flex flex-col items-center gap-4 pt-12"
                    >
                        <div className="flex items-center gap-4 bg-sage-500/10 text-sage-600 px-6 py-3 rounded-2xl font-bold border border-sage-500/20">
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Preparing your cozy home...</span>
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
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="w-full max-w-4xl mx-auto space-y-12 relative z-10">
                {/* Header & Steps */}
                <div className="flex flex-col items-center text-center space-y-8">
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-3 bg-card/50 backdrop-blur-md px-6 py-3 rounded-full border border-border/50 shadow-sm">
                        <div className="w-8 h-8 relative rounded-lg overflow-hidden shrink-0">
                            <Image 
                                src="/favicon.svg" 
                                alt="PetPal Logo" 
                                fill
                                className="object-contain" 
                            />
                        </div>
                        <span className="font-black tracking-widest uppercase text-xs">Pet Onboarding</span>
                    </motion.div>

                    <div className="relative w-full max-w-2xl px-4 mx-auto text-center">
                        <div className="absolute inset-0 flex items-center px-4" aria-hidden="true">
                            <div className="w-full h-2 bg-muted/30 rounded-full relative z-0 overflow-hidden">
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-linear-to-r from-coral-500 to-coral-400 rounded-full"
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

                {/* Main Content Card (Modal) */}
                <Card className="p-8 md:p-12 min-h-[600px] flex flex-col relative overflow-hidden bg-card/40 backdrop-blur-xl border-border/50 rounded-[3rem] shadow-2xl">
                    <div className="flex-1 flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            >
                                {step === 0 && <PetTypeSelector selected={petType} onSelect={setPetType} />}
                                {step === 1 && (
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
                                {step === 2 && (
                                    <PetCustomizer
                                        petType={petType}
                                        image={petImage}
                                        onImageChange={setPetImage}
                                    />
                                )}
                                {step === 3 && <PetNaming name={petName} onNameChange={setPetName} />}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons - Now Inside Modal */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-border/10 shrink-0">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={isSubmitting}
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
                                <>Finish & Start <CheckCircle2 className="w-5 h-5" /></>
                            ) : (
                                <>Continue <ArrowRight className="w-5 h-5" /></>
                            )}
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Login Prompt Tray */}
            <AnimatePresence>
                {showLoginPrompt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-card p-8 rounded-[3rem] border border-border/50 shadow-2xl max-w-md w-full text-center space-y-6">
                            <div className="w-10 h-10 relative rounded-xl overflow-hidden shrink-0 mx-auto">
                                <Image 
                                    src="/favicon.svg" 
                                    alt="PetPal Logo" 
                                    fill
                                    className="object-contain" 
                                />
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
