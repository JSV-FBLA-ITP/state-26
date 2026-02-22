'use client';

import { Input } from '@/components/ui/input';
import { User, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function UserOnboarding({ name, onNameChange }: { name: string; onNameChange: (val: string) => void }) {
    return (
        <div className="space-y-8 py-4">
            <div className="text-center space-y-4 mb-12">
                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <User className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-4xl font-black tracking-tight">Welcome, Homeowner!</h2>
                <p className="text-muted-foreground text-lg max-w-md mx-auto leading-relaxed">
                    Every great household starts with a visionary owner. What should we call you?
                </p>
            </div>

            <div className="relative max-w-md mx-auto">
                <Input
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder="Enter your name..."
                    className="h-16 text-2xl font-bold rounded-2xl border-2 px-6 focus:ring-4 focus:ring-primary/20 transition-all bg-card/30"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: name.length > 2 ? 1 : 0 }}
                    className="absolute -right-12 top-1/2 -translate-y-1/2"
                >
                    <Sparkles className="w-8 h-8 text-yellow animate-pulse" />
                </motion.div>
            </div>

            {name.length > 2 && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm font-bold text-primary italic"
                >
                    "The {name}'s Family household is about to be born."
                </motion.p>
            )}
        </div>
    );
}
