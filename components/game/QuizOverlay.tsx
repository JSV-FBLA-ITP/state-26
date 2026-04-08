'use client';

/**
 * PetPal Game: Financial Literacy Quiz Engine
 * 
 * The primary educational vehicle of the application. 
 * Presents multiple-choice questions on real-world banking, pet care costs, 
 * and budgeting concepts.
 * 
 * EDUCATIONAL DESIGN:
 * 1. Immediate Feedback: Highlights correct/incorrect answers with logic explanations.
 * 2. Rewarded Learning: Granting in-game currency for successful performance to build positive financial habits.
 */

import { useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, GraduationCap, Trophy, CheckCircle2, AlertCircle } from 'lucide-react';
import { QUIZ_QUESTIONS, QuizQuestion, shuffleArray } from '@/lib/gameLogic';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (reward: number) => void;
    inline?: boolean;
}

export function QuizOverlay({ isOpen, onClose, onComplete, inline }: Props) {
    const [level, setLevel] = useState<'easy' | 'medium' | 'hard' | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);

    const startQuiz = (diff: 'easy' | 'medium' | 'hard') => {
        const questions = shuffleArray(QUIZ_QUESTIONS[diff]);
        setLevel(diff);
        setCurrentQuestion(questions[0]);
        setScore(0);
        setSelectedIndex(null);
        setIsAnswered(false);
    };

    const handleLevelSelect = (diff: 'easy' | 'medium' | 'hard') => {
        startQuiz(diff);
    };

    const handleAnswerSelect = (index: number) => {
        if (isAnswered) return;
        setSelectedIndex(index);
        setIsAnswered(true);

        if (index === currentQuestion?.correct) {
            setScore(1);
        }
    };

    const handleFinish = () => {
        const rewards = { easy: 50, medium: 100, hard: 200 };
        if (score > 0 && level) {
            onComplete(rewards[level]);
        }
        reset();
        if (!inline) onClose();
    };

    const reset = () => {
        setLevel(null);
        setCurrentQuestion(null);
        setSelectedIndex(null);
        setIsAnswered(false);
        setScore(0);
    };

    if (!isOpen && !inline) return null;

    const content = (
        <motion.div
            initial={inline ? { opacity: 0, x: 20 } : { scale: 0.9, opacity: 0, y: 20 }}
            animate={inline ? { opacity: 1, x: 0 } : { scale: 1, opacity: 1, y: 0 }}
            exit={inline ? { opacity: 0, x: 20 } : { scale: 0.9, opacity: 0, y: 20 }}
            className={inline
                ? "flex-1 min-h-0 flex flex-col w-full"
                : "relative w-full max-w-2xl bg-card rounded-[2.5rem] shadow-2xl overflow-hidden border border-border/50 max-h-[90vh] flex flex-col"}
        >
            <div className={`p-8 flex items-center justify-between shrink-0 ${inline ? 'pb-2' : 'border-b border-border/50 bg-primary/5'}`}>
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-primary/10">
                        <GraduationCap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">Financially Prepare for Your Pet</h2>
                        <p className="text-sm text-muted-foreground font-bold">Earn money while you learn</p>
                    </div>
                </div>
                {!inline && (
                    <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
                        <X className="w-6 h-6" />
                    </Button>
                )}
            </div>

            <div className={`p-8 ${inline ? 'overflow-y-auto custom-scrollbar flex-1 min-h-0' : 'min-h-[400px] flex flex-col justify-center overflow-y-auto'}`}>
                {!level ? (
                    <div className="space-y-6">
                        <div className="text-center mb-8">
                            <h3 className="text-xl font-bold mb-2">Select Your Difficulty</h3>
                            <p className="text-muted-foreground text-sm">Harder questions give much bigger rewards!</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { id: 'easy', label: 'Beginner', reward: '$50', bg: 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 hover:border-emerald-500', text: 'text-emerald-500' },
                                { id: 'medium', label: 'Intermediate', reward: '$100', bg: 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 hover:border-amber-500', text: 'text-amber-500' },
                                { id: 'hard', label: 'Financial Pro', reward: '$200', bg: 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 hover:border-rose-500', text: 'text-rose-500' },
                            ].map((d) => (
                                <Button
                                    key={d.id}
                                    onClick={() => handleLevelSelect(d.id as any)}
                                    variant="outline"
                                    className={`h-32 rounded-3xl flex flex-col gap-2 border-2 transition-all ${d.bg} ${d.text}`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Level</span>
                                    <span className="text-lg font-black">{d.label}</span>
                                    <span className="font-bold opacity-80">Reward: {d.reward}</span>
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : currentQuestion ? (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Challenge</p>
                            <h3 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {currentQuestion.options.map((opt, i) => {
                                const isCorrect = i === currentQuestion.correct;
                                const isSelected = i === selectedIndex;

                                let statusStyles = "bg-muted/30 border-border/50";
                                if (isAnswered) {
                                    if (isCorrect) statusStyles = "bg-emerald-500/10 border-emerald-500 scale-[1.02] shadow-emerald-500/10";
                                    else if (isSelected && !isCorrect) statusStyles = "bg-rose-500/10 border-rose-500 opacity-60";
                                    else statusStyles = "opacity-40";
                                }

                                return (
                                    <button
                                        key={i}
                                        disabled={isAnswered}
                                        onClick={() => handleAnswerSelect(i)}
                                        className={`w-full p-6 text-left rounded-2xl border-2 transition-all flex items-center justify-between group ${statusStyles} ${!isAnswered ? 'hover:border-primary hover:bg-primary/10' : ''}`}
                                    >
                                        <span className="font-bold">{opt}</span>
                                        {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                        {isAnswered && isSelected && !isCorrect && <AlertCircle className="w-5 h-5 text-rose-500" />}
                                    </button>
                                );
                            })}
                        </div>

                        {isAnswered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="pt-4"
                            >
                                <Button
                                    onClick={handleFinish}
                                    className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20"
                                >
                                    {score > 0 ? (
                                        <span className="flex items-center gap-2"><Trophy className="w-5 h-5" /> Claim Your Reward!</span>
                                    ) : (
                                        "Maybe Next Time"
                                    )}
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                ) : null}
            </div>
        </motion.div>
    );

    if (inline) {
        return content;
    }

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
                    {content}
                </div>
            )}
        </AnimatePresence>
    );
}
