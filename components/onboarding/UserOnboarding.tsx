'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Home, PlusCircle, CheckCircle2, Sparkles, Calculator, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Props {
    householdName: string;
    onHouseholdChange: (name: string, ownerName: string, monthlyIncome?: number, monthlyExpenses?: number) => void;
    preselectedHousehold?: string;
    initialIncome?: number;
    initialExpenses?: number;
}

const US_AREAS = [
    { name: 'Very Low Cost (rural LCOL)', multiplier: 0.6 },
    { name: 'Low Cost Area', multiplier: 0.8 },
    { name: 'Medium Cost Area', multiplier: 1.0 },
    { name: 'High Cost Area (HCOL)', multiplier: 1.3 },
    { name: 'Very High Cost (VHCOL)', multiplier: 1.6 },
];

const EXPENSE_FACTORS = [
    { label: '1 Person', value: 1 },
    { label: '2 People', value: 1.8 },
    { label: '3 People', value: 2.4 },
    { label: '4+ People', value: 3.0 },
];

export function UserOnboarding({ householdName, onHouseholdChange, preselectedHousehold, initialIncome, initialExpenses }: Props) {
    const [existingHouseholds, setExistingHouseholds] = useState<{ name: string; ownerName: string }[]>([]);
    const [mode, setMode] = useState<'pick' | 'new'>('pick');
    const [newName, setNewName] = useState('');
    const [monthlyIncome, setMonthlyIncome] = useState(initialIncome?.toString() || '');
    const [monthlyExpenses, setMonthlyExpenses] = useState(initialExpenses?.toString() || '');
    const [useCalculator, setUseCalculator] = useState(false);
    const [selectedArea, setSelectedArea] = useState(2);
    const [householdSize, setHouseholdSize] = useState(1);
    const [showCalculator, setShowCalculator] = useState(false);
    const [deletingHousehold, setDeletingHousehold] = useState<string | null>(null);

    const handleDeleteHousehold = async (householdName: string) => {
        const { deleteHousehold } = await import('@/lib/storage');
        const { error } = await deleteHousehold(householdName);
        if (!error) {
            setExistingHouseholds(prev => prev.filter(h => h.name !== householdName));
            if (householdName === householdName) {
                setMode('pick');
            }
        }
        setDeletingHousehold(null);
    };

    // Fetch all unique households the user already has
    useEffect(() => {
        const load = async () => {
            try {
                const { fetchUserPets } = await import('@/lib/storage');
                const { data } = await fetchUserPets();
                if (data && data.length > 0) {
                    const seen = new Set<string>();
                    const households: { name: string; ownerName: string }[] = [];
                    for (const p of data) {
                        const n = p.household_name || p.householdName;
                        if (n && !seen.has(n)) {
                            seen.add(n);
                            households.push({ name: n, ownerName: p.owner_name || p.ownerName || '' });
                        }
                    }
                    setExistingHouseholds(households);

                    // Pre-select from URL param or auto-select if only one
                    if (preselectedHousehold) {
                        const match = households.find(h => h.name === preselectedHousehold);
                        if (match) {
                            onHouseholdChange(match.name, match.ownerName);
                            return;
                        }
                    }
                    // No pre-select, stay in pick mode
                } else {
                    // No pets yet — go straight to new household creation
                    setMode('new');
                }
            } catch {
                setMode('new');
            }
        };
        load();
    }, []);

    const handleNewSubmit = () => {
        const trimmed = newName.trim();
        if (trimmed.length < 2) return;
        const income = monthlyIncome ? parseFloat(monthlyIncome) : undefined;
        const expenses = monthlyExpenses ? parseFloat(monthlyExpenses) : undefined;
        onHouseholdChange(trimmed, trimmed, income, expenses);
    };

    const calculateExpenses = () => {
        const baseExpenses = 3000;
        const areaMultiplier = US_AREAS[selectedArea].multiplier;
        const sizeMultiplier = EXPENSE_FACTORS[householdSize - 1].value;
        const calculated = Math.round(baseExpenses * areaMultiplier * sizeMultiplier);
        setMonthlyExpenses(calculated.toString());
        setShowCalculator(false);
    };

    const handleIncomeChange = (value: string) => {
        setMonthlyIncome(value);
        const income = value ? parseFloat(value) : undefined;
        const expenses = monthlyExpenses ? parseFloat(monthlyExpenses) : undefined;
        if (newName.trim().length >= 2) {
            onHouseholdChange(newName.trim(), newName.trim(), income, expenses);
        }
    };

    const handleExpensesChange = (value: string) => {
        setMonthlyExpenses(value);
        const income = monthlyIncome ? parseFloat(monthlyIncome) : undefined;
        const expenses = value ? parseFloat(value) : undefined;
        if (newName.trim().length >= 2) {
            onHouseholdChange(newName.trim(), newName.trim(), income, expenses);
        }
    };

    return (
        <div className="space-y-6 py-2">
            <div className="text-center space-y-2 mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <Home className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">Choose a Household</h2>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Select an existing household or create a new one for your new pet.
                </p>
            </div>

            {existingHouseholds.length > 0 && (
                <div className="space-y-3 mb-4">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Your Households</p>
                    {existingHouseholds.map((h) => (
                        <div key={h.name} className="flex items-center gap-2">
                            <button
                                onClick={() => { onHouseholdChange(h.name, h.ownerName); setMode('pick'); }}
                                className={`flex-1 flex items-center justify-between px-5 py-4 rounded-2xl border-2 font-bold text-left transition-all ${householdName === h.name
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-border/50 bg-card/50 hover:border-primary/50 hover:bg-primary/5'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Home className="w-4 h-4 shrink-0" />
                                    <span>{h.name}</span>
                                </div>
                                {householdName === h.name && <CheckCircle2 className="w-5 h-5 text-primary" />}
                            </button>
                            <AlertDialog open={deletingHousehold === h.name} onOpenChange={(open) => setDeletingHousehold(open ? h.name : null)}>
                                <AlertDialogTrigger asChild>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); }}
                                        className="p-3 rounded-2xl border-2 border-border/50 bg-card/50 hover:bg-red-500/10 hover:border-red-500/50 text-muted-foreground hover:text-red-500 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Household</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete "{h.name}"? This will also delete all pets in this household. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() => handleDeleteHousehold(h.name)}
                                            className="bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            Delete
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    ))}
                </div>
            )}

            {/* New household toggle */}
            <div>
                <button
                    onClick={() => setMode(m => m === 'new' ? 'pick' : 'new')}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border-2 font-bold transition-all ${mode === 'new'
                        ? 'border-blue-500/60 bg-blue-500/10 text-blue-500'
                        : 'border-dashed border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary'
                        }`}
                >
                    <PlusCircle className="w-4 h-4 shrink-0" />
                    New Household
                </button>

                <AnimatePresence>
                    {mode === 'new' && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ ease: 'easeInOut', duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-3 relative">
                                <Input
                                    autoFocus
                                    value={newName}
                                    onChange={(e) => {
                                        setNewName(e.target.value);
                                        if (e.target.value.trim().length >= 2) {
                                            const income = monthlyIncome ? parseFloat(monthlyIncome) : undefined;
                                            const expenses = monthlyExpenses ? parseFloat(monthlyExpenses) : undefined;
                                            onHouseholdChange(e.target.value.trim(), e.target.value.trim(), income, expenses);
                                        }
                                    }}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleNewSubmit(); }}
                                    placeholder="e.g. The Johnson Family"
                                    className="h-12 rounded-2xl border-2 px-4 focus-visible:ring-0 focus-visible:border-primary transition-colors"
                                />
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: newName.length >= 2 ? 1 : 0 }}
                                    className="absolute right-4 top-1/2 mt-1.5 -translate-y-1/2"
                                >
                                    <Sparkles className="w-5 h-5 text-yellow animate-pulse" />
                                </motion.div>
                            </div>

                            {newName.length >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-4 mt-4"
                                >
                                    <p className="text-sm font-bold text-primary">
                                        Household &ldquo;{newName.trim()}&rdquo; will be created ✓
                                    </p>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold text-foreground">Gross Monthly Income</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                            <Input
                                                type="number"
                                                value={monthlyIncome}
                                                onChange={(e) => handleIncomeChange(e.target.value)}
                                                placeholder="e.g. 5000"
                                                className="h-11 rounded-xl border-2 pl-8 pr-4"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <Label className="text-sm font-semibold text-foreground">Average Monthly Expenses</Label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                                            <Input
                                                type="number"
                                                value={monthlyExpenses}
                                                onChange={(e) => handleExpensesChange(e.target.value)}
                                                placeholder="e.g. 3500"
                                                className="h-11 rounded-xl border-2 pl-8 pr-4"
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowCalculator(!showCalculator)}
                                            className="w-full h-9 rounded-lg text-sm font-medium gap-2"
                                        >
                                            <Calculator className="w-4 h-4" />
                                            Calculate based on area
                                            {showCalculator ? <ChevronUp className="w-3 h-3 ml-auto" /> : <ChevronDown className="w-3 h-3 ml-auto" />}
                                        </Button>

                                        <AnimatePresence>
                                            {showCalculator && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="bg-muted/50 rounded-xl p-4 space-y-4 border">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-semibold text-muted-foreground">Cost of Living Area</Label>
                                                            <div className="grid grid-cols-1 gap-1">
                                                                {US_AREAS.map((area, i) => (
                                                                    <button
                                                                        key={area.name}
                                                                        onClick={() => setSelectedArea(i)}
                                                                        className={`px-3 py-2 rounded-lg text-sm font-medium text-left transition-all ${selectedArea === i ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-primary/10'}`}
                                                                    >
                                                                        {area.name}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-semibold text-muted-foreground">Household Size</Label>
                                                            <div className="flex gap-1">
                                                                {EXPENSE_FACTORS.map((factor, i) => (
                                                                    <button
                                                                        key={factor.label}
                                                                        onClick={() => setHouseholdSize(i + 1)}
                                                                        className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${householdSize === i + 1 ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-primary/10'}`}
                                                                    >
                                                                        {factor.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <Button
                                                            type="button"
                                                            onClick={calculateExpenses}
                                                            className="w-full h-10 rounded-lg font-medium"
                                                        >
                                                            Calculate Expenses
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
