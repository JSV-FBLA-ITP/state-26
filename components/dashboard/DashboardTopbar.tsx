'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PawPrint, BookOpen, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { UserMenu } from '@/components/dashboard/DashboardUserMenu';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const navItems = [
    { href: '/dashboard', label: 'Play', icon: LayoutDashboard },
    { href: '/dashboard/pets', label: 'Lives', icon: PawPrint },
    { href: '/dashboard/how-to-play', label: 'Manual', icon: BookOpen },
];

export function DashboardTopbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-xl border-b border-border/50">
            <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
                {/* Logo & Home */}
                <div className="flex items-center gap-2 shrink-0">
                    <Link href="/" className="flex items-center gap-3 group">
                        <Image 
                            src="/favicon.svg" 
                            alt="PetPal Logo" 
                            width={32}
                            height={32}
                            className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-md"
                        />
                        <span className="font-black text-2xl tracking-tighter hidden sm:block">PetPal</span>
                    </Link>
                    <div className="h-6 w-px bg-border/40 mx-4 hidden sm:block" />
                    <Link
                        href="/"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-muted/40 hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-all group"
                        title="Home"
                    >
                        <Home className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Desktop nav pills */}
                <div className="hidden md:flex items-center gap-1 bg-muted/60 rounded-full p-1 border border-border/20 h-10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'relative flex items-center gap-2 px-5 h-full rounded-full text-sm font-black transition-colors duration-300',
                                    isActive ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="desktop-nav-pill"
                                        className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/25 z-0"
                                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-2">
                                    <item.icon className={cn("w-4 h-4 transition-transform", isActive && "scale-110")} />
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right slot – Theme, User */}
                <div className="flex items-center gap-3">
                    <ThemeToggle />
                    <UserMenu />
                </div>
            </div>

            {/* Mobile bottom bar */}
            <div className="flex md:hidden items-center justify-around px-4 pb-3 pt-2 border-t border-border/10 bg-muted/20 backdrop-blur-md">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'relative flex flex-col items-center px-6 py-2.5 rounded-2xl transition-all duration-300',
                                isActive ? 'text-primary' : 'text-muted-foreground'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="mobile-nav-pill"
                                    className="absolute inset-x-1 inset-y-1 bg-primary/10 rounded-xl z-0"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                />
                            )}
                            <item.icon className={cn("relative z-10 w-6 h-6", isActive && "scale-110")} />
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
