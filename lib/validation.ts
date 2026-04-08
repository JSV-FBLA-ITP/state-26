/**
 * FBLA Validation Utility
 * Ensures all user inputs are syntactically and semantically valid.
 */

export interface ValidationResult {
    isValid: boolean;
    message: string;
}

export const validatePetName = (name: string): ValidationResult => {
    if (!name || name.trim().length < 2) {
        return { isValid: false, message: "Pet name must be at least 2 characters." };
    }
    if (name.length > 20) {
        return { isValid: false, message: "Pet name is too long (max 20 chars)." };
    }
    if (/[^a-zA-Z0-9\s]/.test(name)) {
        return { isValid: false, message: "Pet name contains invalid characters." };
    }
    return { isValid: true, message: "" };
};

export const validateBudgetLimit = (limit: number): ValidationResult => {
    if (isNaN(limit) || limit < 50) {
        return { isValid: false, message: "Budget limit must be at least $50." };
    }
    if (limit > 10000) {
        return { isValid: false, message: "Budget limit is unusually high (max $10,000)." };
    }
    return { isValid: true, message: "" };
};

export const validateSavingsGoal = (goal: number): ValidationResult => {
    if (isNaN(goal) || goal < 100) {
        return { isValid: false, message: "Savings goal must be at least $100." };
    }
    return { isValid: true, message: "" };
};
