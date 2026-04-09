/**
 * =============================================================================
 * PETPAL CORE GAME ENGINE
 * =============================================================================
 * This module encodes the primary business logic and mathematical models for 
 * the PetPal virtual pet simulation.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Data Modeling: Defining PetData, PetStats, and MonthData interfaces.
 * 2. State Transitions: Pure functions for monthly processing (income, stats decay).
 * 3. Financial Logic: Budget validation, interest/savings calculations, and category mapping.
 * 4. Gamification: Experience points, levels, and trick-learning probabilities.
 * 
 * FBLA ALIGNMENT:
 * - Implementation of "Programming Logic" and "Math Operations" as per rubric.
 * - Centralized logic ensures a clean "Separation of Concerns" (SoC) principle.
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

export type ActionCategory = 'Food' | 'Health' | 'Toys' | 'Activity' | 'Maintenance' | 'Other';

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
    budgetLimit: number;       // FBLA: Added budget limit
    age: number;               // FBLA: Added age in months
    chatbot_count: number;     // AI restriction
    image_gen_count: number;   // AI restriction
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

export type ActionType = 'feed' | 'play' | 'sleep' | 'clean' | 'healthCheck' | 'train';

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
    train: 'Brain Brain Training',
};

export const ACTION_COSTS: Record<ActionType, number> = {
    feed: 10,
    play: 15,
    sleep: 5,
    clean: 8,
    healthCheck: 25,
    train: 12,
};

export const ACTION_CATEGORIES: Record<ActionType, ActionCategory> = {
    feed: 'Food',
    play: 'Activity',
    sleep: 'Maintenance',
    clean: 'Maintenance',
    healthCheck: 'Health',
    train: 'Activity',
};

export const POSSIBLE_TRICKS = [
    "Sit", "Stay", "Shake", "Roll Over", "Play Dead", "Backflip", "Fetch Budget"
];

export const QUIZ_QUESTIONS: Record<string, QuizQuestion[]> = {
    easy: [
        { question: "What is the primary purpose of a pet care budget?", options: ["To track spending and plan for food, vet, and toy expenses", "To avoid paying pet taxes", "To keep dog treats in a bank", "To invest in catnip stocks"], correct: 0 },
        { question: "Which of these is NOT a typical recurring pet expense?", options: ["Saving money for college", "Buying specialized pet food", "Paying for flea and tick medicine", "Replacing chewed-up toys"], correct: 0 },
        { question: "What does compound interest mean for your pet's savings fund?", options: ["Interest earned on your initial savings and on the interest it already earned", "Simple interest rates for doggy daycare", "No interest at all at the pet store", "Negative interest when you buy too many treats"], correct: 0 },
        { question: "What is inflation in the pet world?", options: ["The increase in the price of pet food and vet care over time", "A decrease in the value of dog bones", "Blowing air into a bouncy toy", "All of the above"], correct: 0 },
        { question: "What is a debit card used for at the pet store?", options: ["A card that directly spends your own money from your bank account", "A card that borrows money for premium kibble", "A card that earns interest on fish food", "A savings card exclusively for cats"], correct: 0 },
        { question: "When buying pet food, what does 'pay yourself first' mean?", options: ["Setting aside money into savings before spending the rest on your pet", "Eating the pet food yourself before the dog", "Paying off credit cards using a dog's allowance", "Spending your entire paycheck on a luxury cat condo"], correct: 0 },
        { question: "What is an emergency fund typically used for in pet ownership?", options: ["Unexpected medical surgeries or sudden illness", "Buying a new TV for your bird", "Going on a luxury doggie vacation", "Investing in the pet stock market"], correct: 0 },
        { question: "Which of these is a 'need' rather than a 'want' for your companion?", options: ["Annual vaccinations and checkups", "A remote-controlled laser toy", "A designer pet sweater", "Gourmet, organic dog treats"], correct: 0 },
        { question: "What happens if you overdraw your checking account buying a massive cat tower?", options: ["Your bank may charge you a hefty overdraft fee", "Absolutely nothing happens", "The bank gives you a free bag of treats", "Your account gets upgraded to VIP"], correct: 0 },
        { question: "Why is it important to start saving for your pet early?", options: ["To take advantage of compound interest and comfortably afford future senior care", "So you can spend all your savings next year", "Because breeders require it", "To decrease your credit score"], correct: 0 },
    ],
    medium: [
        { question: "If you earn $2000/month and spend $1500 (with $200 on pet care), what's your overall savings rate?", options: ["75%", "25%", "50%", "33%"], correct: 1 },
        { question: "What is the difference between gross and net income when looking at your paycheck to buy puppy supplies?", options: ["Gross is before taxes, net is after taxes (what you can actually spend)", "They are the exact same thing", "Gross is annual, net is monthly", "Gross is for dog food, net is for savings"], correct: 0 },
        { question: "What does diversification mean when investing for your pet's long-term comfort?", options: ["Spreading investments across different assets to lower risk", "Putting all your money into one pet-startup stock", "Moving money around different banks frequently", "Only investing in pharmaceutical stocks"], correct: 0 },
        { question: "If a fancy pet bed costs $50 but is 20% off, what's the final price?", options: ["$30", "$40", "$35", "$45"], correct: 1 },
        { question: "What is a pet insurance deductible?", options: ["The amount you must pay out-of-pocket before insurance covers the rest", "A fee you pay the vet directly just for visiting", "Money the insurance company gives you every month", "A tax imposed on buying pet medications"], correct: 0 },
        { question: "What is a major advantage of a 401(k) for securing your and your pet's future?", options: ["Employer matching contributions", "You can withdraw it anytime to buy dog toys without penalty", "It replaces your checking account", "It is legally required to double in 5 years"], correct: 0 },
        { question: "What is a credit utilization ratio when using a credit card for vet bills?", options: ["The percentage of your total credit limit you are currently using", "How often you use your credit card at Petco", "The interest rate on your emergency vet loan", "The number of credit cards you own with dog pictures"], correct: 0 },
        { question: "What is the main difference between stocks and bonds as you build your pet savings portfolio?", options: ["Stocks represent ownership in a company, bonds represent a loan to an entity", "Stocks are safer than bonds", "Bonds always pay more than stocks", "Stocks are only for rich pet owners"], correct: 0 },
        { question: "What happens to your pet budget during a recession?", options: ["Prices may rise, incomes may fall, and emergency savings become crucial", "Every pet gets an automatic raise", "Vet bills drop to zero", "The stock market goes up significantly"], correct: 0 },
        { question: "What does it mean to be 'underwater' on a car loan, making it harder to afford pet care?", options: ["You owe more than the car is actually worth", "Your car unfortunately flooded", "You missed three payments", "Your loan term is over 72 months"], correct: 0 },
    ],
    hard: [
        { question: "If you put $1000 in your pet's medical fund at 5% annual interest, how much will you have after 2 years with compound interest?", options: ["$1100", "$1102.50", "$1150", "$1050"], correct: 1 },
        { question: "How does the relationship between risk and return apply if you invest to speed up your pet's savings goal?", options: ["Higher risk typically means higher potential return, but greater chance of loss", "Risk and return are totally unrelated", "Lower risk always means higher return", "Risk decreases the more you invest"], correct: 0 },
        { question: "If you need a loan for an emergency vet surgery, is a credit score of 720 considered good?", options: ["Yes, 720 is a good credit score and helps secure decent rates", "No, it needs to be much higher", "It's average at best", "Credit scores don't go that high"], correct: 0 },
        { question: "What is a mortgage when discussing housing for you and your large breed dog?", options: ["A long-term loan specifically used to buy real estate/property", "A short-term personal loan for a dog house", "A type of investment account", "An insurance policy"], correct: 0 },
        { question: "What is the Rule of 72 used for in your financial planning?", options: ["To estimate how long it takes to double an investment at a fixed annual rate", "To calculate how much pet food you need", "To determine inflation rates next year", "To measure credit scores across 72 months"], correct: 0 },
        { question: "Which investment vehicle typically has the highest historical long-term return for your pet trust?", options: ["Index funds / Equities", "Government Bonds", "Certificates of Deposit", "Gold"], correct: 0 },
        { question: "What is the primary difference between a Roth IRA and a Traditional IRA when planning your retirement with your bird?", options: ["Roth is funded with after-tax money so withdrawals are tax-free; Traditional is pre-tax", "Roth is only for retirement, Traditional is for pet emergencies", "Traditional grows tax-free, Roth is heavily taxed early", "There is no difference"], correct: 0 },
        { question: "What is an index fund in the context of growing your wealth?", options: ["A mutual fund or ETF designed to track the components of a financial market index", "A fund managed entirely by a specialized robot", "A high-fee mutual fund that picks individual stocks", "A type of life insurance used by pet breeders"], correct: 0 },
        { question: "What does 'amortization' refer to when paying off a loan you took out for an emergency pet surgery?", options: ["Paying off a debt over time in equal, scheduled installments", "The sudden drop in a stock's price", "A penalty for late credit card payments", "The process of declaring bankruptcy"], correct: 0 },
        { question: "What is a capital gains tax you might pay if you sell stocks to fund a huge dog park in your yard?", options: ["A tax on the profit from the sale of your investment or asset", "A tax on your monthly income", "A tax exclusively on pet groceries", "A fee paid to a stockbroker every year"], correct: 0 },
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

export function processNextMonth(pet: PetData): { pet: PetData; emergencyCost: number; newTrick: string | null } {
    const newPet = { ...pet };
    const income = pet.monthlyIncome || 0;
    const expenses = pet.monthlyExpenses || 0;
    const netSavings = income - expenses;

    // 1. Financial Update
    newPet.stats.money += netSavings;

    // 2. Stat Decay
    newPet.stats = applyMonthlyStatDecay(newPet.stats, newPet.monthData.currentMonth);

    // 3. Month Increment & Age
    newPet.monthData.currentMonth += 1;
    newPet.age += 1; // Increment age

    // 4. Random Trick Learning (FBLA: possible evolution)
    if (newPet.interactionCount > 0 && newPet.interactionCount % 10 === 0) {
        const potentialTricks = POSSIBLE_TRICKS.filter(t => !newPet.learnedTricks.includes(t));
        if (potentialTricks.length > 0) {
            const newTrick = potentialTricks[Math.floor(Math.random() * potentialTricks.length)];
            newPet.learnedTricks.push(newTrick);
        }
    }

    // 5. Random Vet Emergency (FBLA: financial responsibility)
    let emergencyCost = 0;
    if (Math.random() < 0.15) { // 15% chance
        emergencyCost = Math.floor(Math.random() * 100) + 50;
        newPet.stats.money = Math.max(0, newPet.stats.money - emergencyCost);
        newPet.totalExpenses += emergencyCost;
    }

    // 6. Refresh Required Actions
    newPet.monthData.requiredActions = selectRandomRequiredActions();
    newPet.monthData.actionsCompleted = {};

    return {
        pet: newPet,
        emergencyCost,
        newTrick: (newPet.learnedTricks.length > pet.learnedTricks.length) 
            ? newPet.learnedTricks[newPet.learnedTricks.length - 1] 
            : null
    };
}

export function getRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
}
