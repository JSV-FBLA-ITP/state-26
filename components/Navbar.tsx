'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { fetchUserPets } from '@/lib/storage';
import { createClient } from '@/utils/supabase/client';
import { Menu, X, User } from 'lucide-react';

export function Navbar() {
    const [hasPets, setHasPets] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [user, setUser] = useState<any>(null);
    const [activeSection, setActiveSection] = useState('hero');
    const [isScrolled, setIsScrolled] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const pathname = usePathname();
    const supabase = createClient();

    useEffect(() => {
        async function checkSession() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        }

        async function checkForPets() {
            try {
                const { data } = await fetchUserPets();
                if (data && data.length > 0) {
                    setHasPets(true);
                }
            } catch {
                // silently ignore
            }
        }
        checkSession();
        checkForPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Scroll detection for frosted glass effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Section observer for scroll-spy
    useEffect(() => {
        if (pathname !== '/') return;

        const handleScroll = () => {
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;
            if (isAtBottom) {
                setActiveSection('hero');
            }
        };

        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -70% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20;
            if (isAtBottom) return;

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        
        const sections = ['hero', 'features', 'education'];
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        window.addEventListener('scroll', handleScroll);

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        const isHash = href.includes('#');
        const targetId = href.split('#')[1];

        if (pathname === '/' && isHash && targetId) {
            e.preventDefault();
            const el = document.getElementById(targetId);
            if (el) {
                const navHeight = 80;
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
            setDrawerOpen(false);
        } else if (pathname === '/' && href === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setDrawerOpen(false);
        }
    }, [pathname]);

    const navLinks = [
        { name: 'Simulator', href: '/', id: 'hero' },
        { name: 'Features', href: '/#features', id: 'features' },
        { name: 'Education', href: '/#education', id: 'education' },
    ];

    // Hide landing Navbar on dashboard routes
    if (pathname?.startsWith('/dashboard')) return null;

    return (
        <>
            <nav 
                className={`fixed top-0 w-full z-50 navbar-glass transition-all duration-300 border-b ${
                    isScrolled 
                        ? 'bg-(--warm-cream)/85 dark:bg-[#1A1614]/85 border-border shadow-sm' 
                        : 'bg-(--warm-cream)/60 dark:bg-[#1A1614]/60 border-transparent'
                }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" onClick={(e) => handleClick(e, '/')} className="flex items-center gap-2.5 group transition-all shrink-0">
                        <Image 
                            src="/favicon.svg" 
                            alt="PetPal Logo" 
                            width={40}
                            height={40}
                            className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 drop-shadow-md"
                        />
                        <span className="text-xl font-extrabold tracking-tight text-foreground">
                            Pet<span className="text-primary">Pal</span>
                        </span>
                    </Link>

                    {/* Desktop Nav Links (centered) */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isSectionActive = pathname === '/' && activeSection === link.id;
                            const isActive = isSectionActive;

                            return (
                                <Link 
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => handleClick(e, link.href)}
                                    className={`text-sm font-bold tracking-wide transition-all py-1.5 px-1 border-b-2 ${
                                        isActive 
                                        ? 'text-primary border-primary' 
                                        : 'text-muted-foreground border-transparent hover:text-foreground'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side: theme toggle + CTA + hamburger */}
                    <div className="flex items-center gap-3">
                        {/* Theme toggle — desktop only */}
                        <div className="hidden md:block">
                            <ThemeToggle />
                        </div>
                        {/* Profile / Login — desktop only */}
                        {user ? (
                            <Link href="/profile" className="hidden md:block p-2 rounded-xl hover:bg-accent transition-colors" aria-label="Profile">
                                <User className="w-5 h-5" />
                            </Link>
                        ) : (
                            <Link href="/login" className="hidden md:block text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-2">
                                Log in
                            </Link>
                        )}
                        <Link href={hasPets ? '/dashboard' : '/onboarding'}>
                            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.03] active:scale-95 transition-all h-auto">
                                {hasPets ? 'Dashboard' : 'Get Started'}
                            </Button>
                        </Link>

                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setDrawerOpen(!drawerOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-accent transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile drawer overlay */}
            <div 
                className={`mobile-drawer-overlay ${drawerOpen ? 'open' : ''}`}
                onClick={() => setDrawerOpen(false)}
            />

            {/* Mobile drawer */}
            <div className={`mobile-drawer ${drawerOpen ? 'open' : ''}`}>
                <div className="p-6">
                    {/* Drawer header */}
                    <div className="flex items-center justify-between mb-10">
                        <span className="text-2xl font-extrabold tracking-tight text-foreground">
                            Pet<span className="text-primary">Pal</span>
                        </span>
                        <button 
                            onClick={() => setDrawerOpen(false)}
                            className="p-2 rounded-xl hover:bg-accent transition-colors"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Drawer nav links */}
                    <div className="flex flex-col gap-2">
                        {navLinks.map((link) => {
                            const isSectionActive = pathname === '/' && activeSection === link.id;
                            const isActive = isSectionActive;

                            return (
                                <Link 
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => {
                                        handleClick(e, link.href);
                                        setDrawerOpen(false);
                                    }}
                                    className={`text-base font-bold py-3 px-4 rounded-xl transition-all ${
                                        isActive 
                                        ? 'text-primary bg-accent' 
                                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Drawer CTA */}
                    <div className="mt-8 flex flex-col gap-3">
                        {/* Theme toggle row */}
                        <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-accent">
                            <span className="text-sm font-bold text-foreground">Appearance</span>
                            <ThemeToggle />
                        </div>

                        {user ? (
                            <Link href="/profile" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3 py-3 px-4 rounded-xl bg-accent text-foreground font-bold">
                                <User className="w-5 h-5 text-primary" />
                                My Account
                            </Link>
                        ) : (
                            <Link href="/login" onClick={() => setDrawerOpen(false)}>
                                <Button variant="outline" className="w-full border-border py-3 rounded-full font-bold h-auto text-base">
                                    Log in
                                </Button>
                            </Link>
                        )}
                        <Link href={hasPets ? "/dashboard" : "/onboarding"} onClick={() => setDrawerOpen(false)}>
                            <Button className="w-full bg-primary hover:bg-coral-600 text-white py-3 rounded-full font-bold shadow-md h-auto text-base">
                                {hasPets ? "My Pets" : "Get Started"}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
