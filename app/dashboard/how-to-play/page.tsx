'use client';

import { motion } from 'framer-motion';
import {
    Heart,
    Zap,
    Utensils,
    Coffee,
    Coins,
    Gamepad2,
    Calendar,
    Sparkles,
    Shield
} from 'lucide-react';

const guideSteps = [
    {
        icon: Heart,
        title: "The Golden Rules of Happiness",
        desc: "Happiness is your pet's primary stat. Interactions like playing and treats boost it, but it decays over time.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        icon: Coins,
        title: "Financial Responsibility",
        desc: "Every action has a cost. Balance your budget to ensure you can afford food and medical care.",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        icon: Calendar,
        title: "The Monthly Journey",
        desc: "Each game cycle lasts 12 virtual months. Complete required actions each month to succeed.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    }
];

export default function HowToPlayPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto pb-24">
            <header className="text-center mb-20 pt-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6"
                >
                    <Sparkles className="w-4 h-4" />
                    Player's Manual v1.0
                </motion.div>
                <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">How to PetPal.</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    Master the art of virtual companionship and financial excellence in three simple steps.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-12 mb-24">
                {guideSteps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col md:flex-row gap-8 items-center md:items-start"
                    >
                        <div className={`w-20 h-20 shrink-0 rounded-[2rem] ${step.bg} flex items-center justify-center`}>
                            <step.icon className={`w-10 h-10 ${step.color}`} />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="text-3xl font-black mb-4">{step.title}</h3>
                            <p className="text-lg text-muted-foreground leading-relaxed">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <section className="p-10 rounded-[3rem] bg-card border-2 border-border/50 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-primary" />
                        Quick Tips
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            { label: "Energy Reserves", desc: "Don't let energy hit zero or your pet will fall ill, requiring expensive treatments." },
                            { label: "Market Timing", desc: "Check the shop daily for multipliers. They are permanent investments." },
                            { label: "Daily Quizzes", desc: "The Financial Quiz is the easiest way to earn extra cash for upgrades." },
                            { label: "Switching Pets", desc: "You can manage multiple pets. Check 'My Pets' to balance your collective." },
                        ].map((tip, i) => (
                            <div key={i} className="space-y-2">
                                <h4 className="font-black text-lg text-primary">{tip.label}</h4>
                                <p className="text-muted-foreground leading-relaxed">{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32" />
            </section>
        </div>
    );
}
