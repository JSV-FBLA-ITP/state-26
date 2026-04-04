/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { PetData } from '@/lib/gameLogic';
import { createClient } from '@/utils/supabase/client';
const supabase = createClient();

/**
 * Storage utility to handle data persistence via Supabase.
 * Includes fallback patterns and type safety.
 */

export async function savePetToCloud(petData: PetData, explicitlyProvidedUserId?: string): Promise<{ data: any; error: any }> {
    const providedId = (petData as any).id;
    const isForceNew = (petData as any).id === undefined && 'id' in petData;
    const petId = isForceNew ? undefined : (providedId || localStorage.getItem('currentPetId'));
    
    // Get userId...
    let userId = explicitlyProvidedUserId;
    if (!userId) {
        const { data: sessionData } = await supabase.auth.getUser();
        userId = sessionData?.user?.id;
    }
    if (!userId) userId = (petData as any).user_id;

    const isNewPet = isForceNew || !petId || petId?.startsWith('guest_');
    const isMigration = !isForceNew && petId?.startsWith('guest_');

    // Guest fallback: ONLY if no userId is found AND pet is marked as guest/new
    if (!userId && isNewPet) {
        const fallbackId = (isForceNew || !petId) ? `guest_${Math.random().toString(36).substr(2, 9)}` : petId;
        localStorage.setItem(`pet_${fallbackId}`, JSON.stringify(petData));
        return { data: { id: fallbackId }, error: null };
    }

    try {
        // Prepare the payload
        const payload: any = {
            user_id: userId,
            name: petData.name,
            owner_name: petData.ownerName,
            household_name: petData.householdName,
            type: petData.type,
            image_url: petData.petImage,
            stats: petData.stats,
            month_data: petData.monthData,
            learned_tricks: petData.learnedTricks,
            shop_upgrades: petData.shop_upgrades,
            shop_multipliers: petData.shop_multipliers,
            total_expenses: petData.totalExpenses,
            savings_goal: petData.savingsGoal,
            savings_current: petData.savingsCurrent || 0,
            monthly_income: petData.monthlyIncome,
            monthly_expenses: petData.monthlyExpenses,
        };

        let result;
        if (isNewPet) {
            // Truly new pet or migrating guest -> INSERT
            result = await supabase
                .from('pets')
                .insert(payload)
                .select()
                .single();
        } else {
            // Existing cloud pet -> UPDATE
            result = await supabase
                .from('pets')
                .update(payload)
                .eq('id', petId)
                .select()
                .single();
        }

        const { data, error } = result;

        if (error) {
            console.error('Supabase error during savePetToCloud:', error.message, error.details, error.hint);
            return { data: null, error };
        }

        if (isMigration && data) {
            localStorage.removeItem(`pet_${petId}`);
            localStorage.setItem('currentPetId', data.id);
        }

        return { data, error: null };
    } catch (err: any) {
        console.error('Catch-all save error:', err.message || err);
        return { data: null, error: err };
    }
}

export async function loadPet(petId: string): Promise<{ data: PetData | null; error: any }> {
    // Guest check
    if (petId.startsWith('guest_')) {
        const localData = localStorage.getItem(`pet_${petId}`);
        if (localData) {
            try {
                return { data: JSON.parse(localData), error: null };
            } catch (e) {
                return { data: null, error: 'Failed to parse local pet data' };
            }
        }
        return { data: null, error: 'Local pet not found' };
    }

    return loadPetFromCloud(petId);
}

export async function fetchUserPets(): Promise<{ data: any[] | null; error: any }> {
    const allPets: any[] = [];

    // 1. Get local guest pets
    if (typeof window !== 'undefined') {
        const localKeys = Object.keys(localStorage).filter(k => k.startsWith('pet_guest_'));
        localKeys.forEach(key => {
            try {
                const pet = JSON.parse(localStorage.getItem(key)!);
                allPets.push({
                    id: key.replace('pet_', ''),
                    ...pet,
                    image_url: pet.petImage // Map for consistent UI
                });
            } catch (e) {
                console.error("Failed to parse local pet", e);
            }
        });
    }

    try {
        const { data: sessionData } = await supabase.auth.getUser();
        if (sessionData?.user) {
            const { data, error } = await supabase
                .from('pets')
                .select('*')
                .eq('user_id', sessionData.user.id)
                .order('created_at', { ascending: false });

            if (data) {
                // Merge with cloud pets, avoiding duplicates if any
                return { data: [...allPets, ...data], error: null };
            }
        }
        return { data: allPets, error: null };
    } catch (err) {
        return { data: allPets, error: err };
    }
}

export async function loadPetFromCloud(petId: string): Promise<{ data: PetData | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('pets')
            .select('*')
            .eq('id', petId)
            .single();

        if (error) throw error;

        // Map back to PetData interface
        const mappedData: PetData = {
            id: data.id,
            name: data.name,
            ownerName: data.owner_name,
            householdName: data.household_name,
            type: data.type,
            petImage: data.image_url,
            stats: data.stats,
            monthData: data.month_data,
            learnedTricks: data.learned_tricks,
            shop_upgrades: data.shop_upgrades,
            shop_multipliers: data.shop_multipliers,
            totalExpenses: data.total_expenses,
            savingsGoal: data.savings_goal,
            savingsCurrent: data.savings_current || 0,
            lastInteraction: Date.now(),
            interactionCount: data.interaction_count || 0,
            monthlyIncome: data.monthly_income,
            monthlyExpenses: data.monthly_expenses,
        };

        return { data: mappedData, error: null };
    } catch (err) {
        return { data: null, error: err };
    }
}

export async function saveExpense(petId: string, item: string, cost: number): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('expenses').insert({
        pet_id: petId,
        user_id: user.id,
        item,
        cost
    });
}

export async function fetchExpenses(petId: string): Promise<{ data: any[] | null; error: any }> {
    try {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .eq('pet_id', petId)
            .order('created_at', { ascending: false });

        return { data, error };
    } catch (err) {
        return { data: null, error: err };
    }
}
export async function deletePet(petId: string): Promise<{ error: any }> {
    if (petId.startsWith('guest_')) {
        localStorage.removeItem(`pet_${petId}`);
        if (localStorage.getItem('currentPetId') === petId) {
            localStorage.removeItem('currentPetId');
        }
        return { error: null };
    }

    try {
        const { error } = await supabase
            .from('pets')
            .delete()
            .eq('id', petId);

        if (localStorage.getItem('currentPetId') === petId) {
            localStorage.removeItem('currentPetId');
        }
        return { error };
    } catch (err) {
        return { error: err };
    }
}

export async function deleteHousehold(householdName: string): Promise<{ error: any }> {
    try {
        const { data: sessionData } = await supabase.auth.getUser();
        const userId = sessionData?.user?.id;

        if (!userId) {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('pet_guest_')) {
                    const petData = localStorage.getItem(key);
                    if (petData) {
                        const parsed = JSON.parse(petData);
                        if (parsed.householdName === householdName) {
                            keysToRemove.push(key);
                        }
                    }
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));
            return { error: null };
        }

        const { error } = await supabase
            .from('pets')
            .delete()
            .eq('household_name', householdName)
            .eq('user_id', userId);

        return { error };
    } catch (err) {
        return { error: err };
    }
}
