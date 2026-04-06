'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, ShoppingCart, Zap, Heart, Utensils, Coffee, Coins } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    money: number;
    onPurchase: (stat: string, cost: number) => void;
    inline?: boolean;
}

const UPGRADES = [
    {
        id: 'hunger', name: 'Auto-Feeder', cost: 150, icon: Utensils,
        desc: 'Slows down hunger decay significantly.',
        bg: 'bg-coral-400/10', border: 'hover:border-coral-400/50', iconColor: 'text-coral-400', iconBg: 'bg-coral-400/15',
    },
    {
        id: 'happy', name: 'Toy Box', cost: 200, icon: Heart,
        desc: 'Increases happiness gain from play sessions.',
        bg: 'bg-sage-400/10', border: 'hover:border-sage-400/50', iconColor: 'text-sage-400', iconBg: 'bg-sage-400/15',
    },
    {
        id: 'energy', name: 'Premium Bed', cost: 250, icon: Zap,
        desc: 'Restores energy faster while your pet sleeps.',
        bg: 'bg-coral-500/10', border: 'hover:border-coral-500/50', iconColor: 'text-coral-500', iconBg: 'bg-coral-500/15',
    },
    {
        id: 'health', name: 'Vitamin Pack', cost: 300, icon: Coffee,
        desc: 'Boosts base health recovery rate permanently.',
        bg: 'bg-sage-500/10', border: 'hover:border-sage-500/50', iconColor: 'text-sage-500', iconBg: 'bg-sage-500/15',
    },
];

export function ShopOverlay({ isOpen, onClose, money, onPurchase, inline }: Props) {
    if (!isOpen && !inline) return null;

    const content = (
        <motion.div
            initial={inline ? { opacity: 0, x: 20 } : { scale: 0.9, opacity: 0, y: 20 }}
            animate={inline ? { opacity: 1, x: 0 } : { scale: 1, opacity: 1, y: 0 }}
            exit={inline ? { opacity: 0, x: 20 } : { scale: 0.9, opacity: 0, y: 20 }}
            transition={{ ease: 'easeOut', duration: 0.25 }}
            className={inline
                ? "flex-1 min-h-0 flex flex-col w-full"
                : "relative w-full max-w-2xl bg-card/90 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/50 max-h-[90vh] flex flex-col"}
        >
            {/* Header */}
            <div className={`px-8 py-6 shrink-0 flex items-center justify-between ${inline ? 'pb-2' : 'border-b border-border/50 bg-linear-to-r from-coral-500/10 to-transparent'}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-coral-500/15">
                        <ShoppingCart className="w-6 h-6 text-coral-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight">{inline ? 'Shop' : 'Supply Store'}</h2>
                        <p className="text-sm text-muted-foreground font-bold">Permanent upgrades for your companion</p>
                    </div>
                </div>
                {!inline && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                        <X className="w-5 h-5" />
                    </Button>
                )}
            </div>

            {/* Grid */}
            <div className={`p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 ${inline ? 'overflow-y-auto custom-scrollbar flex-1 min-h-0' : 'overflow-y-auto'}`}>
                {UPGRADES.map((item, i) => {
                    const canAfford = money >= item.cost;
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className={`p-5 rounded-3xl border border-border/50 ${item.border} ${item.bg} transition-all group`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-11 h-11 rounded-xl ${item.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <item.icon className={`w-5 h-5 ${item.iconColor}`} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black uppercase text-muted-foreground mb-0.5">Cost</p>
                                    <p className={`text-lg font-black ${canAfford ? item.iconColor : 'text-muted-foreground'}`}>${item.cost}</p>
                                </div>
                            </div>
                            <h3 className="font-bold text-base mb-1">{item.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{item.desc}</p>
                            <Button
                                disabled={!canAfford}
                                onClick={() => onPurchase(item.id, item.cost)}
                                className={`w-full rounded-xl font-bold text-sm h-10 ${canAfford ? '' : 'opacity-50'}`}
                                variant={canAfford ? 'default' : 'secondary'}
                            >
                                {canAfford ? 'Buy Upgrade' : 'Insufficient Funds'}
                            </Button>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer balance */}
            <div className="px-8 py-5 bg-muted/30 border-t border-border/50 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sage-500/10">
                        <Coins className="w-5 h-5 text-sage-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Balance</p>
                        <p className="text-xl font-black text-sage-500">${money}</p>
                    </div>
                </div>
                {!inline && <Button variant="outline" onClick={onClose} className="rounded-xl font-bold">Done</Button>}
            </div>
        </motion.div>
    );

    if (inline) {
        return content;
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />
                    {content}
                </div>
            )}
        </AnimatePresence>
    );
}
