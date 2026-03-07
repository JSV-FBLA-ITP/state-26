/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Card } from '@/components/ui/card';
import { PawPrint, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export const PET_TYPES = [
    { id: 'dog', name: 'Dog', icon: 'https://plus.unsplash.com/premium_photo-1694819488591-a43907d1c5cc?q=80&w=828&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    { id: 'cat', name: 'Cat', icon: 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=400&q=80' },
    { id: 'hamster', name: 'Hamster', icon: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=400&q=80' },
    { id: 'rabbit', name: 'Rabbit', icon: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&q=80' },
];

interface Props {
    selected: string;
    onSelect: (type: string) => void;
}

export function PetTypeSelector({ selected, onSelect }: Props) {
    return (
        <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Select Your Companion</h2>
            <p className="text-muted-foreground mb-8 text-lg">Every journey begins with a first friend. Who will it be?</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {PET_TYPES.map((type) => (
                    <Card
                        key={type.id}
                        onClick={() => onSelect(type.id)}
                        className={`group cursor-pointer p-0 overflow-hidden relative border-2 transition-all duration-300 rounded-3xl ${selected === type.id
                            ? 'border-primary ring-4 ring-primary/10 scale-[1.02]'
                            : 'border-border/50 hover:border-primary/30 hover:shadow-xl'
                            }`}
                    >
                        <div className="aspect-square relative flex items-center justify-center p-4">
                            <Image
                                src={type.icon}
                                alt={type.name}
                                fill
                                className={`object-cover transition-transform duration-500 ${selected === type.id ? 'scale-110' : 'group-hover:scale-105'}`}
                            />
                            <div className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity ${selected === type.id ? 'opacity-90' : 'group-hover:opacity-70'}`} />

                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                <span className="text-white font-bold text-lg">{type.name}</span>
                                {selected === type.id && (
                                    <CheckCircle2 className="w-5 h-5 text-primary fill-primary-foreground rounded-full" />
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}