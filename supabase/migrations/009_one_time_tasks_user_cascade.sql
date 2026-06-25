-- One-time social task claims, withdrawal referral count, and user-delete cascades

-- Keep earliest claim per user/task when moving to one-time rewards
DELETE FROM public.task_reward_claims a
USING public.task_reward_claims b
WHERE a.user_id = b.user_id
  AND a.task_id = b.task_id
  AND a.created_at > b.created_at;

ALTER TABLE public.task_reward_claims
  DROP CONSTRAINT IF EXISTS task_reward_claims_user_id_task_id_claim_date_key;

ALTER TABLE public.task_reward_claims
  ADD CONSTRAINT task_reward_claims_user_id_task_id_key UNIQUE (user_id, task_id);

UPDATE public.platform_settings
SET value = '2', updated_at = now()
WHERE key = 'withdrawal_required_referrals';

INSERT INTO public.platform_settings (key, value)
VALUES ('withdrawal_required_referrals', '2')
ON CONFLICT (key) DO UPDATE
SET value = '2', updated_at = now();

-- Allow profile/auth user deletion when related rows exist
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_referred_by_fkey;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_referred_by_fkey
  FOREIGN KEY (referred_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.vip_purchases
  DROP CONSTRAINT IF EXISTS vip_purchases_user_id_fkey;

ALTER TABLE public.vip_purchases
  ADD CONSTRAINT vip_purchases_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.deposits
  DROP CONSTRAINT IF EXISTS deposits_user_id_fkey;

ALTER TABLE public.deposits
  ADD CONSTRAINT deposits_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.deposits
  DROP CONSTRAINT IF EXISTS deposits_reviewed_by_fkey;

ALTER TABLE public.deposits
  ADD CONSTRAINT deposits_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.withdrawals
  DROP CONSTRAINT IF EXISTS withdrawals_user_id_fkey;

ALTER TABLE public.withdrawals
  ADD CONSTRAINT withdrawals_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.withdrawals
  DROP CONSTRAINT IF EXISTS withdrawals_reviewed_by_fkey;

ALTER TABLE public.withdrawals
  ADD CONSTRAINT withdrawals_reviewed_by_fkey
  FOREIGN KEY (reviewed_by) REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.earnings
  DROP CONSTRAINT IF EXISTS earnings_user_id_fkey;

ALTER TABLE public.earnings
  ADD CONSTRAINT earnings_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.referral_commissions
  DROP CONSTRAINT IF EXISTS referral_commissions_beneficiary_id_fkey;

ALTER TABLE public.referral_commissions
  ADD CONSTRAINT referral_commissions_beneficiary_id_fkey
  FOREIGN KEY (beneficiary_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.referral_commissions
  DROP CONSTRAINT IF EXISTS referral_commissions_source_user_id_fkey;

ALTER TABLE public.referral_commissions
  ADD CONSTRAINT referral_commissions_source_user_id_fkey
  FOREIGN KEY (source_user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.referral_commissions
  DROP CONSTRAINT IF EXISTS referral_commissions_vip_purchase_id_fkey;

ALTER TABLE public.referral_commissions
  ADD CONSTRAINT referral_commissions_vip_purchase_id_fkey
  FOREIGN KEY (vip_purchase_id) REFERENCES public.vip_purchases(id) ON DELETE CASCADE;

ALTER TABLE public.daily_reward_claims
  DROP CONSTRAINT IF EXISTS daily_reward_claims_user_id_fkey;

ALTER TABLE public.daily_reward_claims
  ADD CONSTRAINT daily_reward_claims_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
