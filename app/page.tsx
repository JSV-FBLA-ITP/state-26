'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import {
    LayoutDashboard, ArrowRight, PlayCircle, Star, Zap, 
    ShieldCheck, Heart, TrendingUp, Sparkles, CloudCheck,
    CheckCircle2, Info, PawPrint
} from 'lucide-react';
import { HeroCanvas } from '@/components/HeroCanvas';
import { fetchUserPets } from '@/lib/storage';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: 'easeOut' as const, delay },
});

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
                // silently ignore
            }
        }
        checkForPets();
    }, []);

    return (
        <div className="min-h-screen bg-[#f8f9ff] dark:bg-slate-950 text-[#0b1c30] dark:text-slate-100 font-inter antialiased selection:bg-[#d8e2ff] selection:text-[#001a42] overflow-x-hidden">
            <main>
                {/* ── Hero Section ── */}
                <section id="hero" className="relative px-8 py-20 lg:py-32 overflow-hidden min-h-[90vh] flex items-center">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 w-full">
                        
                        <div className="flex-1 text-center lg:text-left z-10">
                            <motion.h1 
                                {...fadeUp(0)}
                                className="text-5xl lg:text-7xl font-extrabold font-outfit leading-[1.1] tracking-tight mb-8"
                            >
                                Nurture Your Pet, <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-[#0058be] to-[#006c49]">Master Your Money.</span>
                            </motion.h1>
                            
                            <motion.p 
                                {...fadeUp(0.1)}
                                className="text-lg text-slate-600 dark:text-slate-400 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
                            >
                                Step into a vibrant playground where your pet&apos;s happiness is the key to your financial future. Learn wealth management through play, not spreadsheets.
                            </motion.p>
                            
                            <motion.div 
                                {...fadeUp(0.2)}
                                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                            >
                                <Link href={hasPets ? "/dashboard" : "/onboarding"} className="w-full sm:w-auto">
                                    <Button className="w-full sm:w-auto bg-linear-to-br from-[#0058be] to-[#2170e4] text-white px-10 py-4 rounded-full text-lg font-bold shadow-2xl shadow-blue-500/30 hover:scale-105 transition-transform h-auto">
                                        {hasPets ? `Continue with ${firstPetName || 'Pet'}` : "Start Your Journey"}
                                    </Button>
                                </Link>
                                <Link href="/demo" className="w-full sm:w-auto">
                                    <Button variant="ghost" className="w-full sm:w-auto bg-[#dce9ff] dark:bg-white/5 text-[#0058be] dark:text-blue-400 px-10 py-4 rounded-full text-lg font-bold hover:bg-[#d3e4fe] transition-colors flex items-center justify-center gap-2 h-auto">
                                        <PlayCircle className="w-6 h-6" />
                                        Watch Demo
                                    </Button>
                                </Link>
                            </motion.div>
                        </div>

                        <div className="flex-1 relative w-full aspect-square lg:aspect-auto h-[500px] lg:h-[600px]">
                            {/* Decorative Background Elements */}
                            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#6cf8bb]/20 blur-3xl rounded-full -z-10" />
                            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#2170e4]/10 blur-3xl rounded-full -z-10" />
                            
                            {/* 3D Canvas Box */}
                            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl transition-transform duration-700 hover:rotate-1 group bg-white/50 dark:bg-black/5 flex items-center justify-center border border-white/20">
                                <HeroCanvas />
                                
                                {/* Overlay Floating Card from Stitch Design */}
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, x: -20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute bottom-10 left-10 z-20 lg:w-64 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl p-6 rounded-3xl shadow-2xl border border-white/20 hidden md:block"
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-[#6cf8bb] rounded-2xl flex items-center justify-center text-[#005236]">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-[#424754] dark:text-slate-400 mb-0.5">Daily Savings</p>
                                            <p className="text-xl font-black text-[#0b1c30] dark:text-white">+$24.50</p>
                                        </div>
                                    </div>
                                    <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: "75%" }}
                                            transition={{ delay: 1.2, duration: 1 }}
                                            className="h-full bg-[#006c49] rounded-full" 
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── Feature Cards section (asymmetric grid) ── */}
                <section id="features" className="bg-[#eff4ff] dark:bg-slate-900/50 py-24 px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <motion.span {...fadeUp(0)} className="text-[#0058be] font-black tracking-widest text-xs uppercase mb-4 block">Platform Excellence</motion.span>
                            <motion.h2 {...fadeUp(0.1)} className="text-4xl lg:text-6xl font-extrabold font-outfit mb-6 tracking-tight">Everything your pet needs</motion.h2>
                            <motion.p {...fadeUp(0.2)} className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed font-medium">Our features are designed to create a seamless loop between virtual care and real-world intelligence.</motion.p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                            {/* Feature 1: AI Customization */}
                            <motion.div 
                                {...fadeUp(0.3)}
                                className="md:col-span-4 group p-10 rounded-3xl bg-white dark:bg-slate-800 shadow-xl shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300 border border-black/5 dark:border-white/5"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-[#eff4ff] dark:bg-blue-500/10 flex items-center justify-center text-[#0058be] mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-black font-outfit mb-4">AI Customization</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8 font-medium italic">Create a pet as unique as your financial goals. Our AI adapts their personality to your learning style.</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-4 py-1.5 bg-[#dce9ff] dark:bg-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0058be] dark:text-blue-300">Dynamic EQ</span>
                                    <span className="px-4 py-1.5 bg-[#dce9ff] dark:bg-blue-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-[#0058be] dark:text-blue-300">Custom Traits</span>
                                </div>
                            </motion.div>

                            {/* Feature 2: Cloud Persistence */}
                            <motion.div 
                                {...fadeUp(0.4)}
                                className="md:col-span-8 group p-10 rounded-3xl bg-[#d3e4fe] dark:bg-blue-900/30 shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-10 items-center overflow-hidden border border-white/20"
                            >
                                <div className="flex-1">
                                    <div className="w-16 h-16 rounded-2xl bg-[#0058be] text-white flex items-center justify-center mb-8 group-hover:rotate-12 transition-transform shadow-lg shadow-blue-500/30">
                                        <CloudCheck className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black font-outfit mb-4">Cloud Persistence</h3>
                                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">Your progress and your pet&apos;s growth are synced across all devices. Never miss a feeding or a market update.</p>
                                </div>
                                <div className="flex-1 w-full translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                                    <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 bg-slate-200">
                                        <Image 
                                            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop" 
                                            alt="Dashboard" 
                                            fill 
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-blue-500/20 backdrop-blur-[1px]" />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Feature 3: Growth & Finance */}
                            <motion.div 
                                {...fadeUp(0.5)}
                                className="md:col-span-12 group p-10 lg:p-16 rounded-[3rem] bg-linear-to-br from-[#006c49] to-[#002113] text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl"
                            >
                                <div className="flex-1">
                                    <h3 className="text-3xl lg:text-5xl font-black font-outfit mb-6">Growth & Finance</h3>
                                    <p className="text-emerald-200/80 leading-relaxed mb-10 text-xl font-medium">As your pet grows, so does your financial portfolio. We tie virtual pet levels directly to your grasp of complex economic concepts.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                                            <TrendingUp className="w-6 h-6 mb-3 text-emerald-400" />
                                            <p className="font-black text-sm uppercase tracking-wider">Portfolio Link</p>
                                        </div>
                                        <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                                            <Star className="w-6 h-6 mb-3 text-yellow-400" />
                                            <p className="font-black text-sm uppercase tracking-wider">Growth Metrics</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1 relative w-full">
                                    <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 backdrop-blur-3xl shadow-inner">
                                        <div className="flex items-center justify-between mb-6">
                                            <p className="font-black uppercase tracking-[0.2em] text-[10px] opacity-60">Investment Health</p>
                                            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-2">
                                            <span className="text-7xl font-black font-outfit leading-none">94</span>
                                            <span className="text-3xl font-black opacity-60 font-outfit">%</span>
                                        </div>
                                        <div className="w-full h-4 bg-white/10 rounded-full mt-6 overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: "94%" }}
                                                transition={{ duration: 1.5, delay: 0.5 }}
                                                className="h-full bg-linear-to-r from-emerald-500 to-teal-400 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)]" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ── Educational Section ── */}
                <section id="education" className="py-24 px-8 bg-white dark:bg-slate-950 overflow-hidden">
                    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:w-1/2 relative"
                        >
                            <div className="absolute -inset-10 bg-emerald-500/10 blur-[100px] rounded-full" />
                            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)]">
                                <Image 
                                    src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200&auto=format&fit=crop" 
                                    alt="Financial charts" 
                                    width={800} 
                                    height={1000} 
                                    className="w-full h-auto"
                                />
                                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-sm font-black uppercase tracking-[0.3em] mb-2 opacity-80 font-outfit">Certified Learning</p>
                                    <h4 className="text-2xl font-bold font-outfit">Financial Curriculum Pro</h4>
                                </div>
                            </div>
                        </motion.div>

                        <div className="lg:w-1/2">
                            <motion.span {...fadeUp(0)} className="text-[#006c49] font-black tracking-widest text-xs uppercase mb-4 block">Learning Reimagined</motion.span>
                            <motion.h2 {...fadeUp(0.1)} className="text-4xl lg:text-6xl font-extrabold font-outfit mb-8 leading-tight tracking-tight">Financial Literacy Made Fun</motion.h2>
                            <motion.p {...fadeUp(0.2)} className="text-slate-600 dark:text-slate-400 mb-10 text-xl leading-relaxed font-medium">
                                We transform abstract financial concepts into tangible pet needs. When you understand why your pet needs a &quot;reserve fund,&quot; you&apos;re learning the basics of emergency savings in the real world.
                            </motion.p>
                            
                            <div className="space-y-8">
                                {[
                                    { title: "Understand needs vs wants", desc: "Prioritize pet medicine over premium cosmetics to learn essential budgeting.", icon: Heart },
                                    { title: "Learn interest and inflation", desc: "Watch how the 'PetCoin' marketplace fluctuates based on simulator supply.", icon: TrendingUp },
                                    { title: "Risk Management", desc: "Insure your pet against unexpected virtual 'accidents' to understand premiums.", icon: ShieldCheck }
                                ].map((item, i) => (
                                    <motion.div 
                                        key={item.title} 
                                        {...fadeUp(0.3 + i * 0.1)}
                                        className="flex items-start gap-6 group"
                                    >
                                        <div className="mt-1 w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-[#006c49] dark:text-emerald-400 group-hover:scale-110 transition-transform">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-xl mb-1 font-outfit">{item.title}</h4>
                                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── CTA Section ── */}
                <section className="py-24 px-8">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="max-w-5xl mx-auto rounded-[3rem] bg-linear-to-br from-[#0058be] to-[#2170e4] p-12 lg:p-24 text-center relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,88,190,0.5)]"
                    >
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-20 -translate-y-20 blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-4xl lg:text-7xl font-extrabold font-outfit text-white mb-8 tracking-tighter leading-none">Ready to grow together?</h2>
                            <p className="text-blue-100 text-xl lg:text-2xl mb-12 max-w-2xl mx-auto font-medium">Join 50,000+ young earners who are mastering their finances while raising their best friends.</p>
                            <Link href={hasPets ? "/dashboard" : "/onboarding"}>
                                <Button className="bg-white text-[#0058be] px-12 py-8 rounded-full text-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-2xl h-auto">
                                    {hasPets ? "Open Dashboard" : "Create Your Pet Account"}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            {/* ── Footer ── */}
            <footer className="w-full bg-[#f8f9ff] dark:bg-slate-950 border-t border-black/5 dark:border-white/5">
                <div className="max-w-7xl mx-auto px-12 py-20 flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex flex-col gap-6 text-center md:text-left items-center md:items-start">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10">
                                <Image 
                                    src="/logo.png" 
                                    alt="PetPal Logo" 
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="font-outfit font-black text-[#0b1c30] dark:text-white text-2xl">PetPal</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-xs leading-relaxed">
                            Bridging the gap between financial responsibility and nurturing play.
                        </p>
                    </div>
                    
                    <div className="flex gap-10 flex-wrap justify-center">
                        <Link href="/privacy" className="text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-widest hover:text-[#0058be] transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-widest hover:text-[#0058be] transition-colors">Terms</Link>
                        <Link href="/support" className="text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-widest hover:text-[#0058be] transition-colors">Support</Link>
                        <Link href="/careers" className="text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-widest hover:text-[#0058be] transition-colors">Careers</Link>
                    </div>
                </div>
                
                <div className="px-12 pb-12 text-center text-slate-400 dark:text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">
                    © {new Date().getFullYear()} PetPal. The Intellectual Playground.
                </div>
            </footer>
        </div>
    );
}
