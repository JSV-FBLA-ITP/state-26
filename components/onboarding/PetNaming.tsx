'use client';

import { Input } from '@/components/ui/input';
import { Type } from 'lucide-react';

interface Props {
    name: string;
    onNameChange: (name: string) => void;
}

export function PetNaming({ name, onNameChange }: Props) {
    return (
        <div className="max-w-xl mx-auto text-center">
            <h2 className="text-4xl font-bold tracking-tight mb-2">One Last Thing...</h2>
            <p className="text-muted-foreground mb-12 text-lg">Every companion needs a name. What will you call your new friend?</p>

            <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-primary to-indigo-500 rounded-3xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000" />
                <div className="relative">
                    <Input
                        placeholder="e.g. Luna, Bolt, Pixel..."
                        value={name}
                        onChange={(e) => onNameChange(e.target.value)}
                        className="rounded-[1.5rem] h-20 bg-background text-3xl font-bold text-center px-10 border-2 border-border focus-visible:ring-0 focus-visible:border-primary transition-all"
                        maxLength={12}
                        autoFocus
                    />
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-muted/50">
                        <Type className="w-6 h-6 text-muted-foreground" />
                    </div>
                </div>
            </div>

            <p className="mt-6 text-base text-foreground/80 font-bold flex items-center justify-center gap-2">
                <span>Letters and spaces only</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>Max 12 characters</span>
            </p>
        </div>
    );
}
