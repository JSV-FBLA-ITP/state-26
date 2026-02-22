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
        <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
            <DashboardTopbar />
            {/* Animated Background Mesh */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-indigo-500/5 rounded-full blur-[120px]" />
            </div>

            <main className="flex-1 relative z-10 overflow-y-auto">
                <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Pet Data...</div>}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="h-full"
                    >
                        {children}
                    </motion.div>
                </Suspense>
            </main>
        </div>
    );
}
