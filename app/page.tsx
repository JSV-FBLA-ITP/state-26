'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import {
    Sparkles, PawPrint, ShieldCheck, TrendingUp,
    Heart, Zap, Star, ArrowRight, Github
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

const features = [
    {
        icon: PawPrint,
        title: 'AI Customization',
        desc: 'Generate unique pet appearances powered by stable diffusion. Every companion is truly one of a kind.',
        color: 'from-violet-500/20 to-violet-500/5',
        border: 'hover:border-violet-500/50',
        iconBg: 'bg-violet-500/15',
        iconColor: 'text-violet-500',
    },
    {
        icon: ShieldCheck,
        title: 'Cloud Persistence',
        desc: 'Your pet lives safely in our Supabase-powered cloud. Pick up right where you left off, any device.',
        color: 'from-fuchsia-500/20 to-fuchsia-500/5',
        border: 'hover:border-fuchsia-500/50',
        iconBg: 'bg-fuchsia-500/15',
        iconColor: 'text-fuchsia-500',
    },
    {
        icon: TrendingUp,
        title: 'Growth & Finance',
        desc: 'Level up your companion while mastering real financial literacy skills that stay with you for life.',
        color: 'from-cyan-500/20 to-cyan-500/5',
        border: 'hover:border-cyan-500/50',
        iconBg: 'bg-cyan-500/15',
        iconColor: 'text-cyan-500',
    },
];

const stats = [
    { label: 'Active pets', value: '12,400+', icon: PawPrint },
    { label: 'Happy users', value: '8,900+', icon: Heart },
    { label: 'Daily activities', value: '340k+', icon: Zap },
    { label: '5-star reviews', value: '4.9 / 5', icon: Star },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">

            {/* ── Sticky glassmorphic nav ── */}
            <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                            <PawPrint className="w-4 h-4 text-primary-foreground" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">PetPal</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/learn-more" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                            How it Works
                        </Link>
                        <Link href="/login">
                            <Button variant="ghost" size="sm" className="font-semibold">Login</Button>
                        </Link>
                        <Link href="/onboarding">
                            <Button size="sm" className="font-semibold rounded-xl shadow-md shadow-primary/25">
                                Get Started
                            </Button>
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 pt-24 pb-20 overflow-hidden">

                {/* glowing orbs */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-violet-500/25 blur-[120px] animate-blob" />
                    <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-fuchsia-500/20 blur-[100px] animate-blob animation-delay-2000" />
                    <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-500/20 blur-[100px] animate-blob animation-delay-4000" />
                </div>

                {/* pill badge */}
                <motion.div {...fadeUp(0)}>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold mb-8 shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        Modern Virtual Pet Care — Now in Beta
                    </div>
                </motion.div>

                {/* headline */}
                <motion.h1
                    {...fadeUp(0.1)}
                    className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-6 max-w-3xl"
                >
                    Your New Best Friend{' '}
                    <span className="gradient-text block sm:inline">Awaits in the Cloud.</span>
                </motion.h1>

                {/* sub */}
                <motion.p
                    {...fadeUp(0.2)}
                    className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mb-10"
                >
                    PetPal blends the nostalgia of retro virtual pets with modern AI and
                    financial literacy tools. Adopt, customize, and grow with your companion.
                </motion.p>

                {/* CTAs */}
                <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center gap-3 mb-20">
                    <Link href="/onboarding">
                        <Button size="lg" className="rounded-2xl text-base font-bold px-8 shadow-xl shadow-primary/30 gap-2 group">
                            Start Your Journey
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </Link>
                    <Link href="/learn-more">
                        <Button variant="outline" size="lg" className="rounded-2xl text-base font-bold px-8 backdrop-blur-sm bg-background/50">
                            How It Works
                        </Button>
                    </Link>
                </motion.div>

                {/* floating pet emoji */}
                <motion.div
                    {...fadeUp(0.4)}
                    className="animate-float text-8xl mb-20 select-none drop-shadow-2xl"
                    aria-hidden
                >
                    🐾
                </motion.div>

                {/* stat bar */}
                <motion.div
                    {...fadeUp(0.5)}
                    className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    {stats.map(({ label, value, icon: Icon }) => (
                        <div
                            key={label}
                            className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-card border border-border/60 shadow-sm"
                        >
                            <Icon className="w-5 h-5 text-primary mb-1" />
                            <span className="text-2xl font-black tracking-tight">{value}</span>
                            <span className="text-xs text-muted-foreground font-medium">{label}</span>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ── Feature cards ── */}
            <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
                <motion.div {...fadeUp(0)} className="text-center mb-14">
                    <p className="text-sm font-bold uppercase tracking-widest text-primary mb-3">Why PetPal</p>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">Everything your pet needs</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {features.map(({ icon: Icon, title, desc, color, border, iconBg, iconColor }, i) => (
                        <motion.div
                            key={title}
                            {...fadeUp(i * 0.1)}
                            className={`relative p-7 rounded-3xl bg-gradient-to-br ${color} border border-border/50 ${border} transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden group`}
                        >
                            <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center mb-5`}>
                                <Icon className={`w-6 h-6 ${iconColor}`} />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="px-6 pb-24 max-w-6xl mx-auto w-full">
                <motion.div
                    {...fadeUp(0)}
                    className="relative rounded-3xl overflow-hidden p-12 text-center bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 shadow-2xl shadow-violet-500/30"
                >
                    {/* subtle inner noise / texture overlay */}
                    <div className="absolute inset-0 bg-white/5" />
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">
                            Ready to meet your companion?
                        </h2>
                        <p className="text-white/80 text-lg mb-8 max-w-md mx-auto">
                            Join thousands of players already raising their virtual pets. It only takes 30 seconds.
                        </p>
                        <Link href="/onboarding">
                            <Button
                                size="lg"
                                className="rounded-2xl bg-white text-violet-700 hover:bg-white/90 font-bold text-base px-10 shadow-xl gap-2 group"
                            >
                                Adopt Now — It&apos;s Free
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ── Footer ── */}
            <footer className="border-t border-border/50 px-6 py-8 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 font-bold text-foreground">
                        <PawPrint className="w-4 h-4 text-primary" />
                        PetPal
                    </div>
                    <p>© {new Date().getFullYear()} PetPal. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link href="/learn-more" className="hover:text-foreground transition-colors">How it Works</Link>
                        <Link href="/login" className="hover:text-foreground transition-colors">Login</Link>
                        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                            <Github className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </footer>

        </div>
    );
}