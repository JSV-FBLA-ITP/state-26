'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden" style={{ height: '100dvh' }}>
            <DashboardTopbar />
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-emerald-500/5 rounded-full blur-[120px] animate-blob animation-delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-sky-500/3 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <main className="flex-1 relative z-10 min-h-0">
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
                        className="h-full"
                    >
                        {children}
                    </motion.div>
                </Suspense>
            </main>
        </div>
    );
}
