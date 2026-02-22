'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ArrowUpRight, ShoppingCart, Zap, Heart, Utensils, Coffee } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    money: number;
    onPurchase: (stat: string, cost: number) => void;
}

const UPGRADES = [
    { id: 'hunger', name: 'Auto-Feeder', cost: 150, icon: Utensils, desc: 'Slows down hunger decay significantly.' },
    { id: 'happy', name: 'Toy Box', cost: 200, icon: Heart, desc: 'Increases happiness gain from play.' },
    { id: 'energy', name: 'Premium Bed', cost: 250, icon: Zap, desc: 'Restores energy faster while sleeping.' },
    { id: 'health', name: 'Vitamin Pack', cost: 300, icon: Coffee, desc: 'Boosts base health recovery.' },
];

export function ShopOverlay({ isOpen, onClose, money, onPurchase }: Props) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/50"
                    >
                        <div className="p-8 border-b border-border/50 flex items-center justify-between bg-primary/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-primary/10">
                                    <ShoppingCart className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black tracking-tight uppercase">Pet Shop</h2>
                                    <p className="text-sm text-muted-foreground font-bold">Enhance your companion's life</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {UPGRADES.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-6 rounded-3xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 rounded-2xl bg-white shadow-sm border border-border/50 group-hover:scale-110 transition-transform">
                                            <item.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Cost</p>
                                            <p className="text-lg font-black text-primary">${item.cost}</p>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground mb-6">{item.desc}</p>

                                    <Button
                                        variant={money >= item.cost ? 'default' : 'secondary'}
                                        disabled={money < item.cost}
                                        onClick={() => onPurchase(item.id, item.cost)}
                                        className="w-full rounded-xl font-bold"
                                    >
                                        {money >= item.cost ? 'Purchase Upgrade' : 'Insufficient Funds'}
                                        <ArrowUpRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-muted/50 border-t border-border/50 flex justify-between items-center">
                            <div>
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Available Balance</p>
                                <p className="text-2xl font-black text-primary">${money}</p>
                            </div>
                            <Button variant="outline" onClick={onClose} className="rounded-xl">Close Shop</Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
