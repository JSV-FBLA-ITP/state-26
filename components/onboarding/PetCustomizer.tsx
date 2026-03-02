'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Wand2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface Props {
    petType: string;
    image: string;
    onImageChange: (image: string) => void;
}

export function PetCustomizer({ petType, image, onImageChange }: Props) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const placeholders: Record<string, string> = {
        dog: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80',
        cat: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&q=80',
        hamster: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800&q=80',
        rabbit: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80',
    };

    const simulateGeneration = async () => {
        setIsGenerating(true);
        // In a real app, this would call HuggingFace or similar
        await new Promise(r => setTimeout(r, 2000));
        onImageChange(placeholders[petType] || placeholders.dog);
        setIsGenerating(false);
    };

    const handleSkip = () => {
        onImageChange(placeholders[petType] || placeholders.dog);
    };

    return (
        <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">Style Your Friend</h2>
            <p className="text-muted-foreground mb-8 text-lg">Use AI to generate a unique look for your {petType}.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div className="flex flex-col gap-2">
                        <div className="relative">
                            <Input
                                placeholder="e.g. wearing a tiny top hat, cosmic fur, cyborg accessories..."
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="rounded-2xl h-14 bg-background px-5 pr-32 border-2 focus-visible:ring-primary/20"
                            />
                            <Button
                                onClick={simulateGeneration}
                                disabled={isGenerating}
                                className="absolute right-2 top-2 bottom-2 rounded-xl px-4"
                            >
                                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                {isGenerating ? 'Magic...' : 'Generate'}
                            </Button>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSkip}
                            disabled={isGenerating}
                            className="w-fit ml-1 text-muted-foreground hover:text-primary transition-colors"
                        >
                            Skip AI and use default
                        </Button>
                    </div>

                    <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10">
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-xl bg-primary/10">
                                <Sparkles className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-bold text-primary mb-1">AI Design Helper</h4>
                                <p className="text-sm text-primary/70">
                                    Try prompts like "rainbow colored fur", "golden armor", or "cyberpunk aesthetics" for the best results.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="aspect-square rounded-[2rem] bg-muted/30 border-2 border-dashed border-border/50 flex items-center justify-center relative overflow-hidden">
                    {image ? (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full h-full"
                        >
                            <Image src={image} alt="Generated pet" fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
                        </motion.div>
                    ) : (
                        <div className="text-center p-8">
                            <div className="w-16 h-16 rounded-3xl bg-background flex items-center justify-center mx-auto mb-4 border border-border shadow-sm">
                                <Wand2 className="w-8 h-8 text-muted-foreground/50" />
                            </div>
                            <p className="text-muted-foreground font-medium">Your AI-generated pet will appear here.</p>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center">
                            <RefreshCw className="w-10 h-10 text-primary animate-spin mb-4" />
                            <p className="font-bold text-primary animate-pulse">Consulting the magic mirrors...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
