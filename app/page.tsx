'use client';
// cool
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    ArrowRight, PlayCircle,
    ShieldCheck, Heart, TrendingUp, Sparkles, Cloud,
    PawPrint, ChevronDown,
    BookOpen, BarChart
} from 'lucide-react';
import { fetchUserPets } from '@/lib/storage';
import { Navbar } from '@/components/Navbar';
/* ── Animation variants ── */
const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

const fadeIn = (delay = 0) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
});

/* ── Data ── */
const features = [
    {
        icon: Sparkles,
        title: 'AI Customization',
        description: 'Create a pet as unique as your financial goals. Our AI adapts their personality to your learning style.',
        color: 'var(--primary)',
        bgColor: 'var(--coral-50)',
    },
    {
        icon: Cloud,
        title: 'Cloud Persistence',
        description: 'Your progress and your pet\'s growth are synced across all devices. Never miss a feeding or a market update.',
        color: 'var(--sage-500)',
        bgColor: 'var(--sage-50)',
    },
    {
        icon: TrendingUp,
        title: 'Growth & Finance',
        description: 'As your pet grows, so does your financial portfolio. Virtual pet levels tie directly to real economic concepts.',
        color: 'var(--primary)',
        bgColor: 'var(--coral-50)',
    },
];

const methodSteps = [
    {
        title: 'Adopt & Care',
        desc: 'Choose a pet that fits your vibe. Name them, care for them, and build a bond.',
        icon: PawPrint,
    },
    {
        title: 'Learn & Earn',
        desc: 'Complete interactive micro-lessons and manage resources to keep your pet thriving.',
        icon: BookOpen,
    },
    {
        title: 'Grow Together',
        desc: 'As your financial knowledge compounds, your pet levels up, unlocking new features.',
        icon: Sparkles,
    },
];

const faqs = [
    {
        question: 'How does PetPal teach financial literacy?',
        answer: 'PetPal turns abstract financial concepts into tangible pet care decisions. When your pet needs a "reserve fund" for emergencies, you\'re learning about savings. When the PetCoin marketplace fluctuates, you\'re experiencing inflation. It\'s learning by doing.',
    },
    {
        question: 'Is PetPal suitable for kids?',
        answer: 'Absolutely! PetPal is designed for ages 8+, with content that adapts to the user\'s level. It includes interactive tools and progress dashboards so parents can track what their kids are learning.',
    },
    {
        question: 'Can I use PetPal on multiple devices?',
        answer: 'Yes! With our Cloud Persistence feature, your progress syncs across all your devices. Start on your phone during your commute, continue on your laptop at home.',
    },
    {
        question: 'How do I adopt my first pet?',
        answer: 'Getting started is easy! Just click "Get Started" to begin your onboarding journey where you\'ll choose your pet\'s species, name them, and start your financial adventure together.',
    },
    {
        question: 'How is PetPal different from other finance apps?',
        answer: 'Most finance apps feel like homework. PetPal makes learning fun through emotional connection — you care about your pet, so you care about managing resources wisely. It\'s the same psychology that makes games addictive, applied to education.',
    },
];

const educationItems = [
    { title: 'Understand needs vs wants', desc: 'Prioritize pet medicine over premium cosmetics to learn essential budgeting.', icon: Heart },
    { title: 'Learn interest and inflation', desc: "Watch how the 'PetCoin' marketplace fluctuates based on simulator supply.", icon: TrendingUp },
    { title: 'Risk Management', desc: "Insure your pet against unexpected virtual 'accidents' to understand premiums.", icon: ShieldCheck },
];

/* ── Floating Paw Component ── */
function FloatingPaws() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="paw-float"
                    style={{
                        left: `${10 + i * 15}%`,
                        animationDuration: `${12 + i * 3}s`,
                        animationDelay: `${i * 2}s`,
                        fontSize: `${16 + i * 4}px`,
                    }}
                >
                    <PawPrint className="w-[1em] h-[1em] opacity-30" />
                </div>
            ))}
        </div>
    );
}

/* ── FAQ Accordion Item ── */
function FaqItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (contentRef.current) {
            setHeight(contentRef.current.scrollHeight);
        }
    }, [isOpen]);

    return (
        <div className={`border-b border-[var(--border)] ${isOpen ? 'accordion-open' : ''}`}>
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between py-5 px-1 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded-lg"
                aria-expanded={isOpen}
            >
                <span className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors pr-4 font-[var(--font-nunito)]">
                    {question}
                </span>
                <ChevronDown className="w-5 h-5 text-[var(--muted-foreground)] accordion-chevron shrink-0" />
            </button>
            <div
                className="accordion-content"
                style={{ maxHeight: isOpen ? `${height}px` : '0px', opacity: isOpen ? 1 : 0 }}
            >
                <div ref={contentRef} className="pb-5 px-1">
                    <p className="text-[var(--muted-foreground)] leading-relaxed">{answer}</p>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════ */
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
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--coral-100)] selection:text-[var(--coral-700)] overflow-x-hidden">
            <Navbar />
            <main className="pt-20">
                {/* ══════════════════════════════════════════
                    HERO SECTION
                   ══════════════════════════════════════════ */}
                <section id="hero" className="relative px-6 lg:px-8 py-16 lg:py-24 overflow-hidden min-h-[85vh] flex items-center">
                    <FloatingPaws />

                    {/* Gradient blobs */}
                    <div className="absolute top-20 -right-32 w-[500px] h-[500px] bg-[var(--coral-100)] rounded-full blur-[120px] opacity-40 animate-blob" />
                    <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[var(--sage-100)] rounded-full blur-[100px] opacity-30 animate-blob animation-delay-4000" />

                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full relative z-10">
                        {/* Hero Copy */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--coral-50)] dark:bg-[var(--coral-50)] text-[var(--primary)] text-sm font-bold mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>A new way to learn finance</span>
                            </motion.div>

                            <motion.h1
                                {...fadeUp(0.1)}
                                className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-black font-[var(--font-nunito)] leading-[1.1] tracking-tight mb-6"
                            >
                                Happy Pets.{' '}
                                <span className="text-[var(--primary)]">
                                    Smart Money.</span>{' '}
                                <br className="hidden sm:block" />
                                One App.
                            </motion.h1>

                            <motion.p
                                {...fadeUp(0.2)}
                                className="text-lg text-[var(--muted-foreground)] mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                            >
                                Raise your dream pet while mastering real-world money skills. It&apos;s like a game — but the lessons stick.
                            </motion.p>

                            <motion.div
                                {...fadeUp(0.3)}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <Link href={hasPets ? "/dashboard" : "/onboarding"} className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[var(--coral-600)] text-white px-8 py-4 rounded-full text-base font-bold shadow-lg shadow-[var(--primary)]/25 hover:shadow-xl hover:shadow-[var(--primary)]/30 hover:scale-[1.03] active:scale-95 transition-all h-auto flex items-center gap-2">
                                        {hasPets ? `Continue with ${firstPetName || 'Pet'}` : "Start Your Journey"}
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href="/demo" className="w-full sm:w-auto">
                                    <Button variant="ghost" className="w-full sm:w-auto border-2 border-[var(--border)] bg-transparent text-[var(--foreground)] px-8 py-4 rounded-full text-base font-bold hover:bg-[var(--accent)] transition-all flex items-center justify-center gap-2 h-auto">
                                        <PlayCircle className="w-5 h-5" />
                                        Watch Demo
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        {/* Hero Illustration */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="flex-1 relative w-full max-w-lg lg:max-w-xl"
                        >
                            <div className="relative">
                                {/* Glow behind illustration */}
                                <div className="absolute inset-0 bg-[var(--coral-100)] rounded-full blur-[80px] opacity-40 scale-75" />

                                <motion.div
                                    animate={{ y: [0, -12, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <Image
                                        src="/hero-pet.png"
                                        alt="Happy golden retriever illustration surrounded by coins and hearts"
                                        width={600}
                                        height={600}
                                        className="relative z-10 w-full h-auto drop-shadow-2xl"
                                        priority
                                    />
                                </motion.div>

                                {/* Floating savings card */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 }}
                                    className="absolute bottom-8 -left-4 lg:left-0 z-20 bg-[var(--card)]/90 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-[var(--border)] hidden sm:block"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[var(--sage-50)] rounded-xl flex items-center justify-center text-[var(--sage-500)]">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">Daily Savings</p>
                                            <p className="text-lg font-black text-[var(--foreground)]">+$24.50</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    SOCIAL PROOF BAR
                   ══════════════════════════════════════════ */}
                <section className="py-8 px-6 lg:px-8 border-y border-[var(--border)]">
                    <motion.div
                        {...fadeIn(0.2)}
                        className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8 lg:gap-16"
                    >
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                            <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
                            <span className="font-bold text-sm">Zero real-world risk</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                            <BookOpen className="w-5 h-5 text-[var(--sage-500)]" />
                            <span className="font-bold text-sm">Gamified education</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                            <Cloud className="w-5 h-5 text-[var(--primary)]" />
                            <span className="font-bold text-sm">Cloud-synced progress</span>
                        </div>
                        <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
                            <Heart className="w-5 h-5 text-[var(--sage-500)]" />
                            <span className="font-bold text-sm">Empathetic learning</span>
                        </div>
                    </motion.div>
                </section>

                {/* ══════════════════════════════════════════
                    FEATURES SECTION
                   ══════════════════════════════════════════ */}
                <section id="features" className="py-20 lg:py-28 px-6 lg:px-8 bg-[var(--coral-50)] dark:bg-[var(--coral-50)]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <motion.span {...fadeUp(0)} className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase mb-3 block">Platform Excellence</motion.span>
                            <motion.h2 {...fadeUp(0.1)} className="text-3xl lg:text-5xl font-black font-[var(--font-nunito)] mb-5 tracking-tight">Everything your pet needs</motion.h2>
                            <motion.p {...fadeUp(0.2)} className="text-[var(--muted-foreground)] max-w-2xl mx-auto text-lg leading-relaxed">Our features are designed to create a seamless loop between virtual care and real-world intelligence.</motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    {...fadeUp(0.2 + i * 0.1)}
                                    className="card-lift p-8 rounded-2xl bg-[var(--card)] shadow-md border border-[var(--border)]/50 dark:border-[var(--border)]"
                                >
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                                        style={{ background: feature.bgColor, color: feature.color }}
                                    >
                                        <feature.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-xl font-black font-[var(--font-nunito)] mb-3">{feature.title}</h3>
                                    <p className="text-[var(--muted-foreground)] leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    EDUCATION SECTION
                   ══════════════════════════════════════════ */}
                <section id="education" className="py-20 lg:py-28 px-6 lg:px-8 overflow-hidden">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
                        {/* Left: Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-5/12 relative"
                        >
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
                        </motion.div>

                        {/* Right: Content */}
                        <div className="lg:w-7/12">
                            <motion.span {...fadeUp(0)} className="text-[var(--sage-500)] font-bold tracking-widest text-xs uppercase mb-3 block">Learning Reimagined</motion.span>
                            <motion.h2 {...fadeUp(0.1)} className="text-3xl lg:text-5xl font-black font-[var(--font-nunito)] mb-6 leading-tight tracking-tight">Financial Literacy Made Fun</motion.h2>
                            <motion.p {...fadeUp(0.2)} className="text-[var(--muted-foreground)] mb-10 text-lg leading-relaxed">
                                We transform abstract financial concepts into tangible pet needs. When you understand why your pet needs a &quot;reserve fund,&quot; you&apos;re learning the basics of emergency savings in the real world.
                            </motion.p>

                            <div className="space-y-6">
                                {educationItems.map((item, i) => (
                                    <motion.div
                                        key={item.title}
                                        {...fadeUp(0.3 + i * 0.1)}
                                        className="flex items-start gap-5 group"
                                    >
                                        <div className="mt-0.5 w-12 h-12 rounded-xl bg-[var(--sage-50)] flex items-center justify-center text-[var(--sage-500)] group-hover:scale-110 group-hover:bg-[var(--sage-100)] transition-all shrink-0">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg mb-1 font-[var(--font-nunito)]">{item.title}</h4>
                                            <p className="text-[var(--muted-foreground)] leading-relaxed">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════════════════════════════════
                    THE METHOD SECTION
                   ══════════════════════════════════════════ */}
                <section className="py-20 lg:py-28 px-6 lg:px-8 bg-[var(--sage-50)] dark:bg-[var(--sage-50)]">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <motion.span {...fadeUp(0)} className="text-[var(--sage-500)] font-bold tracking-widest text-xs uppercase mb-3 block">How It Works</motion.span>
                            <motion.h2 {...fadeUp(0.1)} className="text-3xl lg:text-5xl font-black font-[var(--font-nunito)] mb-5 tracking-tight">The PetPal Method</motion.h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {methodSteps.map((step, i) => (
                                <motion.div
                                    key={step.title}
                                    {...fadeUp(0.1 + i * 0.1)}
                                    className="p-8 rounded-2xl bg-[var(--card)] shadow-md border border-[var(--border)]/50 card-lift text-center"
                                >
                                    <div className="w-16 h-16 mx-auto bg-[var(--accent)] rounded-full flex items-center justify-center mb-6 text-[var(--primary)]">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-black font-[var(--font-nunito)] mb-3">{step.title}</h3>
                                    <p className="text-[var(--muted-foreground)] leading-relaxed">{step.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* ══════════════════════════════════════════
                    FAQ SECTION
                   ══════════════════════════════════════════ */}
                <section className="py-20 lg:py-28 px-6 lg:px-8 bg-[var(--coral-50)] dark:bg-[var(--coral-50)]">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <motion.span {...fadeUp(0)} className="text-[var(--primary)] font-bold tracking-widest text-xs uppercase mb-3 block">FAQ</motion.span>
                            <motion.h2 {...fadeUp(0.1)} className="text-3xl lg:text-5xl font-black font-[var(--font-nunito)] mb-5 tracking-tight">Got questions?</motion.h2>
                            <motion.p {...fadeUp(0.2)} className="text-[var(--muted-foreground)] text-lg">We&apos;ve got answers. If you can&apos;t find what you&apos;re looking for, reach out to our support team.</motion.p>
                        </div>

                        <motion.div {...fadeUp(0.3)} className="bg-[var(--card)] rounded-2xl border border-[var(--border)]/50 p-6 lg:p-8 shadow-md">
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

                {/* ══════════════════════════════════════════
                    CTA SECTION
                   ══════════════════════════════════════════ */}
                <section className="py-20 lg:py-28 px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-[var(--primary)] to-[var(--coral-600)] p-10 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-[var(--primary)]/20"
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/10 rounded-full -translate-x-10 translate-y-10 blur-3xl" />

                        <div className="relative z-10">
                            <h2 className="text-3xl lg:text-6xl font-black font-[var(--font-nunito)] text-white mb-6 tracking-tight leading-tight">Ready to grow together?</h2>
                            <p className="text-white/80 text-lg lg:text-xl mb-10 max-w-2xl mx-auto">Start mastering your finances while raising your new best friend.</p>
                            <Link href={hasPets ? "/dashboard" : "/onboarding"}>
                                <Button className="bg-white text-[var(--primary)] px-10 py-5 rounded-full text-lg font-black hover:scale-[1.05] active:scale-95 transition-all shadow-xl h-auto">
                                    {hasPets ? "Open Dashboard" : "Create Your Pet Account"}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* ══════════════════════════════════════════
                FOOTER
               ══════════════════════════════════════════ */}
            <footer className="w-full bg-[var(--sage-50)] dark:bg-[var(--sage-50)] border-t border-[var(--border)]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                        {/* Col 1: Logo + tagline */}
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/favicon.svg"
                                        alt="PetPal Logo"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <span className="font-black text-xl font-(--font-nunito) text-foreground">
                                    Pet<span className="text-primary">Pal</span>
                                </span>
                            </div>
                            <p className="text-[var(--muted-foreground)] text-sm leading-relaxed max-w-xs">
                                Bridging the gap between financial responsibility and nurturing play.
                            </p>
                        </div>

                        {/* Col 2: Product links */}
                        <div>
                            <h4 className="font-bold text-sm mb-4 font-[var(--font-nunito)]">Product</h4>
                            <ul className="space-y-2.5">
                                <li><Link href="/#features" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Features</Link></li>
                                <li><Link href="/demo" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Demo</Link></li>
                            </ul>
                        </div>

                        {/* Col 3: Company links */}
                        <div>
                            <h4 className="font-bold text-sm mb-4 font-[var(--font-nunito)]">Company</h4>
                            <ul className="space-y-2.5">
                                <li><Link href="/privacy" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Privacy</Link></li>
                                <li><Link href="/terms" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Terms</Link></li>
                                <li><Link href="/support" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Support</Link></li>
                                <li><Link href="/careers" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Careers</Link></li>
                            </ul>
                        </div>

                        {/* Col 4: Newsletter */}
                        <div>
                            <h4 className="font-bold text-sm mb-4 font-[var(--font-nunito)]">Stay in the loop</h4>
                            <p className="text-[var(--muted-foreground)] text-sm mb-4">Get tips on pet care and financial literacy.</p>
                            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 px-4 py-2.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent"
                                    aria-label="Email for newsletter"
                                />
                                <Button
                                    type="submit"
                                    className="bg-[var(--primary)] hover:bg-[var(--coral-600)] text-white px-5 py-2.5 rounded-full font-bold text-sm h-auto shrink-0"
                                >
                                    Join
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Social + Copyright */}
                    <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-[var(--muted-foreground)] text-xs">
                            © {new Date().getFullYear()} PetPal. The Intellectual Playground.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors" aria-label="Twitter">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                            <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors" aria-label="Instagram">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                            <a href="#" className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors" aria-label="TikTok">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.18 8.18 0 004.77 1.52V7.01a4.84 4.84 0 01-1-.32z" /></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
