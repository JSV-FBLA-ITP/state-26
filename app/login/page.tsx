'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

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
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            }
        });
        if (error) setError(error.message);
        else setMessage('Check your email for confirmation link!');
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">State Competition Prototype</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-primary">Welcome Back</h1>
                    <p className="text-muted-foreground mt-2">Continue your pet ownership journey</p>
                </div>

                <Card className="p-8 rounded-[2rem] border-2 shadow-2xl bg-card/50 backdrop-blur-xl">
                    <form className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-12 rounded-2xl h-12 border-2 focus-visible:ring-0 focus-visible:border-primary"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="pl-12 rounded-2xl h-12 border-2 focus-visible:ring-0 focus-visible:border-primary"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {error && <p className="text-rose-500 text-sm font-bold bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>}
                        {message && <p className="text-emerald-500 text-sm font-bold bg-emerald-50 p-3 rounded-xl border border-emerald-100">{message}</p>}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <Button
                                onClick={handleLogin}
                                disabled={loading}
                                className="rounded-2xl h-12 font-bold text-lg"
                            >
                                {loading ? 'Working...' : 'Login'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleSignUp}
                                disabled={loading}
                                className="rounded-2xl h-12 font-bold text-lg"
                            >
                                Sign Up
                            </Button>
                        </div>
                    </form>
                </Card>

                <p className="text-center mt-8 text-sm text-muted-foreground">
                    By continuing, you agree to our <span className="text-primary font-bold cursor-pointer hover:underline">Terms of Service</span>.
                </p>
            </motion.div>
        </div>
    );
}
