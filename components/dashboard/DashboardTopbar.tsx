'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, PawPrint, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

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
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
                        <PawPrint className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="font-black text-lg tracking-tighter hidden sm:block">PetPal</span>
                </Link>

                {/* Desktop nav pills */}
                <div className="hidden md:flex items-center gap-1 bg-muted/50 rounded-2xl p-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all',
                                pathname === item.href
                                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                            )}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Right slot – empty for now, used by page-level controls */}
                <div className="w-8" />
            </div>

            {/* Mobile bottom bar */}
            <div className="flex md:hidden items-center justify-around px-6 pb-2 pt-1 border-t border-border/10">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-[10px] font-bold transition-all',
                            pathname === item.href
                                ? 'text-primary bg-primary/10'
                                : 'text-muted-foreground hover:text-foreground'
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
