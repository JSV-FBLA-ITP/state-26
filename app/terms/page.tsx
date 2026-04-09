'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
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
                        <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h1 className="text-4xl font-black">Terms of Service</h1>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-[var(--muted-foreground)]">
                    <section>
                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">1. Educational Use Only</h2>
                        <p>PetPal is a prototype application created for the FBLA State Leadership Conference. It is intended for educational and competitive purposes only. By using PetPal, you agree to follow our code of conduct. We reserve the right to suspend accounts that engage in &quot;farming&quot; or other activities that undermine the educational intent of the competition demo.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">2. No Real Financial Advice</h2>
                        <p>All financial data, calculations, and &quot;savings&quot; represented in this app are purely simulated. They do not constitute financial advice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">3. Data Privacy</h2>
                        <p>User data is stored using Supabase for the duration of the competition. We do not sell or share your data with third parties.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
