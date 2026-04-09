'use client';

/**
 * PetPal Landing Page
 * 
 * This is the primary entry point for the PetPal application. 
 * Designed for the FBLA 2025-2026 Competitive Event (Introduction to Programming).
 * 
 * Features:
 * - Dynamic Hero Section with premium visual elements.
 * - Value Proposition highlight (Financial Literacy + Pet Care).
 * - Multi-section layout (Features, Why PetPal, How it Works, FAQ).
 * - Real-time pet status check for returning users using Supabase storage logic.
 * 
 * Technical Highlights:
 * - Framer Motion for smooth entrances and scroll-triggered animations.
 * - High-fidelity pet visuals with dynamic state-based feedback.
 * - Responsive design architecture for desktop and mobile devices.
 */

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    TrendingUp,
    Sparkles,
    Cloud,
    ChevronDown,
    Calculator,
    Gamepad2,
    BookOpen,
} from 'lucide-react';
import { fetchUserPets } from '@/lib/storage';
import { Navbar } from '@/components/Navbar';
import { HeroCanvas } from '@/components/HeroCanvas';

const features = [
    {
        icon: Sparkles,
        title: 'AI-Powered Personalization',
        description: 'Our intelligent system adapts to your learning style and financial goals, creating a unique educational journey.',
        color: '#F97316',
    },
    {
        icon: Cloud,
        title: 'Seamless Cloud Sync',
        description: 'Your progress, pets, and achievements sync across all devices in real-time. Pick up right where you left off.',
        color: '#22C55E',
    },
    {
        icon: TrendingUp,
        title: 'Real-World Skills',
        description: 'Bridge the gap between virtual pet care and real financial literacy with hands-on learning modules.',
        color: '#3B82F6',
    },
];

const whyPetPal = [
    {
        icon: Calculator,
        color: '#F97316',
        title: 'Track Monthly Pet Expenses',
        reasons: [
            'Log food, vet visits, grooming, and more',
            'See spending breakdowns at a glance',
            'Set monthly budgets for each pet',
            'Spot trends before costs creep up',
        ],
    },
    {
        icon: Gamepad2,
        color: '#8B5CF6',
        title: 'Learn Finance Through Play',
        reasons: [
            'Care for your virtual pet as you learn',
            'Earn rewards for completing lessons',
            'Fun mini-games that teach real concepts',
            'Progress tracking that keeps you hooked',
        ],
    },
    {
        icon: BookOpen,
        color: '#22C55E',
        title: 'Build Real Financial Knowledge',
        reasons: [
            'Budgeting, saving, and investing basics',
            'Concepts explained through pet analogies',
            'Age-appropriate for kids and adults alike',
            'No prior finance experience needed',
        ],
    },
];

const howItWorks = [
    {
        step: '01',
        title: 'Adopt Your Companion',
        description: 'Choose from a variety of adorable pets, each with unique traits and care requirements.',
    },
    {
        step: '02',
        title: 'Learn Through Play',
        description: 'Complete engaging micro-lessons by caring for your pet. Every decision teaches a financial concept.',
    },
    {
        step: '03',
        title: 'Watch Both Grow',
        description: 'As your knowledge compounds, your pet thrives. Unlock new levels, abilities, and lessons together.',
    },
];

const faqs = [
    {
        question: 'What age is PetPal designed for?',
        answer: 'PetPal is designed for ages 8 and up. The content adapts to different age groups, with simpler concepts for younger users and more advanced financial topics for teens and adults.',
    },
    {
        question: 'Do I need prior finance knowledge?',
        answer: 'Not at all! PetPal starts from the basics and progressively introduces more complex concepts. We assume zero prior knowledge and build up from there.',
    },
    {
        question: 'Can I use PetPal on my phone and tablet?',
        answer: 'Yes! PetPal is fully responsive and works beautifully on any device. Your progress syncs instantly across all your devices so you can switch seamlessly.',
    },
    {
        question: 'Is there a free version?',
        answer: 'Absolutely. The free version includes one pet, basic lessons, and core features. Premium unlocks additional pets, advanced lessons, and exclusive rewards.',
    },
];

function FaqItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-border last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
            >
                <span className="text-base font-semibold text-foreground group-hover:text-primary transition-colors pr-6">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-5' : 'max-h-0'
                    }`}
            >
                <p className="text-muted-foreground leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}

export default function LandingPage() {
    const [hasPets, setHasPets] = useState(false);
    const [firstPetName, setFirstPetName] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        async function checkForPets() {
            try {
                const { data } = await fetchUserPets();
                if (data && data.length > 0) {
                    setHasPets(true);
                    setFirstPetName(data[0]?.name || null);
                }
            } catch {
                // silently ignore
            }
        }
        checkForPets();
    }, []);

    const toggleFaq = useCallback((index: number) => {
        setOpenFaq(prev => prev === index ? null : index);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground antialiased">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="relative pt-14 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                    {/* Subtle background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-coral-50/50 via-background to-background" />
                    <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-coral-100/40 to-coral-50/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-sage-100/30 to-sage-50/20 rounded-full blur-[100px]" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-0 lg:gap-16">

                            {/* Hero Illustration — mobile only, sits cleanly above the title */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="w-[240px] mx-auto lg:hidden pt-8 mb-[80px]"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-coral-100/50 via-coral-50/30 to-sage-100/20 rounded-full blur-[60px]" />
                                    <div className="relative z-10 w-full h-[320px]">
                                        <HeroCanvas />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Hero Copy */}
                            <div className="flex-1 text-center lg:text-left relative z-20">
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="text-5xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1] text-foreground"
                                >
                                    Learn to save.
                                    <br />
                                    <span className="text-primary">Love your pet.</span>
                                    <br />
                                    Grow your wealth.
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0"
                                >
                                    The financial literacy app that makes learning feel like play. Raise a virtual pet, master real-world money skills.
                                </motion.p>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                                >
                                    <Link href={hasPets ? "/dashboard" : "/onboarding"}>
                                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-5 rounded-full text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all h-auto flex items-center gap-2">
                                            {hasPets ? `Continue with ${firstPetName || 'Pet'}` : "Start Your Journey"}
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Hero Illustration — desktop only (right column) */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="hidden lg:block flex-1 relative w-full max-w-xl"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-coral-100/50 via-coral-50/30 to-sage-100/20 rounded-full blur-[100px] scale-90" />
                                    <div className="relative z-10 w-full h-[550px]">
                                        <HeroCanvas />
                                    </div>

                                    {/* Floating stats card */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="absolute -bottom-4 left-4 z-20 bg-card/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-border"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                                                <TrendingUp className="w-6 h-6 text-sage-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Portfolio</p>
                                                <p className="text-xl font-bold text-foreground">+$127.50</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Why PetPal — replaces fake stats + testimonials */}
                <section id="features" className="py-20 lg:py-32 px-6 lg:px-8 bg-muted">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why PetPal</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3 mb-4 text-foreground">
                                Built around your pet and your wallet
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                PetPal combines practical pet expense tracking with fun financial education — no fluff, just real value.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {whyPetPal.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                                    className="card-lift group p-8 rounded-2xl bg-card border border-border hover:border-border/80 hover:shadow-xl transition-all duration-300"
                                >
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${item.color}18`, color: item.color }}
                                    >
                                        <item.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-foreground">{item.title}</h3>
                                    <ul className="space-y-2">
                                        {item.reasons.map((reason) => (
                                            <li key={reason} className="flex items-start gap-2 text-sm text-muted-foreground">
                                                <span
                                                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                                    style={{ backgroundColor: item.color }}
                                                />
                                                {reason}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 lg:py-32 px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Features</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3 mb-4 text-foreground">
                                Everything you need to learn
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                We have built the tools and content you need to develop real financial literacy while having fun.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                    className="card-lift group p-8 rounded-2xl bg-card border border-border hover:border-border/80 hover:shadow-xl transition-all duration-300"
                                >
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                                    >
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-20 lg:py-32 px-6 lg:px-8 bg-muted">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">How It Works</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3 mb-4 text-foreground">
                                Start learning in minutes
                            </h2>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {howItWorks.map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                                    className="relative p-8 rounded-2xl bg-card border border-border"
                                >
                                    <span className="text-5xl font-bold text-primary/20 absolute top-4 right-6">
                                        {item.step}
                                    </span>
                                    <h3 className="text-xl font-semibold mb-3 mt-8 text-foreground">{item.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="education" className="py-20 lg:py-32 px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <span className="text-primary font-semibold text-sm uppercase tracking-wider">FAQ</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3 mb-4 text-foreground">
                                Questions? We have got answers
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-card rounded-2xl p-6 lg:p-8 shadow-sm border border-border"
                        >
                            {faqs.map((faq, i) => (
                                <FaqItem
                                    key={i}
                                    question={faq.question}
                                    answer={faq.answer}
                                    isOpen={openFaq === i}
                                    onToggle={() => toggleFaq(i)}
                                />
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 lg:py-32 px-6 lg:px-8 bg-muted">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-primary to-coral-400 p-12 lg:p-16 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                                Ready to start learning?
                            </h2>
                            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                                Build better financial habits through play — and take care of your pet while you&apos;re at it.
                            </p>
                            <Link href={hasPets ? "/dashboard" : "/onboarding"}>
                                <Button className="bg-white text-primary px-10 py-5 rounded-full text-lg font-semibold hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl h-auto">
                                    {hasPets ? "Open Your Dashboard" : "Create Free Account"}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-muted text-foreground py-12 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-10">
                        {/* Brand */}
                        <div className="max-w-xs">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/favicon.png"
                                        alt="PetPal Logo"
                                        fill
                                        className="object-contain dark:invert"
                                    />
                                </div>
                                <span className="font-bold text-lg">PetPal</span>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Making financial literacy fun for everyone.
                            </p>
                        </div>

                        {/* Quick Links — only real pages */}
                        <div>
                            <h4 className="font-semibold text-sm mb-4 text-foreground/80">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link></li>
                                <li><Link href="/#education" className="text-sm text-muted-foreground hover:text-foreground transition-colors">FAQ</Link></li>
                                <li><Link href={hasPets ? "/dashboard" : "/onboarding"} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{hasPets ? "Dashboard" : "Get Started"}</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-muted-foreground text-sm">
                            © {new Date().getFullYear()} PetPal. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" aria-label="X / Twitter" className="text-muted-foreground hover:text-foreground transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-foreground transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
