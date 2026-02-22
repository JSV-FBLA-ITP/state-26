'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, PawPrint, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        else window.location.href = '/dashboard';
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) setError(error.message);
        else setMessage('Check your email for a confirmation link!');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background orbs */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-violet-500/20 blur-[140px] animate-blob" />
                <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full bg-fuchsia-500/15 blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-500/10 blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="z-10 w-full max-w-md"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
                    <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-105 transition-transform">
                        <PawPrint className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-black text-2xl tracking-tighter">PetPal</span>
                </Link>

                {/* Card */}
                <div className="bg-card/60 backdrop-blur-2xl border border-border/50 rounded-[2rem] p-8 shadow-2xl shadow-black/20">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black tracking-tight mb-2">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            {mode === 'login'
                                ? 'Sign in to continue your pet journey'
                                : 'Join thousands of pet owners today'}
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={mode === 'login' ? handleLogin : handleSignUp}>
                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-12 rounded-2xl h-12 border-2 border-border focus-visible:ring-0 focus-visible:border-primary transition-colors"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12 rounded-2xl h-12 border-2 border-border focus-visible:ring-0 focus-visible:border-primary transition-colors"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Feedback */}
                        {error && (
                            <div className="text-rose-500 text-sm font-bold bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="text-emerald-500 text-sm font-bold bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                {message}
                            </div>
                        )}

                        {/* Submit */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-2xl h-12 font-bold text-base shadow-lg shadow-primary/25 gap-2 group"
                        >
                            {loading ? 'Working...' : mode === 'login' ? 'Sign In' : 'Create Account'}
                            {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                        </Button>
                    </form>

                    {/* Toggle mode */}
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(null); setMessage(null); }}
                            className="text-sm text-muted-foreground hover:text-primary font-semibold transition-colors"
                        >
                            {mode === 'login'
                                ? "Don't have an account? Sign up →"
                                : 'Already have an account? Sign in →'}
                        </button>
                    </div>
                </div>

                {/* Guest shortcut */}
                <p className="text-center mt-6 text-sm text-muted-foreground">
                    Just exploring?{' '}
                    <Link href="/onboarding" className="text-primary font-bold hover:underline">
                        Continue as guest →
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
