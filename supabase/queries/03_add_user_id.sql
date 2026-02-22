ALTER TABLE public.pets 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

ALTER TABLE public.expenses 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
