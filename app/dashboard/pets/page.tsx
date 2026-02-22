'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserPets, deletePet, savePetToCloud } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { PawPrint, Plus, Heart, Zap, Coins, ArrowRight, Sparkles, X, ReceiptText, Settings2, Edit2, Trash2, Check, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { PetData } from '@/lib/gameLogic';

export default function MyPetsPage() {
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fusionTarget, setFusionTarget] = useState<string | null>(null);
    const [isFusing, setIsFusing] = useState(false);
    const [editingPetId, setEditingPetId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [showMenuId, setShowMenuId] = useState<string | null>(null);
    const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const loadPets = async () => {
        const { data } = await fetchUserPets();
        if (data) setPets(data);
        setLoading(false);
    };

    useEffect(() => {
        loadPets();
    }, []);

    const handleSelectPet = (petId: string) => {
        localStorage.setItem('currentPetId', petId);
        window.location.href = '/dashboard';
    };

    const handleRename = async (pet: any) => {
        if (!editingName.trim() || editingName === pet.name) {
            setEditingPetId(null);
            return;
        }

        const dataToSave: PetData = {
            ...pet,
            name: editingName,
            petImage: pet.image_url || pet.petImage,
            monthData: pet.month_data || pet.monthData
        };

        const { error } = await savePetToCloud(dataToSave);
        if (!error) {
            await loadPets();
            setEditingPetId(null);
        }
    };

    const handleDelete = async (petId: string) => {
        if (!confirm('Are you sure you want to release this pet? This cannot be undone.')) return;

        const { error } = await deletePet(petId);
        if (!error) {
            await loadPets();
        }
    };

    const handleDragEnd = async (event: any, info: any, sourcePet: any) => {
        // Find if we dropped on another pet
        const x = info.point.x;
        const y = info.point.y;

        let targetPetId: string | null = null;

        for (const [id, ref] of Object.entries(cardRefs.current)) {
            if (!ref || id === sourcePet.id) continue;
            const rect = ref.getBoundingClientRect();
            if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                targetPetId = id;
                break;
            }
        }

        if (targetPetId) {
            const targetPet = pets.find(p => p.id === targetPetId);
            if (targetPet) {
                await fusePets(sourcePet, targetPet);
            }
        }
    };

    const fusePets = async (petA: any, petB: any) => {
        if (isFusing) return;
        setIsFusing(true);
        setFusionTarget(petB.id);

        // Fusion Logic: 
        // 1. Average stats but boost them by 20% (Fusion bonus)
        // 2. Combine money
        // 3. Keep most upgrades/tricks
        // 4. Create a "Hybrid" name

        const hybridName = `${petA.name.substring(0, Math.ceil(petA.name.length / 2))}${petB.name.substring(Math.floor(petB.name.length / 2))}`;

        const fusedStats = {
            hunger: Math.min(100, (petA.stats.hunger + petB.stats.hunger) / 2 * 1.2),
            happy: Math.min(100, (petA.stats.happy + petB.stats.happy) / 2 * 1.2),
            energy: Math.min(100, (petA.stats.energy + petB.stats.energy) / 2 * 1.2),
            health: Math.min(100, (petB.stats.health || 100)),
            money: (petA.stats.money || 0) + (petB.stats.money || 0),
        };

        const newFusedPet: PetData = {
            name: hybridName,
            type: petA.type, // Could be randomized or a new "hybrid" type
            petImage: petA.image_url || petA.petImage, // Keeps image of first pet for now
            stats: fusedStats,
            monthData: petA.monthData || petA.month_data,
            learnedTricks: [...new Set([...(petA.learnedTricks || []), ...(petB.learnedTricks || [])])],
            shop_upgrades: petA.shop_upgrades || {},
            shop_multipliers: petA.shop_multipliers || {},
            totalExpenses: (petA.totalExpenses || 0) + (petB.totalExpenses || 0),
            savingsGoal: Math.max(petA.savingsGoal || 0, petB.savingsGoal || 0) * 1.5,
            savingsCurrent: 0,
            lastInteraction: Date.now(),
            interactionCount: 0
        };

        // Perform deletions and creation
        await deletePet(petA.id);
        await deletePet(petB.id);
        const { data } = await savePetToCloud(newFusedPet);

        if (data) {
            localStorage.setItem('currentPetId', data.id);
            await loadPets();
        }

        setIsFusing(false);
        setFusionTarget(null);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto pb-32">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                        {pets[0]?.householdName || "Household Lives"}
                        <Sparkles className="w-8 h-8 text-yellow animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground text-lg italic">
                        "Drag pets onto each other to perform a **Life Fusion**."
                    </p>
                </div>
                <Link href="/onboarding">
                    <Button className="rounded-2xl h-12 px-6 font-bold shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5 mr-2" />
                        Adopt New Pet
                    </Button>
                </Link>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-3xl bg-card animate-pulse border-2 border-border/50" />
                    ))}
                </div>
            ) : pets.length === 0 ? (
                <div className="text-center py-24 bg-card/30 rounded-[3rem] border-2 border-dashed border-border/50">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <PawPrint className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">No lives active</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">You haven't adopted any pets to your household yet.</p>
                    <Link href="/onboarding">
                        <Button size="lg" className="rounded-2xl px-12 font-bold">Adopt Now</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pets.map((p, i) => (
                        <motion.div
                            key={p.id}
                            ref={(el) => { cardRefs.current[p.id] = el; }}
                            layoutId={p.id}
                            drag={!editingPetId}
                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                            dragElastic={0.8}
                            dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                            onDragEnd={(e, info) => handleDragEnd(e, info, p)}
                            whileDrag={{ scale: 1.05, zIndex: 50, cursor: 'grabbing' }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                scale: fusionTarget === p.id ? [1, 1.1, 1] : 1,
                                borderColor: fusionTarget === p.id ? 'var(--primary)' : editingPetId === p.id ? 'var(--primary)' : 'rgba(var(--border), 0.5)'
                            }}
                            transition={{
                                delay: i * 0.1,
                                scale: fusionTarget === p.id ? { repeat: Infinity, duration: 0.5 } : { duration: 0.2 }
                            }}
                            className="group relative bg-card rounded-[2.5rem] border-2 overflow-hidden hover:border-primary/50 transition-colors hover:shadow-2xl hover:shadow-primary/5 cursor-grab active:cursor-grabbing"
                        >
                            {/* Manage Menu Trigger */}
                            <div className="absolute top-4 right-4 z-30">
                                <Button
                                    size="icon-xs"
                                    variant="ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMenuId(showMenuId === p.id ? null : p.id);
                                    }}
                                    className="rounded-full bg-black/20 backdrop-blur-md text-white border border-white/20 hover:bg-black/40"
                                >
                                    <Settings2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Contextual Menu */}
                            <AnimatePresence>
                                {showMenuId === p.id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                        className="absolute top-16 right-4 z-40 bg-card border-2 shadow-2xl rounded-2xl p-2 min-w-[140px]"
                                    >
                                        <button
                                            onClick={() => {
                                                setEditingPetId(p.id);
                                                setEditingName(p.name);
                                                setShowMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" /> Rename
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(p.id);
                                                setShowMenuId(null);
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" /> Release
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {fusionTarget === p.id && (
                                <div className="absolute inset-0 z-20 bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                                    <div className="text-center">
                                        <Sparkles className="w-12 h-12 text-primary mx-auto animate-spin" />
                                        <p className="font-black text-primary mt-2 uppercase tracking-widest">Fusing...</p>
                                    </div>
                                </div>
                            )}

                            <div className="aspect-4/3 relative">
                                {p.image_url ? (
                                    <Image src={p.image_url} alt={p.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center">
                                        <PawPrint className="w-12 h-12 text-muted-foreground/30" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="px-2 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                                            {p.type}
                                        </div>
                                    </div>
                                    {editingPetId === p.id ? (
                                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                            <Input
                                                autoFocus
                                                value={editingName}
                                                onChange={(e) => setEditingName(e.target.value)}
                                                className="bg-white/20 border-white/40 text-white font-black text-xl rounded-xl h-10 px-3 focus-visible:ring-primary"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleRename(p);
                                                    if (e.key === 'Escape') setEditingPetId(null);
                                                }}
                                            />
                                            <Button size="icon-xs" onClick={() => handleRename(p)} className="bg-primary hover:bg-primary/80">
                                                <Check className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon-xs" variant="ghost" onClick={() => setEditingPetId(null)} className="text-white hover:bg-white/10">
                                                <RotateCcw className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <h3 className="text-2xl font-black text-white">{p.name}</h3>
                                    )}
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5">
                                            <Heart className="w-4 h-4 text-emerald-500" />
                                            <span className="text-sm font-bold">{Math.round(p.stats.happy)}%</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Zap className="w-4 h-4 text-yellow" />
                                            <span className="text-sm font-bold">{Math.round(p.stats.energy)}%</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-yellow">
                                        <Coins className="w-4 h-4" />
                                        <span className="text-sm font-black">${p.stats.money}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        onClick={() => handleSelectPet(p.id)}
                                        className="rounded-2xl h-12 font-bold group bg-primary/10 text-primary hover:bg-primary hover:text-white border-0"
                                    >
                                        Focus
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <Link href="/dashboard/expenses">
                                        <Button
                                            variant="outline"
                                            onClick={() => localStorage.setItem('currentPetId', p.id)}
                                            className="w-full rounded-2xl h-12 font-bold border-2 hover:bg-card/80"
                                        >
                                            <ReceiptText className="w-4 h-4 mr-2" />
                                            Ledger
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
