'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, User, LogIn } from 'lucide-react';
import Link from 'next/link';

export function UserMenu() {
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, [supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    if (loading) return (
        <div className="w-24 h-10 rounded-2xl bg-card/50 backdrop-blur-xl border-2 animate-pulse" />
    );

    if (!user) {
        return (
            <Link href="/login">
                <Button
                    variant="outline"
                    className="rounded-2xl border-2 font-black bg-card/50 backdrop-blur-xl hover:bg-primary/10 hover:border-primary/50 transition-all px-6"
                >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                </Button>
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-card/50 backdrop-blur-xl border-2 flex items-center justify-center group cursor-default">
                <User className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
            </div>
            <Button
                variant="ghost"
                size="icon-lg"
                onClick={handleLogout}
                className="rounded-2xl bg-card/50 backdrop-blur-xl border-2 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/50 transition-all font-bold"
            >
                <LogOut className="w-5 h-5" />
            </Button>
        </div>
    );
}
