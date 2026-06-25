-- Social task reward claims (one-time per task per user)

DO $$ BEGIN
  ALTER TYPE earning_type ADD VALUE 'task_reward';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.task_reward_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  amount numeric(14, 2) NOT NULL CHECK (amount > 0),
  claim_date date NOT NULL DEFAULT (timezone('utc', now())::date),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_id, claim_date)
);

CREATE INDEX IF NOT EXISTS idx_task_reward_claims_user_date
  ON public.task_reward_claims(user_id, claim_date);

ALTER TABLE public.task_reward_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own task claims"
  ON public.task_reward_claims FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own task claims"
  ON public.task_reward_claims FOR INSERT
  WITH CHECK (auth.uid() = user_id);
