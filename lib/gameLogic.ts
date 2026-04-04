/**
 * =============================================================================
 * GAME LOGIC MODULE (Modernized for State)
 * =============================================================================
 * Pure functions for PetPal virtual pet game.
 * Updated with better type definitions and state management.
 */

export interface PetStats {
    hunger: number;
    happy: number;
    energy: number;
    health: number;
    money: number;
    [key: string]: number;
}

export interface MonthData {
    currentMonth: number;
    requiredActions: ActionType[];
    actionsCompleted: Record<string, number>;
}

export interface PetData {
    id?: string;               // Optional UUID from Supabase
    type: string;
    name: string;
    ownerName?: string;
    householdName?: string;
    petImage: string;
    stats: PetStats;
    learnedTricks: string[];
    totalExpenses: number;
    savingsGoal: number;
    savingsCurrent: number;
    lastInteraction: number;
    interactionCount: number;
    shop_multipliers: Record<string, number>;
    shop_upgrades: Record<string, number>;
    monthData: MonthData;
    monthlyIncome?: number;
    monthlyExpenses?: number;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correct: number;
}

export interface EmotionData {
    emotion: string;
    emoji: string;
}

export type ActionType = 'feed' | 'play' | 'sleep' | 'clean' | 'healthCheck';

// Game Constants
export const TRICK_LEARNING_DELAY = 10000;
export const TRICK_COOLDOWN_DURATION = 10000;
export const HAPPINESS_INCREMENT = 10;
export const ALL_ACTIONS: ActionType[] = ['feed', 'play', 'healthCheck', 'sleep', 'clean'];

export const ACTION_LABELS: Record<ActionType, string> = {
    feed: 'Utensils Feed',
    play: 'Gamepad2 Play',
    sleep: 'Moon Sleep',
    clean: 'Sparkles Clean',
    healthCheck: 'Pill Health Check',
};

export const ACTION_COSTS: Record<ActionType, number> = {
    feed: 10,
    play: 15,
    sleep: 5,
    clean: 8,
    healthCheck: 20,
};

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    easy: [
        { question: "What is the primary purpose of a budget?", options: ["To track spending and plan expenses", "To avoid paying taxes", "To keep money in a bank", "To invest in stocks"], correct: 0 },
        { question: "Which of these is NOT a type of expense?", options: ["Saving money", "Buying groceries", "Paying rent", "Gas for your car"], correct: 0 },
        { question: "What does compound interest mean?", options: ["Interest earned on interest", "Simple interest rates", "No interest at all", "Negative interest"], correct: 0 },
        { question: "What is inflation?", options: ["An increase in prices over time", "A decrease in money value", "Rising prices of goods", "All of the above"], correct: 3 },
        { question: "What is a debit card?", options: ["A card that spends your own money", "A card that borrows money", "A card that earns interest", "A savings card"], correct: 0 },
    ],
    medium: [
        { question: "If you earn $2000/month and spend $1500, what's your savings rate?", options: ["75%", "25%", "50%", "33%"], correct: 1 },
        { question: "What is the difference between gross and net income?", options: ["Gross is before taxes, net is after taxes", "They are the same thing", "Gross is annual, net is monthly", "Gross is investments, net is savings"], correct: 0 },
        { question: "What does diversification mean in investing?", options: ["Spreading investments across different assets", "Putting all money in one place", "Moving money frequently", "Only investing in stocks"], correct: 0 },
        { question: "If an item costs $50 and 20% off, what's the final price?", options: ["$30", "$40", "$35", "$45"], correct: 1 },
        { question: "What is an emergency fund for?", options: ["Covering unexpected expenses", "Vacation savings", "Luxury purchases", "Investment purposes"], correct: 0 },
    ],
    hard: [
        { question: "If you invest $1000 at 5% annual interest, how much will you have after 2 years with compound interest?", options: ["$1100", "$1102.50", "$1150", "$1050"], correct: 1 },
        { question: "What is the relationship between risk and return in investing?", options: ["Higher risk typically means higher potential return", "Risk and return are unrelated", "Lower risk always means higher return", "Risk decreases with more money"], correct: 0 },
        { question: "If your credit score is 720, is this considered good?", options: ["Yes, 720 is a good credit score", "No, it needs to be higher", "It's average at best", "Credit scores don't go that high"], correct: 0 },
        { question: "What is a mortgage?", options: ["A long-term loan to buy property", "A short-term personal loan", "A type of investment account", "An insurance policy"], correct: 0 },
        { question: "What is the rule of 72 used for in finance?", options: ["To estimate how long it takes to double an investment", "To calculate taxes", "To determine inflation rates", "To measure credit scores"], correct: 0 },
    ],
};

export function shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export function selectRandomRequiredActions(): ActionType[] {
    const shuffled = [...ALL_ACTIONS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
}

export function areRequiredActionsCompleted(monthData: MonthData): boolean {
    if (!monthData.requiredActions || monthData.requiredActions.length === 0) {
        return true;
    }
    return monthData.requiredActions.every(
        (action) => (monthData.actionsCompleted[action] || 0) > 0
    );
}

export function randomizeInitialStats(): PetStats {
    const statNames = ['hunger', 'happy', 'energy', 'health'];
    const randomizedStats: PetStats = {
        hunger: 100,
        happy: 100,
        energy: 100,
        health: 100,
        money: 0
    };
    const numStatsToReduce = Math.floor(Math.random() * 3) + 1;
    const shuffledStats = [...statNames].sort(() => 0.5 - Math.random());
    const statsToReduce = shuffledStats.slice(0, numStatsToReduce);

    statsToReduce.forEach((stat) => {
        const reductionPercent = Math.floor(Math.random() * 41) + 10;
        const reductionAmount = Math.floor(100 * (reductionPercent / 100));
        randomizedStats[stat] = Math.max(0, 100 - reductionAmount);
    });
    return randomizedStats;
}

export function computeRangeBoost(current: number): number {
    const val = Math.max(0, Math.min(100, Math.round(current || 0)));
    if (val < 50) return 5;
    if (val <= 60) return 4;
    if (val <= 80) return 3;
    return 2;
}

const __recentClicks: Record<string, number> = {};

export function recordClickForStat(stat: string, windowMs = 6000): void {
    __recentClicks[stat] = (__recentClicks[stat] || 0) + 1;
    setTimeout(() => {
        __recentClicks[stat] = Math.max(0, (__recentClicks[stat] || 0) - 1);
    }, windowMs);
}

export function getDiminishedBoost(stat: string, baseBoost: number, currentValue: number): number {
    const current = Math.max(0, Math.min(100, currentValue || 0));
    const remainingRatio = Math.max(0, 100 - current) / 100;
    const clicks = __recentClicks[stat] || 0;
    const clickPenalty = 1 / (1 + clicks * 0.6);
    const raw = baseBoost * remainingRatio * clickPenalty;
    return Math.max(0, Math.round(raw));
}

export function getEmotionData(stats: PetStats): EmotionData {
    const avg = (stats.hunger + stats.happy + stats.health) / 3;

    if (stats.health < 30) {
        return { emotion: "Not feeling great", emoji: "Thermometer" };
    } else if (avg < 30) {
        return { emotion: "Really sad", emoji: "Frown" };
    } else if (avg < 50) {
        return { emotion: "A bit sad", emoji: "Meh" };
    } else if (avg < 70) {
        return { emotion: "Doing okay", emoji: "Minus" };
    } else if (stats.energy > 80 && stats.happy > 80) {
        return { emotion: "SO EXCITED!", emoji: "Zap" };
    } else if (avg >= 80) {
        return { emotion: "Super happy!", emoji: "Smile" };
    } else {
        return { emotion: "Pretty good", emoji: "Smile" };
    }
}

export function applyMonthlyStatDecay(stats: PetStats, currentMonth: number): PetStats {
    const decayMultiplier = 1 + (currentMonth * 0.05);
    const hungerLoss = Math.ceil(20 * decayMultiplier);
    const happyLoss = Math.ceil(15 * decayMultiplier);
    const energyLoss = Math.ceil(25 * decayMultiplier);

    const newStats = { ...stats };
    newStats.hunger = Math.max(0, newStats.hunger - hungerLoss);
    newStats.happy = Math.max(0, newStats.happy - happyLoss);
    newStats.energy = Math.max(0, newStats.energy - energyLoss);

    // Health suffers if other stats are low
    if (newStats.hunger < 20 || newStats.happy < 20 || newStats.energy < 20) {
        const healthLoss = Math.ceil(15 * decayMultiplier);
        newStats.health = Math.max(0, newStats.health - healthLoss);
    }

    return newStats;
}

export function processNextMonth(pet: PetData): PetData {
    const newPet = { ...pet };
    const income = pet.monthlyIncome || 0;
    const expenses = pet.monthlyExpenses || 0;
    const netSavings = income - expenses;

    // 1. Financial Update
    newPet.stats.money += netSavings;

    // 2. Stat Decay
    newPet.stats = applyMonthlyStatDecay(newPet.stats, newPet.monthData.currentMonth);

    // 3. Month Increment
    newPet.monthData.currentMonth += 1;

    // 4. Refresh Required Actions
    newPet.monthData.requiredActions = selectRandomRequiredActions();
    newPet.monthData.actionsCompleted = {};

    return newPet;
}

export function getRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
}
