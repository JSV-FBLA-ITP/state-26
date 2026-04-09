'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';

export function HeroCanvas() {
    return (
        <div className="w-full h-full min-h-[500px] md:min-h-[700px] relative z-10 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    y: [0, -20, 0],
                }}
                transition={{ 
                    opacity: { duration: 1 },
                    scale: { duration: 1 },
                    y: { 
                        duration: 4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }
                }}
                className="relative w-full aspect-square max-w-[500px]"
            >
                {/* Background Glow */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
                
                <div className="relative w-full h-full rounded-[3rem] overflow-hidden border-8 border-white shadow-2xl bg-white/50 backdrop-blur-sm">
                    <Image 
                        src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000" 
                        alt="Hero Pet" 
                        fill 
                        className="object-cover"
                        unoptimized
                    />
                </div>

                {/* Decorative floating elements */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-10 -right-10 w-24 h-24 border-2 border-dashed border-primary/30 rounded-full flex items-center justify-center"
                >
                    <div className="w-4 h-4 bg-primary rounded-full" />
                </motion.div>
                
                <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-5 -left-5 bg-white p-4 rounded-2xl shadow-xl border border-border"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-sm font-black uppercase tracking-wider">Healthy & Happy</span>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
