'use client';

import { motion } from 'framer-motion';
import {
    Heart, Coins, Calendar, Shield, Utensils, Zap, GraduationCap, PawPrint, Sparkles
} from 'lucide-react';

const guideSteps = [
    {
        icon: Heart,
        title: 'The Golden Rules of Happiness',
        desc: 'Happiness is your pet\'s primary stat. Interactions like playing and treats boost it, but it decays over time. Keep it above 50% for best results.',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        num: '01',
    },
    {
        icon: Coins,
        title: 'Financial Responsibility',
        desc: 'Every action has a cost. Balance your budget to ensure you can afford food and medical care. Use the Financial Quiz to earn bonus cash.',
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        num: '02',
    },
    {
        icon: Calendar,
        title: 'The Monthly Journey',
        desc: 'Each game cycle lasts 12 virtual months. Complete required monthly actions to advance. Missing them has consequences for your pet\'s well-being.',
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
        border: 'border-violet-500/20',
        num: '03',
    },
];

const tips = [
    { icon: Zap, label: 'Energy Reserves', desc: "Don't let energy hit zero or your pet will fall ill, requiring expensive treatments.", color: 'text-yellow' },
    { icon: GraduationCap, label: 'Daily Quizzes', desc: 'The Financial Quiz is the easiest way to earn extra cash for upgrades.', color: 'text-amber-500' },
    { icon: PawPrint, label: 'Switching Pets', desc: "You can manage multiple pets. Check 'Lives' to balance your collective.", color: 'text-fuchsia-500' },
    { icon: Utensils, label: 'Market Timing', desc: 'Check the shop for multipliers — they are permanent stat investments.', color: 'text-violet-500' },
];

export default function HowToPlayPage() {
    return (
        <div className="p-6 md:p-10 max-w-4xl mx-auto pb-24">
            {/* Header */}
            <header className="text-center mb-16 pt-8">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-sm mb-6"
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    Player&apos;s Manual v1.0
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-black mb-4 tracking-tight"
                >
                    How to <span className="gradient-text">PetPal.</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed"
                >
                    Master virtual companionship and financial excellence in three core principles.
                </motion.p>
            </header>

            {/* Guide Steps */}
            <div className="space-y-6 mb-16">
                {guideSteps.map((step, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex flex-col sm:flex-row gap-6 p-7 rounded-3xl border ${step.border} ${step.bg}`}
                    >
                        <div className="flex items-center sm:items-start gap-4 shrink-0">
                            <div className={`w-14 h-14 rounded-2xl ${step.bg} border ${step.border} flex items-center justify-center`}>
                                <step.icon className={`w-7 h-7 ${step.color}`} />
                            </div>
                            <span className={`text-4xl font-black ${step.color} opacity-30 sm:hidden`}>{step.num}</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-xs font-black uppercase tracking-widest ${step.color} opacity-60 hidden sm:block`}>{step.num}</span>
                                <h3 className="text-xl font-black">{step.title}</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Quick Tips */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-3xl bg-card border border-border/50 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -mr-24 -mt-24" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-primary" />
                        </div>
                        <h2 className="text-2xl font-black">Quick Tips</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`w-7 h-7 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 mt-0.5`}>
                                    <tip.icon className={`w-4 h-4 ${tip.color}`} />
                                </div>
                                <div>
                                    <h4 className={`font-black text-base ${tip.color}`}>{tip.label}</h4>
                                    <p className="text-muted-foreground text-sm leading-relaxed mt-0.5">{tip.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
