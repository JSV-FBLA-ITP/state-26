'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PetTypeSelector } from '@/components/onboarding/PetTypeSelector';
import { PetCustomizer } from '@/components/onboarding/PetCustomizer';
import { PetNaming } from '@/components/onboarding/PetNaming';
import { UserOnboarding } from '@/components/onboarding/UserOnboarding';
import { ActionType, randomizeInitialStats, PetData } from '@/lib/gameLogic';
import { savePetToCloud } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Wand2, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [ownerName, setOwnerName] = useState('');
    const [petType, setPetType] = useState('');
    const [petImage, setPetImage] = useState('');
    const [petName, setPetName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);
    const router = useRouter();

    const handleNext = () => setStep((s) => s + 1);
    const handleBack = () => setStep((s) => s - 1);

    const handleFinalize = async (isGuest = false) => {
        setIsSubmitting(true);

        // Check for session
        const { data: { user } } = await (await import('@/utils/supabase/client')).createClient().auth.getUser();

        if (!user && !isGuest) {
            setShowLoginPrompt(true);
            setIsSubmitting(false);
            return;
        }

        const householdName = `${ownerName}'s Family`;

        const newPet: PetData = {
            type: petType,
            name: petName,
            ownerName: ownerName,
            householdName: householdName,
            petImage: petImage,
            stats: { ...randomizeInitialStats(), money: 500 },
            learnedTricks: [],
            totalExpenses: 0,
            savingsGoal: 500,
            savingsCurrent: 0,
            lastInteraction: Date.now(),
            interactionCount: 0,
            shop_multipliers: { hunger: 1.0, happy: 1.0, energy: 1.0, health: 1.0 },
            shop_upgrades: { hunger: 0, happy: 0, energy: 0, health: 0 },
            monthData: {
                currentMonth: 1,
                requiredActions: [],
                actionsCompleted: {},
            },
        };

        if (user && !isGuest) {
            const { data, error } = await savePetToCloud(newPet);
            if (!error && data) {
                localStorage.setItem('currentPetId', data.id);
                router.push('/dashboard');
            } else {
                console.error('Failed to save pet:', error);
                alert('Something went wrong saving your pet. Please try again.');
            }
        } else {
            // Guest mode: Save placeholder to local storage and proceed
            const guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('currentPetId', guestId);
            localStorage.setItem(`pet_${guestId}`, JSON.stringify(newPet));
            router.push('/dashboard');
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 flex items-center justify-center">
            <div className="max-w-4xl w-full bg-card/50 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-muted">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: "25%" }}
                        animate={{ width: `${(step / 4) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <UserOnboarding name={ownerName} onNameChange={setOwnerName} />
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <PetTypeSelector selected={petType} onSelect={setPetType} />
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <PetCustomizer petType={petType} image={petImage} onImageChange={setPetImage} />
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <PetNaming name={petName} onNameChange={setPetName} />
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 flex items-center justify-between pt-8 border-t border-border/50">
                    <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 1 || isSubmitting}
                        className="rounded-xl h-12 px-6"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" /> Back
                    </Button>

                    {step < 4 ? (
                        <Button
                            onClick={handleNext}
                            disabled={(step === 1 && ownerName.length < 3) || (step === 2 && !petType) || (step === 3 && !petImage)}
                            className="rounded-xl h-12 px-8 shadow-lg shadow-primary/20"
                        >
                            Next <ChevronRight className="w-5 h-5 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={() => handleFinalize(false)}
                            disabled={!petName || isSubmitting}
                            className="rounded-xl h-12 px-8 bg-linear-to-r from-primary to-primary/80 shadow-lg shadow-primary/20"
                        >
                            {isSubmitting ? 'Bringing to Life...' : 'Finalize & Start'}
                            {!isSubmitting && <Wand2 className="w-5 h-5 ml-2" />}
                        </Button>
                    )}
                </div>
            </div>

            {/* Login Prompt Modal */}
            <AnimatePresence>
                {showLoginPrompt && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card p-8 rounded-[2rem] border-2 shadow-2xl max-w-md w-full text-center"
                        >
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h2 className="text-3xl font-black mb-4">Almost There!</h2>
                            <p className="text-muted-foreground mb-8">
                                To save {petName} to your account and start your journey, you'll need to sign in first.
                            </p>
                            <div className="grid grid-cols-1 gap-4">
                                <Link href="/login">
                                    <Button className="w-full h-12 rounded-xl font-bold text-lg">
                                        Sign In / Create Account
                                    </Button>
                                </Link>
                                <Button
                                    variant="outline"
                                    onClick={() => handleFinalize(true)}
                                    className="w-full h-12 rounded-xl font-bold"
                                >
                                    Continue as Guest (Local Only)
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => setShowLoginPrompt(false)}
                                    className="rounded-xl"
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
