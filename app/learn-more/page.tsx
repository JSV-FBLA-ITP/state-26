'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
    Sparkles,
    ShieldCheck,
    TrendingUp,
    BrainCircuit,
    Smartphone,
    Globe,
    ArrowRight,
    ChevronLeft
} from 'lucide-react';

export default function LearnMorePage() {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <ChevronLeft className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">PetPal</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Link href="/onboarding">
                            <Button className="rounded-xl font-bold">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Section */}
                    <header className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
                                The Future of <br />Pet Ownership.
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                PetPal isn't just a game. It's a professional-grade simulation designed to teach
                                financial literacy through the responsibility of virtual pet care.
                            </p>
                        </motion.div>
                    </header>

                    {/* Deep Dive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
                        {[
                            {
                                icon: BrainCircuit,
                                title: "AI-Driven Personality",
                                desc: "Every pet is uniquely generated using stable diffusion and custom ML models. Your companion grows and reacts based on real interaction data.",
                                color: "bg-yellow/10 text-yellow"
                            },
                            {
                                icon: ShieldCheck,
                                title: "Enterprise Security",
                                desc: "Built on Supabase's cloud infrastructure, your pet's data is secured with row-level security and real-time database synchronization.",
                                color: "bg-emerald-500/10 text-emerald-500"
                            },
                            {
                                icon: TrendingUp,
                                title: "Financial Education",
                                desc: "Learn real-world budgeting, compound interest, and expense tracking. Managing your pet's health requires mastering your own financial goals.",
                                color: "bg-primary/10 text-primary"
                            },
                            {
                                icon: Globe,
                                title: "Cloud Persistence",
                                desc: "Access your pet journey from any device. Our architecture ensures zero-latency state management across the globe.",
                                color: "bg-indigo-500/10 text-indigo-500"
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 rounded-[2.5rem] bg-card border border-border/50 hover:border-primary/50 transition-all group"
                            >
                                <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <feature.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="rounded-[3rem] bg-linear-to-br from-primary/20 via-background to-background border-2 border-primary/20 p-12 text-center"
                    >
                        <Sparkles className="w-12 h-12 text-primary mx-auto mb-6" />
                        <h2 className="text-4xl font-black mb-4">Ready to adopt?</h2>
                        <p className="text-lg text-muted-foreground mb-8">Join thousands of others in the next generation of virtual companions.</p>
                        <Link href="/onboarding">
                            <Button size="xl" className="rounded-2xl px-12 font-bold group">
                                Begin Onboarding
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
