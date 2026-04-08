'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/login">
                    <Button variant="ghost" className="mb-8 gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back to Login
                    </Button>
                </Link>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black">Privacy Policy</h1>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-[var(--muted-foreground)]">
                    <section>
                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">1. Information We Collect</h2>
                        <p>We collect your email address and profile name via OAuth providers (Google/GitHub) solely for the purpose of creating a unique user account for the PetPal game.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">2. How We Use Data</h2>
                        <p>Your game progress, pet statistics, and simulated financial records are stored to allow you to continue your experience across different sessions.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">3. Security Standards</h2>
                        <p>We use Supabase Auth for industry-standard security, ensuring that passwords and sessions are handled securely and encrypted where applicable.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
