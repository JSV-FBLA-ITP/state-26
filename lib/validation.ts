/**
 * FBLA Validation Utility
 * Ensures all user inputs are syntactically and semantically valid.
 */

export interface ValidationResult {
    isValid: boolean;
    message: string;
}

/**
 * Validates pet name for length and illegal characters.
 */
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

/**
 * Validates currency/monetary inputs.
 */
export const validateCurrency = (amount: number | string | undefined, fieldName: string): ValidationResult => {
    const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount;
    
    if (num === undefined || isNaN(num)) {
        return { isValid: false, message: `${fieldName} must be a valid number.` };
    }
    if (num < 0) {
        return { isValid: false, message: `${fieldName} cannot be negative.` };
    }
    if (num > 100000) {
        return { isValid: false, message: `${fieldName} exceeds the maximum allowed ($100,000).` };
    }
    return { isValid: true, message: "" };
};

/**
 * Validates budget limits for financial responsibility simulation.
 */
export const validateBudgetLimit = (limit: number): ValidationResult => {
    if (isNaN(limit) || limit < 50) {
        return { isValid: false, message: "Budget limit must be at least $50." };
    }
    if (limit > 10000) {
        return { isValid: false, message: "Budget limit is unusually high (max $10,000)." };
    }
    return { isValid: true, message: "" };
};

/**
 * Professional email validation for authentication gateway.
 */
export const validateEmail = (email: string): ValidationResult => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return { isValid: false, message: "Please enter a valid email address." };
    }
    return { isValid: true, message: "" };
};

/**
 * Professional password complexiy validation.
 */
export const validatePassword = (password: string): ValidationResult => {
    if (password.length < 8) {
        return { isValid: false, message: "Password must be at least 8 characters long." };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one uppercase letter." };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: "Password must contain at least one number." };
    }
    return { isValid: true, message: "" };
};

/**
 * Validates game actions against available resources.
 */
export const validateAction = (cost: number, currentBalance: number, energy: number, requiredEnergy: number): ValidationResult => {
    if (currentBalance < cost) {
        return { isValid: false, message: "Insufficient funds to perform this action." };
    }
    if (energy < requiredEnergy) {
        return { isValid: false, message: "Your pet is too tired for this! Pet it or let it rest." };
    }
    return { isValid: true, message: "" };
};
