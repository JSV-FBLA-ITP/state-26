'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    Sparkles,
    Cloud,
    ChevronDown,

    Star,
    Users,
    Zap,
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

const stats = [
    { value: '50K+', label: 'Active Learners' },
    { value: '4.9', label: 'App Rating', icon: Star },
    { value: '94%', label: 'Completion Rate' },
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

const testimonials = [
    {
        quote: "My daughter went from confusing needs vs wants to explaining compound interest to me. This app actually works.",
        author: 'Sarah M.',
        role: 'Parent of 10-year-old',
        avatar: 'SM',
    },
    {
        quote: "I've tried every finance app out there. PetPal is the only one that actually made concepts click for me.",
        author: 'James K.',
        role: 'College Student',
        avatar: 'JK',
    },
    {
        quote: "The gamification is perfect. I find myself thinking about my finances even when I'm not using the app.",
        author: 'Maria L.',
        role: 'Freelance Designer',
        avatar: 'ML',
    },
];

const faqs = [
    {
        question: 'What age is PetPal designed for?',
        answer: 'PetPal is designed for ages 8 and up. The content adapts to different age groups, with simpler concepts for younger users and more advanced financial topics for teens and adults.',
    },
    {
<<<<<<< HEAD
        question: 'Do I need prior finance knowledge?',
        answer: 'Not at all! PetPal starts from the basics and progressively introduces more complex concepts. We assume zero prior knowledge and build up from there.',
=======
        question: 'Is PetPal suitable for kids?',
        answer: 'Absolutely! PetPal is designed for ages 8+, with content that adapts to the user\'s level. It includes interactive tools and progress dashboards so parents can track what their kids are learning.',
<<<<<<< Updated upstream
=======
>>>>>>> b035757c813082b4720f11dff4ede5a4ae551130
>>>>>>> Stashed changes
    },
    {
        question: 'Can I use PetPal on my phone and tablet?',
        answer: 'Yes! PetPal is fully responsive and works beautifully on any device. Your progress syncs instantly across all your devices so you can switch seamlessly.',
    },
    {
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
        question: 'Is there a free version?',
        answer: 'Absolutely. The free version includes one pet, basic lessons, and core features. Premium unlocks additional pets, advanced lessons, and exclusive rewards.',
=======
>>>>>>> Stashed changes
        question: 'How do I adopt my first pet?',
        answer: 'Getting started is easy! Just click "Get Started" to begin your onboarding journey where you\'ll choose your pet\'s species, name them, and start your financial adventure together.',
    },
    {
        question: 'How is PetPal different from other finance apps?',
        answer: 'Most finance apps feel like homework. PetPal makes learning fun through emotional connection — you care about your pet, so you care about managing resources wisely. It\'s the same psychology that makes games addictive, applied to education.',
>>>>>>> b035757c813082b4720f11dff4ede5a4ae551130
    },
];

function FaqItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
    return (
        <div className="border-b border-slate-200 last:border-0">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-5 text-left group"
            >
                <span className="text-base font-semibold text-slate-900 group-hover:text-orange-500 transition-colors pr-6">
                    {question}
                </span>
                <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-40 pb-5' : 'max-h-0'
                }`}
            >
                <p className="text-slate-600 leading-relaxed">{answer}</p>
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
        <div className="min-h-screen bg-white text-slate-900 antialiased">
            <Navbar />
            <main>
                {/* Hero Section */}
                <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
                    {/* Subtle background gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-50/50 via-white to-white" />
                    <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-100/40 to-amber-100/30 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-100/30 to-teal-100/20 rounded-full blur-[100px]" />

                    <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                            {/* Hero Copy */}
                            <div className="flex-1 text-center lg:text-left">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm font-semibold mb-8"
                                >
                                    <Zap className="w-4 h-4" />
                                    <span>Now available on iOS & Android</span>
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                    className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]"
                                >
                                    Learn to save.
                                    <br />
                                    <span className="text-orange-500">Love your pet.</span>
                                    <br />
                                    Grow your wealth.
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                    className="text-lg text-slate-600 mb-10 max-w-lg mx-auto lg:mx-0"
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
                                        <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-5 rounded-full text-base font-semibold shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all h-auto flex items-center gap-2">
                                            {hasPets ? `Continue with ${firstPetName || 'Pet'}` : "Start Your Journey"}
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/demo">
                                        <Button variant="ghost" className="text-slate-600 hover:text-slate-900 px-6 py-5 rounded-full text-base font-medium hover:bg-slate-100 transition-all h-auto">
                                            Watch Demo
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>

                            {/* Hero Illustration */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="flex-1 relative w-full max-w-lg lg:max-w-xl"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-200/50 via-amber-100/30 to-emerald-100/20 rounded-full blur-[100px] scale-90" />
                                    <div className="relative z-10 w-full h-[450px] sm:h-[500px] lg:h-[550px]">
                                        <HeroCanvas />
                                    </div>

                                    {/* Floating stats card */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.8 }}
                                        className="absolute -bottom-4 -left-4 lg:left-4 z-20 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-slate-100"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <TrendingUp className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Portfolio</p>
                                                <p className="text-xl font-bold text-slate-900">+$127.50</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Stats Bar */}
                <section className="py-12 bg-slate-50 border-y border-slate-100">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
                            {stats.map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: i * 0.1 }}
                                    className="flex items-center gap-3"
                                >
                                    {stat.icon && <stat.icon className="w-5 h-5 text-amber-500 fill-amber-500" />}
                                    <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                                    <span className="text-sm text-slate-500">{stat.label}</span>
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
                            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Features</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3 mb-4">
                                Everything you need to learn
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                We&apos;ve built the tools and content you need to develop real financial literacy while having fun.
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
                                    className="group p-8 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300"
                                >
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                                        style={{ backgroundColor: `${feature.color}15`, color: feature.color }}
                                    >
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-20 lg:py-32 px-6 lg:px-8 bg-slate-50">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
<<<<<<< HEAD
                            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">How It Works</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3 mb-4">
                                Start learning in minutes
                            </h2>
=======
                            <div className="absolute -inset-10 bg-[var(--sage-100)] blur-[80px] rounded-full opacity-40" />
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[var(--sage-400)] to-[var(--sage-500)] p-12 flex flex-col items-center justify-center min-h-[400px]">
                                <BarChart className="w-24 h-24 mb-6 text-white drop-shadow-md opacity-90" />
                                <div className="text-center text-white">
                                    <p className="text-sm font-bold uppercase tracking-[0.2em] mb-2 opacity-80">Certified Learning</p>
                                    <h4 className="text-2xl font-black font-[var(--font-nunito)]">Master Your Finances</h4>
                                </div>
                                
                                {/* Decorative stats */}
                                <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-xs">
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center text-white">
                                        <p className="text-2xl font-black">94%</p>
                                        <p className="text-xs opacity-70">Completion rate</p>
                                    </div>
                                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-3 text-center text-white">
                                        <p className="text-2xl font-black">4.9★</p>
                                        <p className="text-xs opacity-70">Satisfaction</p>
                                    </div>
                                </div>
                            </div>
>>>>>>> b035757c813082b4720f11dff4ede5a4ae551130
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {howItWorks.map((item, i) => (
                                <motion.div
                                    key={item.step}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                                    className="relative p-8 rounded-2xl bg-white border border-slate-200"
                                >
                                    <span className="text-5xl font-bold text-orange-100 absolute top-4 right-6">
                                        {item.step}
                                    </span>
                                    <h3 className="text-xl font-semibold mb-3 mt-8">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
                {/* Testimonials */}
                <section className="py-20 lg:py-32 px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3 mb-4">
                                Loved by learners everywhere
                            </h2>
                        </motion.div>
=======
>>>>>>> b035757c813082b4720f11dff4ede5a4ae551130
>>>>>>> Stashed changes

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, i) => (
                                <motion.div
                                    key={testimonial.author}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                                    className="p-8 rounded-2xl bg-slate-50 border border-slate-100"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-700 mb-6 leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-semibold text-sm">
                                            {testimonial.avatar}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">{testimonial.author}</p>
                                            <p className="text-sm text-slate-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 lg:py-32 px-6 lg:px-8 bg-slate-50">
                    <div className="max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <span className="text-orange-500 font-semibold text-sm uppercase tracking-wider">FAQ</span>
                            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mt-3 mb-4">
                                Questions? We&apos;ve got answers
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-slate-200"
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
                <section className="py-20 lg:py-32 px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-12 lg:p-16 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                                Ready to start learning?
                            </h2>
                            <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
                                Join thousands of learners who are already mastering their finances while having fun.
                            </p>
                            <Link href={hasPets ? "/dashboard" : "/onboarding"}>
                                <Button className="bg-white text-orange-600 px-10 py-5 rounded-full text-lg font-semibold hover:bg-orange-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl h-auto">
                                    {hasPets ? "Open Your Dashboard" : "Create Free Account"}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Trust Badges */}
                <section className="pb-20 px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 text-slate-400">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                <span className="text-sm font-medium">Bank-level security</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                <span className="text-sm font-medium">50,000+ users</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="w-5 h-5" />
                                <span className="text-sm font-medium">Editor&apos;s Choice 2024</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16 px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="relative w-8 h-8">
<<<<<<< HEAD
                                    <Image
                                        src="/favicon.png"
                                        alt="PetPal Logo"
=======
                                    <Image 
                                        src="/favicon.svg" 
                                        alt="PetPal Logo" 
>>>>>>> b035757c813082b4720f11dff4ede5a4ae551130
                                        fill
                                        className="object-contain brightness-0 invert"
                                    />
                                </div>
                                <span className="font-bold text-lg">PetPal</span>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Making financial literacy fun for everyone.
                            </p>
                        </div>

                        <div>
<<<<<<< HEAD
                            <h4 className="font-semibold text-sm mb-4 text-slate-300">Product</h4>
                            <ul className="space-y-2">
                                <li><Link href="/#features" className="text-sm text-slate-400 hover:text-white transition-colors">Features</Link></li>
                                <li><Link href="/pricing" className="text-sm text-slate-400 hover:text-white transition-colors">Pricing</Link></li>
                                <li><Link href="/demo" className="text-sm text-slate-400 hover:text-white transition-colors">Demo</Link></li>
=======
                            <h4 className="font-bold text-sm mb-4 font-[var(--font-nunito)]">Product</h4>
                            <ul className="space-y-2.5">
                                <li><Link href="/#features" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Features</Link></li>
                                <li><Link href="/demo" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Demo</Link></li>
>>>>>>> b035757c813082b4720f11dff4ede5a4ae551130
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-sm mb-4 text-slate-300">Company</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About</Link></li>
                                <li><Link href="/careers" className="text-sm text-slate-400 hover:text-white transition-colors">Careers</Link></li>
                                <li><Link href="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-sm mb-4 text-slate-300">Legal</h4>
                            <ul className="space-y-2">
                                <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-white transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="text-sm text-slate-400 hover:text-white transition-colors">Terms</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} PetPal. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
