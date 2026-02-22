-- Create the 'pets' table to store game state
CREATE TABLE IF NOT EXISTS public.pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    image_url TEXT,
    stats JSONB DEFAULT '{"hunger": 100, "happy": 100, "energy": 100, "health": 100, "money": 500}'::JSONB,
    month_data JSONB DEFAULT '{"currentMonth": 1, "requiredActions": [], "actionsCompleted": {}}'::JSONB,
    learned_tricks TEXT[] DEFAULT '{}',
    shop_upgrades JSONB DEFAULT '{"hunger": 0, "happy": 0, "energy": 0, "health": 0}'::JSONB,
    shop_multipliers JSONB DEFAULT '{"hunger": 1.0, "happy": 1.0, "energy": 1.0, "health": 1.0}'::JSONB,
    total_expenses FLOAT DEFAULT 0.0,
    savings_goal FLOAT DEFAULT 500.0
);
