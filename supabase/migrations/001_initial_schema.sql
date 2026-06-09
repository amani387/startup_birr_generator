-- AUREUM VIP — Initial Schema
-- Run in Supabase SQL Editor or via supabase db push

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
create type user_role as enum ('user', 'admin');
create type transaction_status as enum ('pending', 'approved', 'rejected');
create type earning_type as enum (
  'vip_daily',
  'referral_commission',
  'daily_reward',
  'bonus',
  'admin_adjustment'
);
create type notification_type as enum (
  'deposit_approved',
  'deposit_rejected',
  'withdrawal_approved',
  'withdrawal_rejected',
  'vip_purchased',
  'referral_commission',
  'daily_reward',
  'general'
);

-- Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  referral_code text unique not null,
  referred_by uuid references public.profiles(id),
  role user_role not null default 'user',
  balance numeric(14, 2) not null default 0 check (balance >= 0),
  total_earned numeric(14, 2) not null default 0,
  total_deposited numeric(14, 2) not null default 0,
  total_withdrawn numeric(14, 2) not null default 0,
  vip_level int not null default 0,
  daily_streak int not null default 0,
  last_daily_claim date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Platform settings (key-value)
create table public.platform_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (key, value) values
  ('withdrawal_min_balance_unlock', '700'),
  ('withdrawal_retention_percent', '30'),
  ('withdrawal_min_amount', '100'),
  ('referral_commission_l1', '10'),
  ('referral_commission_l2', '10'),
  ('referral_commission_l3', '10'),
  ('daily_reward_amount', '5'),
  ('daily_streak_bonus_day', '7');

-- VIP Plans
create table public.vip_plans (
  id uuid primary key default gen_random_uuid(),
  level int unique not null,
  name text not null,
  price numeric(14, 2) not null,
  daily_income numeric(14, 2) not null,
  duration_days int not null default 7,
  total_return numeric(14, 2) not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.vip_plans (level, name, price, daily_income, duration_days, total_return) values
  (1, 'VIP 1', 500, 71.43, 7, 500.01),
  (2, 'VIP 2', 3000, 428.57, 7, 2999.99),
  (3, 'VIP 3', 12000, 1714.29, 7, 12000.03),
  (4, 'VIP 4', 26000, 3714.29, 7, 26000.03),
  (5, 'VIP 5', 50000, 7142.86, 7, 50000.02);

-- VIP Purchases
create table public.vip_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  plan_id uuid not null references public.vip_plans(id),
  amount_paid numeric(14, 2) not null,
  daily_income numeric(14, 2) not null,
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  days_claimed int not null default 0,
  status text not null default 'active' check (status in ('active', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

-- Deposits
create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  amount numeric(14, 2) not null check (amount > 0),
  payment_method text not null,
  screenshot_url text,
  transaction_ref text,
  status transaction_status not null default 'pending',
  admin_note text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Withdrawals
create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  amount numeric(14, 2) not null check (amount > 0),
  payment_method text not null,
  account_holder text not null,
  account_number text not null,
  status transaction_status not null default 'pending',
  admin_note text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Withdrawal Settings
create table public.withdrawal_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  payment_method text not null,
  account_holder text not null,
  account_number text not null,
  updated_at timestamptz not null default now()
);

-- Earnings ledger
create table public.earnings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  type earning_type not null,
  amount numeric(14, 2) not null,
  source_id uuid,
  description text,
  created_at timestamptz not null default now()
);

-- Referral commissions (3-level tracking)
create table public.referral_commissions (
  id uuid primary key default gen_random_uuid(),
  beneficiary_id uuid not null references public.profiles(id),
  source_user_id uuid not null references public.profiles(id),
  vip_purchase_id uuid not null references public.vip_purchases(id),
  level int not null check (level between 1 and 3),
  commission_percent numeric(5, 2) not null,
  amount numeric(14, 2) not null,
  created_at timestamptz not null default now()
);

-- Daily reward claims
create table public.daily_reward_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  amount numeric(14, 2) not null,
  streak_day int not null,
  claimed_at timestamptz not null default now()
);

-- Notifications
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id),
  type notification_type not null,
  title text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes
create index idx_profiles_referred_by on public.profiles(referred_by);
create index idx_profiles_referral_code on public.profiles(referral_code);
create index idx_deposits_user on public.deposits(user_id);
create index idx_withdrawals_user on public.withdrawals(user_id);
create index idx_earnings_user on public.earnings(user_id);
create index idx_vip_purchases_user on public.vip_purchases(user_id);
create index idx_notifications_user on public.notifications(user_id, read);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_code text;
  referrer uuid;
begin
  new_code := 'EP-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));

  if new.raw_user_meta_data->>'referral_code' is not null then
    select id into referrer
    from public.profiles
    where referral_code = new.raw_user_meta_data->>'referral_code';
  end if;

  insert into public.profiles (id, full_name, email, referral_code, referred_by)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new_code,
    referrer
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.vip_plans enable row level security;
alter table public.vip_purchases enable row level security;
alter table public.deposits enable row level security;
alter table public.withdrawals enable row level security;
alter table public.withdrawal_settings enable row level security;
alter table public.earnings enable row level security;
alter table public.referral_commissions enable row level security;
alter table public.daily_reward_claims enable row level security;
alter table public.notifications enable row level security;
alter table public.platform_settings enable row level security;

-- Profiles policies
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- VIP plans — public read
create policy "Anyone can view active VIP plans"
  on public.vip_plans for select using (active = true);

-- VIP purchases
create policy "Users can view own purchases"
  on public.vip_purchases for select using (auth.uid() = user_id);

-- Deposits
create policy "Users can view own deposits"
  on public.deposits for select using (auth.uid() = user_id);

create policy "Users can create deposits"
  on public.deposits for insert with check (auth.uid() = user_id);

-- Withdrawals
create policy "Users can view own withdrawals"
  on public.withdrawals for select using (auth.uid() = user_id);

create policy "Users can create withdrawals"
  on public.withdrawals for insert with check (auth.uid() = user_id);

-- Withdrawal settings
create policy "Users manage own withdrawal settings"
  on public.withdrawal_settings for all using (auth.uid() = user_id);

-- Earnings
create policy "Users can view own earnings"
  on public.earnings for select using (auth.uid() = user_id);

-- Referral commissions
create policy "Users can view own commissions"
  on public.referral_commissions for select using (auth.uid() = beneficiary_id);

-- Daily rewards
create policy "Users can view own daily claims"
  on public.daily_reward_claims for select using (auth.uid() = user_id);

create policy "Users can claim daily reward"
  on public.daily_reward_claims for insert with check (auth.uid() = user_id);

-- Notifications
create policy "Users can view own notifications"
  on public.notifications for select using (auth.uid() = user_id);

create policy "Users can mark notifications read"
  on public.notifications for update using (auth.uid() = user_id);

-- Platform settings — read only for authenticated users
create policy "Authenticated users can read settings"
  on public.platform_settings for select using (auth.role() = 'authenticated');

-- Storage bucket for deposit screenshots (run in Supabase dashboard or API)
-- insert into storage.buckets (id, name, public) values ('deposits', 'deposits', false);
