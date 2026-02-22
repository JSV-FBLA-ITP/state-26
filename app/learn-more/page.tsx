'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
    BrainCircuit,
    ShieldCheck,
    TrendingUp,
    Globe,
    ArrowRight,
    PawPrint,
} from 'lucide-react';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

const features = [
    {
        icon: BrainCircuit,
        title: 'AI-Driven Personality',
        desc: 'Every pet is uniquely generated using stable diffusion and custom ML models that grow and react based on your real interaction data.',
        gradient: 'from-yellow/20 to-yellow/5',
        border: 'hover:border-yellow/50',
        iconBg: 'bg-yellow/15',
        iconColor: 'text-yellow',
    },
    {
        icon: ShieldCheck,
        title: 'Enterprise Security',
        desc: 'Built on Supabase\'s cloud infrastructure with row-level security and real-time database synchronization keeping your data safe.',
        gradient: 'from-emerald-500/20 to-emerald-500/5',
        border: 'hover:border-emerald-500/50',
        iconBg: 'bg-emerald-500/15',
        iconColor: 'text-emerald-500',
    },
    {
        icon: TrendingUp,
        title: 'Financial Education',
        desc: "Learn real-world budgeting, compound interest, and expense tracking. Managing your pet's health requires mastering your own financial goals.",
        gradient: 'from-violet-500/20 to-violet-500/5',
        border: 'hover:border-violet-500/50',
        iconBg: 'bg-violet-500/15',
        iconColor: 'text-violet-500',
    },
    {
        icon: Globe,
        title: 'Cloud Persistence',
        desc: 'Access your pet journey from any device. Our architecture ensures zero-latency state management across the globe.',
        gradient: 'from-cyan-500/20 to-cyan-500/5',
        border: 'hover:border-cyan-500/50',
        iconBg: 'bg-cyan-500/15',
        iconColor: 'text-cyan-500',
    },
];

export default function LearnMorePage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                            <PawPrint className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">PetPal</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/onboarding">
                            <Button size="sm" className="font-semibold rounded-xl shadow-md shadow-primary/25">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1">
                {/* Hero */}
                <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 -z-10">
                        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-violet-500/20 blur-[120px] animate-blob" />
                        <div className="absolute top-20 -right-20 w-[300px] h-[300px] rounded-full bg-fuchsia-500/15 blur-[100px] animate-blob animation-delay-2000" />
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <motion.div {...fadeUp(0)}>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-8">
                                <PawPrint className="w-3.5 h-3.5" />
                                Deep Dive
                            </div>
                        </motion.div>
                        <motion.h1
                            {...fadeUp(0.1)}
                            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.05]"
                        >
                            The Future of{' '}
                            <span className="gradient-text">Pet Ownership.</span>
                        </motion.h1>
                        <motion.p
                            {...fadeUp(0.2)}
                            className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10"
                        >
                            PetPal isn&apos;t just a game. It&apos;s a professional-grade simulation designed
                            to teach financial literacy through the responsibility of virtual pet care.
                        </motion.p>
                        <motion.div {...fadeUp(0.3)}>
                            <Link href="/onboarding">
                                <Button size="lg" className="rounded-2xl font-bold px-8 gap-2 shadow-xl shadow-primary/30 group">
                                    Start for Free
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </section>

                {/* Feature Grid */}
                <section className="px-6 pb-24">
                    <div className="max-w-6xl mx-auto">
                        <motion.div {...fadeUp(0)} className="text-center mb-14">
                            <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Under the hood</p>
                            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Built for the long game</h2>
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {features.map(({ icon: Icon, title, desc, gradient, border, iconBg, iconColor }, i) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, ease: 'easeOut' }}
                                    className={`p-8 rounded-[2rem] bg-linear-to-br ${gradient} border border-border/50 ${border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group`}
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <Icon className={`w-7 h-7 ${iconColor}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 pb-24">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ ease: 'easeOut' }}
                            className="relative rounded-3xl overflow-hidden p-12 text-center bg-linear-to-br from-violet-500 via-fuchsia-500 to-cyan-500 shadow-2xl shadow-violet-500/30"
                        >
                            <div className="absolute inset-0 bg-white/5" />
                            <div className="relative z-10">
                                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                                    Ready to adopt?
                                </h2>
                                <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                                    Join thousands of others in the next generation of virtual companions.
                                </p>
                                <Link href="/onboarding">
                                    <Button
                                        size="lg"
                                        className="rounded-2xl bg-white text-violet-700 hover:bg-white/90 font-bold text-base px-10 shadow-xl gap-2 group"
                                    >
                                        Begin Onboarding
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border/50 px-6 py-8">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                        <PawPrint className="w-4 h-4 text-primary" />
                        PetPal
                    </div>
                    <p>© {new Date().getFullYear()} PetPal. All rights reserved.</p>
                    <Link href="/" className="hover:text-foreground transition-colors">← Back to Home</Link>
                </div>
            </footer>
        </div>
    );
}
