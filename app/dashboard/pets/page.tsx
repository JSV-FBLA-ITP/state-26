'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUserPets, deletePet, savePetToCloud } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { PawPrint, Plus, Heart, Zap, Coins, ArrowRight, Settings2, Edit2, Trash2, Check, RotateCcw, Home, ChevronLeft, Users, BarChart3 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { PetData } from '@/lib/gameLogic';
export default function MyPetsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [pets, setPets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingPetId, setEditingPetId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [showMenuId, setShowMenuId] = useState<string | null>(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedHousehold, setSelectedHousehold] = useState<string | null>(null);

    const loadPets = async () => {
        const { data } = await fetchUserPets();
        if (data) setPets(data);
        setLoading(false);
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadPets();
    }, []);

    const handleSelectPet = (petId: string) => {
        localStorage.setItem('currentPetId', petId);
        window.location.assign('/dashboard');
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleRename = async (pet: any) => {
        if (!editingName.trim() || editingName === pet.name) {
            setEditingPetId(null);
            return;
        }

        const dataToSave: PetData = {
            ...pet,
            name: editingName,
            petImage: pet.image_url || pet.petImage,
            monthData: pet.month_data || pet.monthData,
            chatbot_count: pet.chatbot_count || 0,
            image_gen_count: pet.image_gen_count || 0
        };

        const { error } = await savePetToCloud(dataToSave);
        if (!error) {
            await loadPets();
            setEditingPetId(null);
        }
    };

    const handleDelete = async (petId: string) => {
        setIsDeleting(true);
        const { error } = await deletePet(petId);
        if (!error) {
            setConfirmDeleteId(null);
            setShowMenuId(null);
            await loadPets();
        } else {
            console.error('Delete failed:', error);
        }
        setIsDeleting(false);
    };

    // Group pets by household
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const petsByHousehold = pets.reduce((acc: { [key: string]: any[] }, pet) => {
        const hh = pet.household_name || pet.householdName || 'Other';
        if (!acc[hh]) acc[hh] = [];
        acc[hh].push(pet);
        return acc;
    }, {});

    const householdNames = Object.keys(petsByHousehold).sort();

    return (
        <div className="p-8 max-w-7xl mx-auto pb-32">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
                <div>
                    <div className="flex items-center gap-4 mb-2">
                        {selectedHousehold && (
                            <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => setSelectedHousehold(null)}
                                className="rounded-full bg-background/80 shadow-sm border border-border/40 hover:bg-muted"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                        )}
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight flex flex-wrap items-center gap-3">
                            {selectedHousehold ? selectedHousehold : "Household Hub"}
                            <Home className="w-6 h-6 md:w-8 md:h-8 text-primary shadow-sm" />
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2">
                        <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all">
                            <Home className="w-4 h-4" />
                            Dashboard
                        </Link>
                        {selectedHousehold && (
                             <>
                                <div className="w-1 h-1 rounded-full bg-border" />
                                <span className="text-sm font-bold text-muted-foreground px-3 py-1.5">{selectedHousehold}</span>
                             </>
                        )}
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mt-4">
                        {selectedHousehold 
                            ? `Managing ${petsByHousehold[selectedHousehold].length} beloved companion${petsByHousehold[selectedHousehold].length === 1 ? '' : 's'} in this household.`
                            : "Select a household to view and manage its family companions."}
                    </p>
                </div>
                {!selectedHousehold && (
                    <Link href="/onboarding">
                        <Button className="rounded-2xl h-12 md:h-14 px-5 md:px-8 text-sm md:text-base font-extrabold shadow-xl shadow-coral-500/20 bg-linear-to-r from-coral-400 to-orange-100 text-black border-0 hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto">
                            <Plus className="w-5 h-5 md:w-6 md:h-6 mr-1 md:mr-2 shrink-0" />
                            Create Household
                        </Button>
                    </Link>
                )}
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 rounded-[2.5rem] bg-card animate-pulse border-2 border-border/50" />
                    ))}
                </div>
            ) : householdNames.length === 0 ? (
                <div className="text-center py-24 bg-card/30 rounded-[3rem] border-2 border-dashed border-border/50">
                    <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <PawPrint className="w-10 h-10 text-primary" />
                    </div>
                    <h2 className="text-3xl font-black mb-4">No households found</h2>
                    <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Start your journey by adopting your first pet into a new household.</p>
                    <Link href="/onboarding">
                        <Button size="lg" className="rounded-2xl px-12 font-bold">Get Started</Button>
                    </Link>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {!selectedHousehold ? (
                        <motion.div 
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {householdNames.map((hh, index) => {
                                const householdPets = petsByHousehold[hh];
                                const avgHappy = householdPets.reduce((sum, p) => sum + p.stats.happy, 0) / householdPets.length;
                                const totalMoney = householdPets.reduce((sum, p) => sum + p.stats.money, 0);

                                return (
                                    <motion.div
                                        key={hh}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => setSelectedHousehold(hh)}
                                        className="group relative bg-card border-2 border-border/40 rounded-[2.5rem] p-8 cursor-pointer hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-8">
                                            <div className="p-4 rounded-3xl bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                                                <Home className="w-8 h-8 text-blue-500" />
                                            </div>
                                            <div className="flex -space-x-3">
                                                {householdPets.slice(0, 3).map((p, i) => (
                                                    <div 
                                                        key={p.id} 
                                                        className="w-10 h-10 rounded-full border-2 border-card overflow-hidden bg-muted"
                                                        style={{ zIndex: 10 - i }}
                                                    >
                                                        {p.image_url ? (
                                                            <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover" unoptimized />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <PawPrint className="w-4 h-4 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                                {householdPets.length > 3 && (
                                                    <div className="w-10 h-10 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[10px] font-black z-0">
                                                        +{householdPets.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-3xl font-black mb-2 group-hover:text-primary transition-colors">{hh}</h3>
                                        <div className="flex items-center gap-2 mb-8">
                                            <Users className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm font-bold text-muted-foreground">
                                                {householdPets.length} {householdPets.length === 1 ? 'Companion' : 'Companions'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border/40">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Happiness</p>
                                                <div className="flex items-center gap-1.5">
                                                    <Heart className="w-4 h-4 text-rose-500" />
                                                    <span className="font-black">{Math.round(avgHappy)}%</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Budget</p>
                                                <div className="flex items-center gap-1.5">
                                                    <Coins className="w-4 h-4 text-yellow" />
                                                    <span className="font-black">${totalMoney}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                            <ArrowRight className="w-6 h-6 text-primary" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="household-detail"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <h2 className="text-xl md:text-2xl font-black flex items-center gap-3">
                                    <span className="p-2 rounded-xl bg-primary/10">
                                        <PawPrint className="w-5 h-5 text-primary" />
                                    </span>
                                    Companion Registry
                                </h2>
                                <Link href={`/onboarding?household=${encodeURIComponent(selectedHousehold)}`} className="w-full sm:w-auto">
                                    <Button className="rounded-2xl h-12 px-6 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all active:scale-95 w-full sm:w-auto">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Adopt
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {petsByHousehold[selectedHousehold].map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="group relative bg-card rounded-[2.5rem] border-2 border-border/40 overflow-hidden hover:border-primary/50 transition-colors hover:shadow-2xl hover:shadow-primary/5"
                                    >
                                        {/* Manage Menu Trigger */}
                                        <div className="absolute top-4 right-4 z-30">
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowMenuId(showMenuId === p.id ? null : p.id);
                                                }}
                                                className="rounded-full w-9 h-9 bg-black/40 backdrop-blur-md text-white border border-white/20 hover:bg-black/60 shadow-lg"
                                            >
                                                <Settings2 className="w-5 h-5" />
                                            </Button>
                                        </div>

                                        {/* Contextual Menu */}
                                        <AnimatePresence>
                                            {showMenuId === p.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                    className="absolute top-16 right-4 z-40 bg-card border-2 shadow-2xl rounded-2xl p-2 min-w-[180px]"
                                                >
                                                    {confirmDeleteId === p.id ? (
                                                        <div className="px-3 py-2 space-y-2">
                                                            <p className="text-xs font-black text-rose-500 uppercase tracking-wide">Release pet?</p>
                                                            <p className="text-xs text-muted-foreground">This cannot be undone.</p>
                                                            <div className="flex gap-2 mt-2">
                                                                <button
                                                                    disabled={isDeleting}
                                                                    onClick={() => handleDelete(p.id)}
                                                                    className="flex-1 text-xs font-black py-1.5 rounded-lg bg-rose-500 text-white hover:bg-rose-600 border-0 disabled:opacity-50 transition-colors"
                                                                >
                                                                    {isDeleting ? '…' : 'Yes'}
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirmDeleteId(null)}
                                                                    className="flex-1 text-xs font-bold py-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors border-0"
                                                                >
                                                                    No
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingPetId(p.id);
                                                                    setEditingName(p.name);
                                                                    setShowMenuId(null);
                                                                }}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold hover:bg-primary/10 hover:text-primary transition-colors border-0 bg-transparent text-left cursor-pointer"
                                                            >
                                                                <Edit2 className="w-4 h-4" /> Rename
                                                            </button>
                                                            <button
                                                                onClick={() => setConfirmDeleteId(p.id)}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-rose-500 hover:bg-rose-500/10 transition-colors border-0 bg-transparent text-left cursor-pointer"
                                                            >
                                                                <Trash2 className="w-4 h-4" /> Release
                              </button>
                                                        </>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="aspect-square relative overflow-hidden bg-muted/20">
                                            {p.image_url ? (
                                                <Image src={p.image_url} alt={p.name} fill className="object-contain group-hover:scale-105 transition-transform duration-700" unoptimized />
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
                                                        <Button size="icon" className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/80 shrink-0">
                                                            <Check className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" onClick={() => setEditingPetId(null)} className="w-8 h-8 rounded-lg text-white hover:bg-white/10 shrink-0">
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
                                                    className="rounded-2xl h-12 group bg-primary/10 text-primary hover:bg-primary hover:text-white border-0 transition-all font-black uppercase tracking-wide"
                                                >
                                                    Play
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                                <Link href="/dashboard/stats" className="w-full">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => localStorage.setItem('currentPetId', p.id)}
                                                        className="w-full rounded-2xl h-12 border-2 hover:bg-card/80 font-black uppercase tracking-wide"
                                                    >
                                                        <BarChart3 className="w-4 h-4 mr-2" />
                                                        Stats
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
}
