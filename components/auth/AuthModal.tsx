'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    featureName?: string;
}

export function AuthModal({ 
    isOpen, 
    onClose, 
    title = "Sign in to continue", 
    description,
    featureName 
}: AuthModalProps) {
    const defaultDescription = featureName 
        ? `To access the ${featureName}, you'll need to create an account or sign in. This allows us to save your progress and data!`
        : "You'll need a PetPal account to access this feature and keep your pet's journey synced across all your devices.";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-background/80 backdrop-blur-xl"
                    />

                    {/* Modal Content */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-card p-8 rounded-[3rem] border border-border/50 shadow-2xl max-w-md w-full text-center space-y-6 overflow-hidden"
                    >
                        {/* Decorative background glow */}
                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px]" />
                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-[80px]" />

                        <button 
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>

                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20 relative">
                            <Sparkles className="w-10 h-10 text-primary animate-pulse" />
                            <div className="absolute inset-0 bg-primary/5 rounded-3xl animate-ping" style={{ animationDuration: '3s' }} />
                        </div>

                        <div className="space-y-2 relative">
                            <h2 className="text-3xl font-black tracking-tight">{title}</h2>
                            <p className="text-muted-foreground leading-relaxed px-4">
                                {description || defaultDescription}
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 relative">
                            <Link href="/login" className="w-full">
                                <Button className="w-full h-14 rounded-2xl font-black gap-2 shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-[0.98] transition-transform">
                                    Sign In or Create Account <ArrowRight className="w-5 h-5" />
                                </Button>
                            </Link>

                            <Button 
                                variant="outline" 
                                onClick={onClose}
                                className="h-14 rounded-2xl font-black border-2 hover:bg-muted"
                            >
                                Maybe Later
                            </Button>
                        </div>

                        <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/50 pt-4">
                            Your pet is waiting for you! 🐾
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
