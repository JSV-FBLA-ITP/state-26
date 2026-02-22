'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    PawPrint,
    ReceiptText,
    BookOpen,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/dashboard', label: 'Play', icon: LayoutDashboard },
    { href: '/dashboard/pets', label: 'Lives', icon: PawPrint },
    { href: '/dashboard/how-to-play', label: 'Manual', icon: BookOpen },
];

export function DashboardTopbar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-border/50 px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Sparkles className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-black text-xl tracking-tighter">PetPal</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all",
                                    pathname === item.href
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* User profile or other quick actions can go here */}
                </div>
            </div>

            {/* Mobile Nav */}
            <div className="flex md:hidden items-center justify-around mt-3 pt-3 border-t border-border/10">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center gap-1 text-[10px] font-bold transition-all",
                            pathname === item.href ? "text-primary" : "text-muted-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
