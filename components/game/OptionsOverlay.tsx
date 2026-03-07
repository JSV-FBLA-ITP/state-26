'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion, AnimatePresence } from 'framer-motion';
import { X, Settings2, LogOut, Save, Trash2, Home, Volume2, Moon, Sun, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    onLogout: () => void;
}

export function OptionsOverlay({ isOpen, onClose, onSave, onLogout }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md bg-card rounded-[2.5rem] border-2 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-muted">
                                    <Settings2 className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <h2 className="text-xl font-black">Preferences</h2>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Account Section */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Session</h3>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button
                                        onClick={() => { onSave(); onClose(); }}
                                        className="h-14 rounded-2xl justify-start px-6 font-bold bg-primary/10 text-primary border-2 border-transparent hover:border-primary/50 hover:bg-primary/20"
                                    >
                                        <Save className="w-5 h-5 mr-4" />
                                        Save Snapshot
                                    </Button>
                                    <Link href="/dashboard/pets" className="block">
                                        <Button
                                            variant="outline"
                                            className="w-full h-14 rounded-2xl justify-start px-6 font-bold border-2"
                                        >
                                            <Home className="w-5 h-5 mr-4 text-emerald-500" />
                                            Return to Hub
                                            <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Game Settings */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Ambience</h3>
                                <div className="p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Volume2 className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-bold">Sound Effects</span>
                                        </div>
                                        <div className="w-10 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                            <div className="absolute right-1 w-4 h-4 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Moon className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-bold">Dark Mode</span>
                                        </div>
                                        <div className="w-10 h-6 bg-primary rounded-full relative p-1 cursor-pointer">
                                            <div className="absolute right-1 w-4 h-4 bg-white rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Destructive Actions */}
                            <div className="pt-4 border-t border-border/50">
                                <Button
                                    onClick={onLogout}
                                    variant="ghost"
                                    className="w-full h-14 rounded-2xl justify-start px-6 font-bold text-rose-500 hover:bg-rose-500/10"
                                >
                                    <LogOut className="w-5 h-5 mr-4" />
                                    Disconnect Session
                                </Button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-muted/30 flex justify-center">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                Version 1.0.4 • Made with pet care love
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
