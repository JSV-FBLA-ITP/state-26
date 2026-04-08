'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { LogOut, User, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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

    const avatarUrl = user.user_metadata?.avatar_url;
    const fullName = user.user_metadata?.full_name;

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 group cursor-default">
                {avatarUrl ? (
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-border shadow-inner relative">
                        <Image 
                            src={avatarUrl} 
                            alt={fullName || 'User'} 
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-4 h-4 text-primary" />
                    </div>
                )}
                {fullName && (
                    <span className="text-sm font-black tracking-tight hidden sm:block truncate max-w-[120px]">
                        {fullName}
                    </span>
                )}
            </div>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="w-10 h-10 rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/50 transition-all font-bold shadow-sm"
                title="Logout"
            >
                <LogOut className="w-4 h-4" />
            </Button>
        </div>
    );
}
