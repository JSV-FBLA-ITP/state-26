'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, PawPrint, ShieldCheck, TrendingUp } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            {/* Top Navigation */}
            <nav className="absolute top-0 w-full z-50 px-8 py-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="font-black text-2xl tracking-tighter text-primary">PetPal</div>
                    <div className="flex items-center gap-6">
                        <Link href="/learn-more" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                            How it Works
                        </Link>
                        <Link href="/login" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                            Login
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </nav>

            {/* Background Blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10 max-w-3xl"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Modern Virtual Pet Care</span>
                </div>

                <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-primary via-primary/80 to-primary/60">
                    Your New Best Friend <br /> Awaits in the Cloud.
                </h1>

                <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                    PetPal combines the nostalgia of retro virtual pets with modern AI
                    and professional financial literacy tools. Adopt, customize, and grow with your companion.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="/onboarding">
                        <Button size="xl" className="rounded-2xl text-lg font-semibold shadow-lg shadow-primary/25 px-8">
                            Start Your Journey
                        </Button>
                    </Link>
                    <Link href="/learn-more">
                        <Button variant="outline" size="xl" className="rounded-2xl text-lg font-semibold bg-white/5 backdrop-blur-sm">
                            Learn More
                        </Button>
                    </Link>
                </div>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    {[
                        { icon: PawPrint, title: 'AI Customization', desc: 'Generate unique pet appearances with stable diffusion.' },
                        { icon: ShieldCheck, title: 'Cloud Persistence', desc: 'Your pet stays safe in our Supabase-powered cloud.' },
                        { icon: TrendingUp, title: 'Growth & Finance', desc: 'Learn financial literacy while managing pet care.' },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="p-6 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-colors text-left"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground text-sm">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}