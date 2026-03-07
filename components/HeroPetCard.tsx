'use client';

import { motion } from 'framer-motion';
import { Heart, Zap, Smile, Shield, Coins, TrendingUp } from 'lucide-react';

const stats = [
    { label: 'Happiness', value: 92, color: '#f472b6', icon: Smile },
    { label: 'Energy', value: 78, color: '#60a5fa', icon: Zap },
    { label: 'Health', value: 85, color: '#34d399', icon: Heart },
    { label: 'Hunger', value: 65, color: '#fb923c', icon: Shield },
];

function StatBar({ label, value, color, icon: Icon, delay }: { label: string; value: number; color: string; icon: typeof Heart; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5, ease: 'easeOut' }}
            className="space-y-1.5"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Icon className="w-3 h-3" style={{ color }} />
                    <span className="text-xs font-semibold text-white/60">{label}</span>
                </div>
                <span className="text-xs font-black text-white/80">{value}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ delay: delay + 0.2, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${color}88, ${color})` }}
                />
            </div>
        </motion.div>
    );
}

export function HeroPetCard() {
    return (
        <div className="relative w-full h-full flex items-center justify-center select-none">
            {/* Subtle glow behind card */}
            <div className="absolute w-80 h-80 bg-blue-500/8 rounded-full blur-[80px]" />

            {/* Floating card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.3 }}
                className="relative z-10 w-full max-w-sm"
            >
                {/* Floating animation wrapper */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {/* Main card */}
                    <div
                        className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%)',
                            backdropFilter: 'blur(20px)',
                        }}
                    >
                        {/* Card header */}
                        <div className="px-6 pt-6 pb-4 border-b border-white/8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Your Companion</p>
                                    <h3 className="text-xl font-black text-white">Biscuit</h3>
                                </div>
                                {/* Health ring */}
                                <div className="relative w-14 h-14 flex items-center justify-center">
                                    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 56 56">
                                        <circle cx="28" cy="28" r="23" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
                                        <motion.circle
                                            cx="28" cy="28" r="23"
                                            stroke="#34d399"
                                            strokeWidth="4"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 23}`}
                                            initial={{ strokeDashoffset: 2 * Math.PI * 23 }}
                                            animate={{ strokeDashoffset: 2 * Math.PI * 23 * (1 - 0.85) }}
                                            transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
                                        />
                                    </svg>
                                    <span className="text-xs font-black text-emerald-400">85%</span>
                                </div>
                            </div>

                            {/* Pet emoji / avatar area */}
                            <div className="mt-4 flex items-center gap-3">
                                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner"
                                    style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    🐕
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span className="text-xs font-semibold text-emerald-400">Happy & Active</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {['Loyal', 'Playful', 'Golden'].map(tag => (
                                            <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 text-white/50" style={{ background: 'rgba(255,255,255,0.05)' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="px-6 py-4 space-y-3">
                            {stats.map((s, i) => (
                                <StatBar key={s.label} {...s} delay={0.5 + i * 0.1} />
                            ))}
                        </div>

                        {/* Footer: balance */}
                        <div className="px-6 pb-5">
                            <div className="rounded-2xl p-3 flex items-center justify-between"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(96,165,250,0.15)' }}>
                                        <Coins className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <span className="text-xs font-semibold text-white/50">Monthly Balance</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                                    <motion.span
                                        className="text-sm font-black text-white"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                    >
                                        $1,240
                                    </motion.span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Decorative orbiting dot */}
            <motion.div
                className="absolute w-2.5 h-2.5 rounded-full bg-blue-400/60 shadow-lg shadow-blue-400/30"
                animate={{
                    x: [80, 0, -80, 0, 80],
                    y: [0, -80, 0, 80, 0],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
            />
            <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400/50"
                animate={{
                    x: [-60, 0, 60, 0, -60],
                    y: [0, 60, 0, -60, 0],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{ top: '50%', left: '50%', translateX: '-50%', translateY: '-50%' }}
            />
        </div>
    );
}
