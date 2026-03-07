import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Wand2, RefreshCw, AlertCircle, Palette } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    petType: string;
    image: string;
    onImageChange: (image: string) => void;
}

const SUGGESTIONS = [
    'wearing a tiny top hat and monocle',
    'cosmic fur with glowing stars',
    'cyberpunk neon accessories',
    'majestic golden armor',
    'vibrant rainbow patterns',
    'steampunk goggles and leather vest',
];

export function PetCustomizer({ petType, image, onImageChange }: Props) {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateImage = async () => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt) return;

        setIsGenerating(true);
        setError(null);

        try {
            const fullPrompt = `A cute ${petType}, ${trimmedPrompt}, digital art, vibrant colors, studio lighting, high quality`;
            const res = await fetch('/api/generate-pet-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: fullPrompt }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Image generation failed');
            }

            onImageChange(data.imageUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center gap-3">
                <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-9 h-9 bg-fuchsia-500/10 rounded-xl flex items-center justify-center border border-fuchsia-500/20 shrink-0"
                >
                    <Palette className="w-4 h-4 text-fuchsia-500" />
                </motion.div>
                <div>
                    <h2 className="text-xl font-black tracking-tight text-foreground leading-tight">Style Your Friend</h2>
                    <p className="text-muted-foreground text-xs">
                        Use our AI mirror to create a unique look for your {petType}.
                    </p>
                </div>
            </div>

            {/* Input row */}
            <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Describe their look</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder={`e.g. wearing a tiny top hat...`}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && generateImage()}
                        className="flex-1 rounded-xl h-11 bg-card/50 px-4 border border-border/60 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary transition-all text-sm"
                    />
                    <Button
                        onClick={generateImage}
                        disabled={isGenerating || !prompt.trim()}
                        className="h-11 px-4 rounded-xl gap-2 shadow-lg shadow-primary/20 shrink-0"
                    >
                        {isGenerating
                            ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /><span className="text-sm font-semibold">Generating…</span></>
                            : <><Wand2 className="w-3.5 h-3.5" /><span className="text-sm font-semibold">Generate</span></>
                        }
                    </Button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-center gap-2 text-xs text-destructive font-medium p-2.5 bg-destructive/10 rounded-lg border border-destructive/20"
                        >
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Suggestions */}
            <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-fuchsia-500" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">Suggestions</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {SUGGESTIONS.map((s) => (
                        <button
                            key={s}
                            onClick={() => setPrompt(s)}
                            className="px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary border border-border/40 hover:border-primary/30 transition-all text-xs font-medium whitespace-nowrap shrink-0"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Image preview */}
            <div className="h-52 rounded-2xl bg-card/30 border border-dashed border-border/50 flex items-center justify-center relative overflow-hidden group">
                <AnimatePresence mode="wait">
                    {image ? (
                        <motion.div
                            key="pet-image"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-full h-full"
                        >
                            <div className="w-full h-full overflow-hidden relative">
                                <Image src={image} alt="Generated pet" fill className="object-cover" unoptimized />
                                <div className="absolute inset-0 ring-1 ring-inset ring-black/10" />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center space-y-2"
                        >
                            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center mx-auto border border-border/50 group-hover:scale-110 transition-transform duration-500">
                                <Wand2 className="w-5 h-5 text-muted-foreground/40" />
                            </div>
                            <div>
                                <p className="text-muted-foreground font-semibold text-sm">Preview will appear here</p>
                                <p className="text-xs text-muted-foreground/50 mt-0.5">Describe a style and click Generate</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isGenerating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-background/85 backdrop-blur-md flex flex-col items-center justify-center z-20 gap-3"
                    >
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full border-[3px] border-primary/20 border-t-primary animate-spin" />
                            <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-primary animate-pulse" />
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-bold text-foreground">Creating your look…</p>
                            <p className="text-xs text-muted-foreground mt-0.5">This takes about 10 seconds</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
