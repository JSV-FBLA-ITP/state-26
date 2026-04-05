'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { 
    Mail, 
    Lock, 
    ArrowRight, 
    Github, 
    AlertCircle, 
    Loader2, 
    CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (mode === 'signup') {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (signUpError) throw signUpError;
                setSuccess(true);
            } else {
                const { error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (signInError) throw signInError;
                window.location.href = '/dashboard';
            }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider: 'github' | 'google') => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            });
            if (error) throw error;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient Background blobs */}
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-[var(--primary)]/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-[var(--sage-500)]/5 rounded-full blur-[120px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
                        <div className="w-12 h-12 relative group-hover:scale-110 transition-transform">
                            <Image 
                                src="/favicon.svg" 
                                alt="PetPal Logo" 
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-2xl font-black font-[var(--font-nunito)]">
                            Pet<span className="text-primary">Pal</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black font-[var(--font-nunito)] tracking-tight mb-2">
                        {mode === 'login' ? 'Welcome back!' : 'Join the family'}
                    </h1>
                    <p className="text-[var(--muted-foreground)]">
                        {mode === 'login' 
                            ? 'Your pet is waiting for you.' 
                            : 'Start your financial journey with a new best friend.'}
                    </p>
                </div>

                <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 shadow-xl shadow-[var(--primary)]/5 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <div className="w-16 h-16 bg-[var(--sage-50)] text-[var(--sage-500)] rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <h2 className="text-xl font-bold mb-2">Check your email</h2>
                                <p className="text-[var(--muted-foreground)] mb-8 text-sm">
                                    We&apos;ve sent a magic link to <span className="font-bold text-[var(--foreground)]">{email}</span>. Please click it to verify your account.
                                </p>
                                <Button 
                                    onClick={() => setSuccess(false)}
                                    variant="ghost" 
                                    className="text-primary font-bold hover:bg-primary/5"
                                >
                                    Try another email
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.form
                                key={mode}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                onSubmit={handleAuth}
                                className="space-y-5"
                            >
                                {/* Social Login Row */}
                                <div className="grid grid-cols-2 gap-4 mb-2">
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        onClick={() => handleSocialLogin('github')}
                                        className="rounded-2xl border-[var(--border)] hover:bg-[var(--accent)] font-bold flex items-center gap-2 h-12"
                                    >
                                        <Github className="w-4 h-4" />
                                        GitHub
                                    </Button>
                                    <Button 
                                        type="button"
                                        disabled
                                        variant="outline" 
                                        className="rounded-2xl border-[var(--border)] opacity-50 cursor-not-allowed font-bold flex items-center gap-2 h-12"
                                    >
                                        <div className="w-4 h-4 bg-red-400 rounded-sm" />
                                        Google
                                    </Button>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-[var(--border)]"></span>
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-[var(--card)] px-2 text-[var(--muted-foreground)] font-bold tracking-widest">Or continue with</span>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold ml-1 text-[var(--muted-foreground)]">Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] transition-colors group-focus-within:text-primary" />
                                            <input 
                                                required
                                                type="email" 
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center ml-1">
                                            <label className="text-sm font-bold text-[var(--muted-foreground)]">Password</label>
                                            {mode === 'login' && (
                                                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot?</button>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-foreground)] transition-colors group-focus-within:text-primary" />
                                            <input 
                                                required
                                                type="password" 
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-[var(--background)] border border-[var(--border)] rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-2xl flex items-start gap-3"
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-600 dark:text-red-400 font-medium leading-tight">
                                            {error}
                                        </p>
                                    </motion.div>
                                )}

                                <Button 
                                    className="w-full bg-primary hover:bg-coral-600 text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Login' : 'Create Account'}
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>

                                <p className="text-center text-sm font-bold text-[var(--muted-foreground)] pt-2">
                                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                                    <button 
                                        type="button"
                                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                        className="text-primary hover:underline"
                                    >
                                        {mode === 'login' ? 'Sign up' : 'Log in'}
                                    </button>
                                </p>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </div>
                
                <p className="text-center mt-8 text-xs text-[var(--muted-foreground)] font-medium">
                    By continuing, you agree to PetPal&apos;s <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
            </motion.div>
        </div>
    );
}
