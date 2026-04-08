'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-dvh max-h-dvh overflow-hidden bg-background text-foreground">

            {/* Persistent vertical sidebar */}
            <DashboardSidebar />

            {/* Ambient background blobs — fixed so they don't affect layout */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-sage-500/5 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-coral-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-coral-400/3 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            {/* Main content — fills remaining width, no overflow */}
            <main className="flex-1 overflow-hidden relative z-10 flex flex-col">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 animate-pulse" />
                        <p className="text-muted-foreground font-semibold">Loading your companion…</p>
                    </div>
                }>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        {children}
                    </motion.div>
                </Suspense>
            </main>
        </div>
    );
}
