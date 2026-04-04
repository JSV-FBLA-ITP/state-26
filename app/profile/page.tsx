'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
    User, 
    Calendar, 
    LogOut, 
    Shield, 
    Settings, 
    Activity,
    CreditCard,
    ArrowLeft,
    Clock
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        }
        getUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    useEffect(() => {
        if (!loading && !user) {
            window.location.href = '/login';
        }
    }, [user, loading]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const stats = [
        { label: 'Member Since', value: new Date(user.created_at).toLocaleDateString(), icon: Calendar },
        { label: 'Security Status', value: user.email_confirmed_at ? 'Verified' : 'Unverified', icon: Shield },
        { label: 'Last Login', value: new Date(user.last_sign_in_at).toLocaleTimeString(), icon: Clock },
        { label: 'Plan', value: 'PetPal Legend', icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] px-6 py-12 lg:py-20 relative overflow-hidden">
            {/* Ambient Background blobs */}
            <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-[var(--primary)]/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-[var(--sage-500)]/5 rounded-full blur-[120px] -z-10" />

            <div className="max-w-4xl mx-auto">
                {/* Header Actions */}
                <div className="flex items-center justify-between mb-12">
                    <Link href="/" className="group flex items-center gap-2 text-sm font-bold text-[var(--muted-foreground)] hover:text-foreground transition-colors">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" className="rounded-xl border border-border h-10 w-10 p-0 hover:bg-accent">
                            <Settings className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar / Main Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-1 space-y-6"
                    >
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 text-center shadow-xl shadow-[var(--primary)]/5">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary to-coral-600 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg shadow-primary/20 relative">
                                <User className="w-10 h-10" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-sage-500 border-4 border-card rounded-full flex items-center justify-center">
                                    <Activity className="w-3.5 h-3.5 text-white" />
                                </div>
                            </div>
                            <h2 className="text-xl font-black font-[var(--font-nunito)] mb-1 truncate px-2">{user.email?.split('@')[0]}</h2>
                            <p className="text-sm text-[var(--muted-foreground)] mb-6 truncate">{user.email}</p>
                            
                            <Button 
                                onClick={handleSignOut}
                                variant="outline" 
                                className="w-full rounded-2xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold h-12 gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </Button>
                        </div>
                    </motion.div>

                    {/* Content / Stats */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2 space-y-6"
                    >
                        <h2 className="text-2xl font-black font-[var(--font-nunito)] mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-primary" />
                            Account Overview
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.label} className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all group">
                                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-base font-black font-[var(--font-nunito)]">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pet Stats Section Placeholder */}
                        <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full translate-x-10 -translate-y-10 blur-2xl" />
                           <h3 className="text-lg font-black font-[var(--font-nunito)] mb-4">Mastering Money</h3>
                           <p className="text-[var(--muted-foreground)] text-sm mb-6 leading-relaxed">
                               You&apos;ve completed 12 lessons and raised 2 pets to maturity. Your financial literacy score is currently <span className="text-primary font-bold">Gold Tier</span>.
                           </p>
                           <Link href="/dashboard">
                               <Button className="bg-primary text-white rounded-xl font-bold px-6 h-10 shadow-md hover:scale-105 transition-transform">
                                   Continue Playing
                               </Button>
                           </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
