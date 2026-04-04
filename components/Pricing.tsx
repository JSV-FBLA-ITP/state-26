'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

const pricingPlans = [
    {
        name: 'Free',
        monthlyPrice: 0,
        annualPrice: 0,
        description: 'Get started with the basics',
        features: ['1 virtual pet', 'Basic financial lessons', 'Community access', 'Daily rewards'],
        highlighted: false,
        cta: 'Start Free',
    },
    {
        name: 'Pro',
        monthlyPrice: 9.99,
        annualPrice: 7.99,
        description: 'Unlock the full experience',
        features: ['Unlimited pets', 'Advanced curriculum', 'AI personality engine', 'Cloud sync', 'Portfolio simulator', 'Priority support'],
        highlighted: true,
        cta: 'Go Pro',
    },
    {
        name: 'Family',
        monthlyPrice: 14.99,
        annualPrice: 11.99,
        description: 'Perfect for the whole household',
        features: ['Up to 5 family members', 'Everything in Pro', 'Family leaderboard', 'Parental dashboard', 'Shared pet world', 'Early access to new features'],
        highlighted: false,
        cta: 'Start Family Plan',
    },
];

export function Pricing({ hasPets = false }: { hasPets?: boolean }) {
    const [isAnnual, setIsAnnual] = useState(false);

    return (
        <section id="pricing" className="py-20 lg:py-28 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <motion.span {...fadeUp(0)} className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase mb-3 block">Pricing</motion.span>
                    <motion.h2 {...fadeUp(0.1)} className="text-3xl lg:text-5xl font-black font-[var(--font-nunito)] mb-5 tracking-tight">Choose your adventure</motion.h2>
                    <motion.p {...fadeUp(0.2)} className="text-[var(--muted-foreground)] max-w-xl mx-auto text-lg">Start free, upgrade when you&apos;re ready. No tricks, no hidden fees.</motion.p>
                </div>

                {/* Billing toggle */}
                <motion.div {...fadeUp(0.25)} className="flex items-center justify-center gap-4 mb-12">
                    <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>Monthly</span>
                    <button 
                        onClick={() => setIsAnnual(!isAnnual)}
                        className={`pricing-toggle ${isAnnual ? 'active' : ''}`}
                        aria-label="Toggle annual billing"
                    >
                        <div className="pricing-toggle-knob" />
                    </button>
                    <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'}`}>
                        Annual <span className="text-[var(--primary)] text-xs font-bold">Save 20%</span>
                    </span>
                </motion.div>

                {/* Pricing cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                    {pricingPlans.map((plan, i) => (
                        <motion.div 
                            key={plan.name}
                            {...fadeUp(0.3 + i * 0.1)}
                            className={`relative p-8 rounded-2xl border-2 transition-all ${
                                plan.highlighted 
                                    ? 'border-[var(--primary)] bg-[var(--card)] shadow-xl shadow-[var(--primary)]/10 scale-[1.02]' 
                                    : 'border-[var(--border)] bg-[var(--card)] shadow-md'
                            }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white text-xs font-bold px-4 py-1 rounded-full">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-xl font-black font-[var(--font-nunito)] mb-1">{plan.name}</h3>
                            <p className="text-sm text-[var(--muted-foreground)] mb-5">{plan.description}</p>
                            
                            <div className="mb-6">
                                <span className="text-4xl font-black font-[var(--font-nunito)]">
                                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                                </span>
                                {plan.monthlyPrice > 0 && (
                                    <span className="text-[var(--muted-foreground)] text-sm">/month</span>
                                )}
                            </div>

                            <Link href={hasPets ? "/dashboard" : "/onboarding"}>
                                <Button 
                                    className={`w-full py-3 rounded-full font-bold h-auto transition-all ${
                                        plan.highlighted 
                                            ? 'bg-[var(--primary)] hover:bg-[var(--coral-600)] text-white shadow-md' 
                                            : 'bg-[var(--accent)] hover:bg-[var(--coral-50)] text-[var(--foreground)] border border-[var(--border)]'
                                    }`}
                                >
                                    {plan.cta}
                                </Button>
                            </Link>

                            <ul className="mt-6 space-y-3">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2.5 text-sm">
                                        <Check className="w-4 h-4 text-[var(--sage-500)] mt-0.5 shrink-0" />
                                        <span className="text-[var(--muted-foreground)]">{f}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
