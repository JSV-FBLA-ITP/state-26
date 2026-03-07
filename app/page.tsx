'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import {
    Sparkles, PawPrint, ShieldCheck, TrendingUp,
    Heart, Zap, Star, ArrowRight, Github, LayoutDashboard
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { HeroCanvas } from '@/components/HeroCanvas';
import { fetchUserPets } from '@/lib/storage';

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
        color: 'from-blue-500/20 to-blue-500/5',
        border: 'hover:border-blue-500/50',
        iconBg: 'bg-blue-500/15',
        iconColor: 'text-blue-500',
    },
    {
        icon: ShieldCheck,
        title: 'Cloud Persistence',
        desc: 'Your pet lives safely in our Supabase-powered cloud. Pick up right where you left off, any device.',
        color: 'from-emerald-500/20 to-emerald-500/5',
        border: 'hover:border-emerald-500/50',
        iconBg: 'bg-emerald-500/15',
        iconColor: 'text-emerald-500',
    },
    {
        icon: TrendingUp,
        title: 'Growth & Finance',
        desc: 'Level up your companion while mastering real financial literacy skills that stay with you for life.',
        color: 'from-sky-500/20 to-sky-500/5',
        border: 'hover:border-sky-500/50',
        iconBg: 'bg-sky-500/15',
        iconColor: 'text-sky-500',
    },
];

const stats = [
    { label: 'Active pets', value: '12,400+', icon: PawPrint },
    { label: 'Happy users', value: '8,900+', icon: Heart },
    { label: 'Daily activities', value: '340k+', icon: Zap },
    { label: '5-star reviews', value: '4.9 / 5', icon: Star },
];

export default function LandingPage() {
    const [hasPets, setHasPets] = useState(false);
    const [petCount, setPetCount] = useState(0);
    const [firstPetName, setFirstPetName] = useState<string | null>(null);

    useEffect(() => {
        async function checkForPets() {
            try {
                const { data } = await fetchUserPets();
                if (data && data.length > 0) {
                    setHasPets(true);
                    setPetCount(data.length);
                    setFirstPetName(data[0]?.name || null);
                }
            } catch {
                // silently ignore — user simply has no pets yet
            }
        }
        checkForPets();
    }, []);

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
                        {hasPets ? (
                            <Link href="/dashboard">
                                <Button size="sm" className="font-semibold rounded-xl shadow-md shadow-primary/25 gap-1.5">
                                    <LayoutDashboard className="w-3.5 h-3.5" />
                                    My Pets
                                    {petCount > 1 && (
                                        <span className="ml-0.5 bg-primary-foreground/20 text-primary-foreground rounded-full text-[10px] font-black w-4 h-4 flex items-center justify-center">
                                            {petCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/onboarding">
                                <Button size="sm" className="font-semibold rounded-xl shadow-md shadow-primary/25">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="relative flex flex-col md:flex-row items-center justify-between px-6 pt-24 pb-20 md:pb-32 overflow-hidden max-w-7xl mx-auto w-full min-h-[90vh]">

                {/* Left Content Area */}
                <div className="flex-1 flex flex-col items-start text-left z-20 md:pr-10 w-full">
                    {/* pill badge */}
                    <motion.div {...fadeUp(0)}>
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/20 bg-primary/10 text-primary text-sm font-semibold mb-8 shadow-sm backdrop-blur-md">
                            <ShieldCheck className="w-4 h-4" />
                            Premier Financial Education
                        </div>
                    </motion.div>

                    {/* headline */}
                    <motion.h1
                        {...fadeUp(0.1)}
                        className="text-5xl sm:text-6xl md:text-7xl font-bold font-outfit tracking-tight leading-[1.05] mb-6 max-w-3xl text-foreground"
                    >
                        Nurture Your Pet, <span className="bg-linear-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">Master Your Money.</span>
                    </motion.h1>

                    {/* sub */}
                    <motion.p
                        {...fadeUp(0.2)}
                        className="text-lg md:text-xl text-muted-foreground/90 font-inter leading-relaxed max-w-xl mb-10"
                    >
                        PetPal is the first virtual pet simulator that turns financial literacy into a game. Earn, budget, and save to keep your digital companion happy and healthy.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center gap-4 mb-16 w-full sm:w-auto">
                        {hasPets ? (
                            <>
                                <Link href="/dashboard" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full sm:w-auto h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-base font-bold px-8 shadow-xl shadow-blue-500/25 transition-all gap-2 group">
                                        <LayoutDashboard className="w-5 h-5" />
                                        Continue{firstPetName ? ` with ${firstPetName}` : ' Your Journey'}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/onboarding" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 rounded-full border-border/50 text-base font-bold px-8 backdrop-blur-sm bg-background/5 hover:bg-white/5 transition-all gap-2">
                                        <PawPrint className="w-5 h-5" />
                                        Add New Pet
                                    </Button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link href="/onboarding" className="w-full sm:w-auto">
                                    <Button size="lg" className="w-full sm:w-auto h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-base font-bold px-8 shadow-xl shadow-blue-500/25 transition-all gap-2 group">
                                        Start Your Journey
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/demo" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 rounded-full border-border/50 text-base font-bold px-8 backdrop-blur-sm bg-background/5 hover:bg-white/5 transition-all">
                                        Watch Demo
                                    </Button>
                                </Link>
                            </>
                        )}
                    </motion.div>


                </div>

                {/* Right 3D Area */}
                <div className="flex-1 relative w-full h-[600px] md:min-h-[70vh] mt-16 md:mt-0 flex items-center justify-center">

                    {/* Glowing background behind the 3D Dog */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                        <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-500/20 rounded-full blur-[100px]" />
                        <div className="absolute w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-emerald-500/10 rounded-full blur-[80px] translate-x-20 translate-y-20" />
                    </div>

                    {/* The 3D Canvas */}
                    <HeroCanvas />



                </div>
            </section>

            {/* ── Feature cards ── */}
            <section className="px-6 pb-24 max-w-7xl mx-auto w-full relative z-10">
                <motion.div {...fadeUp(0)} className="text-center mb-16">
                    <p className="text-sm font-bold uppercase tracking-widest text-emerald-500 mb-3">Core Features</p>
                    <h2 className="text-3xl md:text-5xl font-bold font-outfit tracking-tight text-foreground">
                        Everything your pet needs
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {features.map(({ icon: Icon, title, desc, color, border, iconBg, iconColor }, i) => (
                        <motion.div
                            key={title}
                            {...fadeUp(i * 0.1)}
                            className={`relative p-8 rounded-[2rem] bg-card/40 backdrop-blur-xl border border-white/10 dark:border-white/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden group`}
                        >
                            {/* Accent bottom glow on hover */}
                            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                            <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center mb-6 shadow-inner`}>
                                <Icon className={`w-7 h-7 ${iconColor}`} />
                            </div>
                            <h3 className="text-xl font-bold font-outfit mb-3 text-foreground">{title}</h3>
                            <p className="text-muted-foreground font-inter text-sm leading-relaxed">{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Educational Bento Section ── */}
            <section className="px-6 py-24 max-w-7xl mx-auto w-full border-t border-border/50">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Left: Bento Image Grid */}
                    <div className="flex-1 w-full grid grid-cols-2 grid-rows-2 gap-4">
                        <div className="row-span-2 relative rounded-[2rem] overflow-hidden bg-muted group">
                            <Image
                                src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop"
                                alt="Cute Dog"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                        <div className="relative rounded-[2rem] bg-blue-500 p-8 flex flex-col justify-center overflow-hidden">
                            {/* Decorative background circle */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                            <ShieldCheck className="w-8 h-8 text-white mb-4" />
                            <h4 className="text-white font-bold font-outfit text-xl mb-1">Certified Learning</h4>
                            <p className="text-blue-100 text-sm font-inter">Curriculum aligned with national standards.</p>
                        </div>
                        <div className="relative rounded-[2rem] overflow-hidden bg-muted group">
                            <Image
                                src="https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=800&auto=format&fit=crop"
                                alt="Cute Cat"
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>
                    </div>

                    {/* Right: Checklist Area */}
                    <div className="flex-1 w-full">
                        <h2 className="text-4xl md:text-5xl font-bold font-outfit tracking-tight mb-6">
                            Financial Literacy<br />Made Fun
                        </h2>
                        <p className="text-lg text-muted-foreground font-inter mb-10 leading-relaxed max-w-xl">
                            We believe that financial education shouldn&apos;t be boring. By tying financial concepts to the well-being of a virtual pet, students develop an emotional connection to their financial decisions.
                        </p>

                        <div className="space-y-5 mb-10">
                            {[
                                "Understand the difference between needs and wants",
                                "Learn the basics of interest and inflation",
                                "Practice real-world budgeting scenarios",
                                "Develop long-term financial planning skills",
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-4"
                                >
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    </div>
                                    <span className="font-semibold font-inter">{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        <Button size="lg" className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 h-14 w-full sm:w-auto shadow-lg shadow-emerald-500/20">
                            Explore Curriculum
                        </Button>
                    </div>
                </div>
            </section>



            {/* ── Footer ── */}
            <footer className="border-t border-border/50 px-6 py-12 mt-auto text-center flex flex-col items-center">
                <div className="flex items-center gap-2 font-bold font-outfit text-foreground text-xl mb-6">
                    <PawPrint className="w-6 h-6 text-blue-500" />
                    PetPal
                </div>
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground font-semibold font-inter mb-8">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
                </div>
                <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PetPal. All rights reserved.</p>
            </footer>

        </div>
    );
}