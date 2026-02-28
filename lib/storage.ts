import { PetData } from '@/lib/gameLogic';
import { supabase } from '@/lib/supabase';

/**
 * Storage utility to handle data persistence via Supabase.
 * Includes fallback patterns and type safety.
 */

export async function savePetToCloud(petData: PetData): Promise<{ data: any; error: any }> {
    let petId = (petData as any).id || localStorage.getItem('currentPetId');
    const { data: sessionData } = await supabase.auth.getUser();
    const userId = sessionData?.user?.id;

    // Guest fallback (only if NOT logged in)
    if (!userId && petId?.startsWith('guest_')) {
        localStorage.setItem(`pet_${petId}`, JSON.stringify(petData));
        return { data: { id: petId }, error: null };
    }

    try {
        // If we have a user and it was a guest pet, we generate a new ID (or let Postgres do it)
        const isMigration = petId?.startsWith('guest_');

        const { data, error } = await supabase
            .from('pets')
            .upsert({
                id: isMigration ? undefined : petId,
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
                monthly_income: petData.monthlyIncome,
                monthly_expenses: petData.monthlyExpenses,
            })
            .select()
            .single();

        if (!error && isMigration && data) {
            localStorage.removeItem(`pet_${petId}`);
            localStorage.setItem('currentPetId', data.id);
        }

        return { data, error };
    } catch (err) {
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
    let allPets: any[] = [];

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
            savingsCurrent: (data.stats.money || 0) - (data.total_expenses || 0),
            lastInteraction: Date.now(),
            interactionCount: 0,
            monthlyIncome: data.monthly_income,
            monthlyExpenses: data.monthly_expenses,
        };

        return { data: mappedData, error: null };
    } catch (err) {
        return { data: null, error: err };
    }
}

export async function saveExpense(petId: string, item: string, cost: number): Promise<void> {
    await supabase.from('expenses').insert({
        pet_id: petId,
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
