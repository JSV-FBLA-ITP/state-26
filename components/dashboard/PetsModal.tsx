'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserPets } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { X, Plus, PawPrint } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PetsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPet: (petId: string) => void;
}

export function PetsModal({ isOpen, onClose, onSelectPet }: PetsModalProps) {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetchUserPets().then(({ data }) => {
                if (data) setPets(data);
                setLoading(false);
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl border-2 border-border overflow-hidden flex flex-col max-h-[80vh]"
                >
                    <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <PawPrint className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight">Your Pets</h2>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1">
                        {loading ? (
                            <div className="text-center p-8 text-muted-foreground">Loading your pets...</div>
                        ) : pets.length === 0 ? (
                            <div className="text-center p-8 text-muted-foreground">No pets found. Adopt one!</div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {pets.map((p) => (
                                    <div
                                        key={p.id}
                                        className="group relative flex items-center gap-4 p-4 rounded-2xl border-2 border-border/50 bg-card hover:border-primary/50 cursor-pointer transition-all"
                                        onClick={() => onSelectPet(p.id)}
                                    >
                                        <div className="w-16 h-16 relative rounded-xl overflow-hidden bg-background">
                                            {p.image_url ? (
                                                <Image src={p.image_url} alt={p.name} fill className="object-cover" />
                                            ) : (
                                                <PawPrint className="w-8 h-8 absolute top-4 left-4 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg">{p.name}</h3>
                                            <p className="text-sm text-muted-foreground capitalize">{p.type}</p>
                                        </div>
                                        <div className="absolute inset-0 border-2 border-primary rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t border-border/50 bg-background/50 flex justify-end">
                        <Link href="/onboarding">
                            <Button className="rounded-2xl font-bold" size="lg">
                                <Plus className="w-5 h-5 mr-2" />
                                Adopt New Pet
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
