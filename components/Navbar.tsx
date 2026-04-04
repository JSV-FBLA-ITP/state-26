'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { fetchUserPets } from '@/lib/storage';

export function Navbar() {
    const [hasPets, setHasPets] = useState(false);
    const [activeSection, setActiveSection] = useState('hero');
    const pathname = usePathname();

    useEffect(() => {
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
        checkForPets();
    }, []);

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
            // Only update via observer if not at the bottom
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

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        const isHash = href.includes('#');
        const targetId = href.split('#')[1];

        if (pathname === '/' && isHash && targetId) {
            e.preventDefault();
            const el = document.getElementById(targetId);
            if (el) {
                const navHeight = 80; // height of fixed navbar
                const elementPosition = el.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        } else if (pathname === '/' && href === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navLinks = [
        { name: 'Simulator', href: '/', id: 'hero' },
        { name: 'Features', href: '/#features', id: 'features' },
        { name: 'Education', href: '/#education', id: 'education' },
    ];

    // Hide landing Navbar on dashboard routes (DashboardTopbar handles navigation there)
    if (pathname?.startsWith('/dashboard')) return null;

    return (
        <nav className="fixed top-0 w-full z-50 bg-[#f8f9ff]/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300 border-b border-black/5 dark:border-white/5">
            <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
                <Link href="/" onClick={(e) => handleClick(e, '/')} className="flex items-center gap-2 group transition-all shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform relative bg-white rounded-xl shadow-sm border border-black/[0.03] overflow-hidden overflow-hidden p-1.5">
                        <Image 
                            src="/logo.png" 
                            alt="PetPal Logo" 
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-[#0058be] dark:text-blue-400 font-outfit">PetPal</span>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => {
                        const isSectionActive = pathname === '/' && activeSection === link.id;
                        const isActive = link.name === 'Education' ? (pathname === '/learn-more' || isSectionActive) : isSectionActive;

                        return (
                            <Link 
                                key={link.name}
                                href={link.href}
                                onClick={(e) => handleClick(e, link.href)}
                                className={`text-sm font-bold uppercase tracking-widest transition-all py-1 border-b-2 ${
                                    isActive 
                                    ? 'text-[#0058be] dark:text-blue-400 border-[#0058be] dark:border-blue-400' 
                                    : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-[#0058be] dark:hover:text-blue-400'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href={hasPets ? "/dashboard" : "/onboarding"}>
                        <Button className="bg-linear-to-br from-[#0058be] to-[#2170e4] text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-blue-500/10 hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all h-auto">
                            {hasPets ? "My Pets" : "Get Started"}
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
