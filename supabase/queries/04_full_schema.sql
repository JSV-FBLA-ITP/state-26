-- ============================================================
-- PetPal — Full Schema (idempotent, run top-to-bottom)
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- ------------------------------------------------------------
-- 1. PETS TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pets (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Identity
    name             TEXT NOT NULL,
    owner_name       TEXT,
    household_name   TEXT,
    type             TEXT NOT NULL,
    image_url        TEXT,

    -- Game state (JSON blobs)
    stats            JSONB NOT NULL DEFAULT '{"hunger":100,"happy":100,"energy":100,"health":100,"money":500}'::JSONB,
    month_data       JSONB NOT NULL DEFAULT '{"currentMonth":1,"requiredActions":[],"actionsCompleted":{}}'::JSONB,
    learned_tricks   TEXT[] NOT NULL DEFAULT '{}',
    shop_upgrades    JSONB NOT NULL DEFAULT '{"hunger":0,"happy":0,"energy":0,"health":0}'::JSONB,
    shop_multipliers JSONB NOT NULL DEFAULT '{"hunger":1.0,"happy":1.0,"energy":1.0,"health":1.0}'::JSONB,

    -- Finance
    total_expenses   FLOAT NOT NULL DEFAULT 0.0,
    savings_goal     FLOAT NOT NULL DEFAULT 500.0,
    savings_current  FLOAT NOT NULL DEFAULT 0.0,
    monthly_income   FLOAT,
    monthly_expenses FLOAT
);

-- Add any missing columns to existing tables (safe to re-run)
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS owner_name       TEXT;
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS household_name   TEXT;
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS savings_current  FLOAT NOT NULL DEFAULT 0.0;
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS monthly_income   FLOAT;
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS monthly_expenses FLOAT;
ALTER TABLE public.pets ADD COLUMN IF NOT EXISTS user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS pets_user_id_idx ON public.pets (user_id);
CREATE INDEX IF NOT EXISTS pets_created_at_idx ON public.pets (created_at DESC);

-- ------------------------------------------------------------
-- 2. EXPENSES TABLE
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.expenses (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    pet_id     UUID REFERENCES public.pets(id) ON DELETE CASCADE,
    user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item       TEXT NOT NULL,
    cost       FLOAT NOT NULL,
    category   TEXT
);

ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS expenses_pet_id_idx  ON public.expenses (pet_id);
CREATE INDEX IF NOT EXISTS expenses_user_id_idx ON public.expenses (user_id);

-- ------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS)
-- Users can only read/write their own rows.
-- ------------------------------------------------------------
ALTER TABLE public.pets     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist so re-running is safe
DROP POLICY IF EXISTS "Users can view own pets"   ON public.pets;
DROP POLICY IF EXISTS "Users can insert own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can update own pets" ON public.pets;
DROP POLICY IF EXISTS "Users can delete own pets" ON public.pets;

DROP POLICY IF EXISTS "Users can view own expenses"   ON public.expenses;
DROP POLICY IF EXISTS "Users can insert own expenses" ON public.expenses;
DROP POLICY IF EXISTS "Users can delete own expenses" ON public.expenses;

-- Pets policies
CREATE POLICY "Users can view own pets"
    ON public.pets FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pets"
    ON public.pets FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pets"
    ON public.pets FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pets"
    ON public.pets FOR DELETE
    USING (auth.uid() = user_id);

-- Expenses policies
CREATE POLICY "Users can view own expenses"
    ON public.expenses FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses"
    ON public.expenses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses"
    ON public.expenses FOR DELETE
    USING (auth.uid() = user_id);

-- ------------------------------------------------------------
-- 4. GRANT permissions to the anon + authenticated roles
-- (needed for the Supabase JS client to work)
-- ------------------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pets     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT SELECT                         ON public.pets     TO anon;
