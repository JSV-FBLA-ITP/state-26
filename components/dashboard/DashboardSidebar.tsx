'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PawPrint, BookOpen, LogOut, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { useTheme } from 'next-themes';

const navItems = [
    { href: '/dashboard', label: 'Play', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/pets', label: 'Lives', icon: PawPrint, exact: false },
    { href: '/dashboard/how-to-play', label: 'Manual', icon: BookOpen, exact: false },
];

export function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/');
    };

    const isDark = theme === 'dark';

    return (
        <aside className="w-[68px] shrink-0 flex flex-col items-center py-4 gap-1 border-r border-border/50 bg-background/80 backdrop-blur-xl z-50 relative">

            {/* Logo → home */}
            <Link
                href="/"
                title="Home"
                className="mb-3 flex items-center justify-center w-10 h-10 rounded-2xl hover:bg-muted/70 transition-colors group"
            >
                <Image
                    src="/favicon.svg"
                    alt="PetPal"
                    width={28}
                    height={28}
                    className="group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 drop-shadow-md"
                />
            </Link>

            <div className="w-8 h-px bg-border/40 mb-1" />

            {/* Nav items */}
            <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
                {navItems.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={item.label}
                            className={cn(
                                'relative flex flex-col items-center justify-center w-full h-12 rounded-2xl transition-all duration-300 gap-0.5',
                                isActive
                                    ? 'text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active-pill"
                                    className="absolute inset-0 bg-primary rounded-2xl shadow-md shadow-primary/30 z-0"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.45 }}
                                />
                            )}
                            <item.icon className="relative z-10 w-[18px] h-[18px]" />
                            <span className="relative z-10 text-[9px] font-black uppercase tracking-wider leading-none">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom — all stacked vertically */}
            <div className="flex flex-col items-center gap-2 mt-auto w-full px-2">
                <div className="w-8 h-px bg-border/40" />

                {/* Theme toggle */}
                <button
                    onClick={() => setTheme(isDark ? 'light' : 'dark')}
                    title={isDark ? 'Light mode' : 'Dark mode'}
                    className="flex flex-col items-center justify-center w-full h-11 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all gap-0.5"
                >
                    {isDark
                        ? <Sun className="w-[18px] h-[18px]" />
                        : <Moon className="w-[18px] h-[18px]" />
                    }
                    <span className="text-[9px] font-black uppercase tracking-wider leading-none">
                        {isDark ? 'Light' : 'Dark'}
                    </span>
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title="Sign out"
                    className="flex flex-col items-center justify-center w-full h-11 rounded-2xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all gap-0.5"
                >
                    <LogOut className="w-[18px] h-[18px]" />
                    <span className="text-[9px] font-black uppercase tracking-wider leading-none">
                        Out
                    </span>
                </button>
            </div>
        </aside>
    );
}
