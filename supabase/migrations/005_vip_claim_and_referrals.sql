-- Member VIP daily income claims + referral commission processing (bypasses RLS safely)

alter table public.vip_purchases
  add column if not exists last_vip_income_claim date;

create table if not exists public.vip_income_claims (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  vip_purchase_id uuid not null references public.vip_purchases(id) on delete cascade,
  amount numeric(14, 2) not null,
  day_number int not null check (day_number > 0),
  claimed_at timestamptz not null default now(),
  unique (vip_purchase_id, day_number)
);

create index if not exists idx_vip_income_claims_user on public.vip_income_claims(user_id);

alter table public.vip_income_claims enable row level security;

create policy "Users can view own vip income claims"
  on public.vip_income_claims for select using (auth.uid() = user_id);

-- Case-insensitive referral code lookup on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  new_code text;
  referrer uuid;
  ref_input text;
begin
  new_code := 'BT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8));
  ref_input := nullif(trim(new.raw_user_meta_data->>'referral_code'), '');

  if ref_input is not null then
    select id into referrer
    from public.profiles
    where upper(referral_code) = upper(ref_input)
      and id <> new.id;
  end if;

  insert into public.profiles (id, full_name, email, referral_code, referred_by)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.email,
    new_code,
    referrer
  );
  return new;
end;
$$;

create or replace function public.link_referral_by_code(ref_code text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  referrer uuid;
  current_user_id uuid;
begin
  current_user_id := auth.uid();
  if current_user_id is null or ref_code is null or trim(ref_code) = '' then
    return;
  end if;

  select id into referrer
  from public.profiles
  where upper(referral_code) = upper(trim(ref_code))
    and id <> current_user_id;

  if referrer is null then
    return;
  end if;

  update public.profiles
  set referred_by = referrer
  where id = current_user_id
    and referred_by is null;
end;
$$;

-- Pay L1 referral commission (15%) when a referred user buys VIP
create or replace function public.process_referral_commissions(
  p_purchase_id uuid,
  p_buyer_id uuid,
  p_plan_level int,
  p_plan_price numeric
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  l1_id uuid;
  l1_pct numeric := 15;
  l1_amt numeric;
  buyer_name text;
begin
  if exists (
    select 1 from public.referral_commissions
    where vip_purchase_id = p_purchase_id
  ) then
    return;
  end if;

  select referred_by into l1_id
  from public.profiles
  where id = p_buyer_id;

  if l1_id is null then
    return;
  end if;

  l1_amt := round(p_plan_price * l1_pct / 100, 2);
  if l1_amt <= 0 then
    return;
  end if;

  select full_name into buyer_name from public.profiles where id = p_buyer_id;

  insert into public.referral_commissions (
    beneficiary_id,
    source_user_id,
    vip_purchase_id,
    level,
    commission_percent,
    amount
  ) values (
    l1_id,
    p_buyer_id,
    p_purchase_id,
    1,
    l1_pct,
    l1_amt
  );

  update public.profiles
  set
    balance = balance + l1_amt,
    total_earned = total_earned + l1_amt
  where id = l1_id;

  insert into public.earnings (user_id, type, amount, source_id, description)
  values (
    l1_id,
    'referral_commission',
    l1_amt,
    p_purchase_id,
    'VIP ' || p_plan_level || ' invitation bonus'
  );

  insert into public.notifications (user_id, type, title, message)
  values (
    l1_id,
    'referral_commission',
    'Referral bonus received',
    coalesce(buyer_name, 'Your referral') || ' purchased VIP ' || p_plan_level ||
      '. You earned ' || l1_amt || ' Birr (15%).'
  );
end;
$$;

grant execute on function public.process_referral_commissions(uuid, uuid, int, numeric) to authenticated;

-- Member claims one day of VIP income (once per calendar day)
create or replace function public.claim_vip_daily_income()
returns jsonb
language plpgsql
security definer set search_path = public
as $$
declare
  uid uuid;
  purchase record;
  plan_duration int;
  daily_amt numeric;
  new_days int;
  today date := current_date;
begin
  uid := auth.uid();
  if uid is null then
    return jsonb_build_object('error', 'Not authenticated.');
  end if;

  select vp.* into purchase
  from public.vip_purchases vp
  where vp.user_id = uid
    and vp.status = 'active'
    and vp.expires_at > now()
  order by vp.created_at desc
  limit 1;

  if purchase is null then
    return jsonb_build_object('error', 'No active VIP membership.');
  end if;

  select duration_days into plan_duration
  from public.vip_plans
  where id = purchase.plan_id;

  if plan_duration is null then
    plan_duration := 7;
  end if;

  if purchase.days_claimed >= plan_duration then
    update public.vip_purchases
    set status = 'completed'
    where id = purchase.id;
    return jsonb_build_object('error', 'VIP package fully claimed.');
  end if;

  if purchase.last_vip_income_claim = today then
    return jsonb_build_object('error', 'You already claimed today''s VIP income.');
  end if;

  daily_amt := purchase.daily_income;
  new_days := purchase.days_claimed + 1;

  insert into public.vip_income_claims (user_id, vip_purchase_id, amount, day_number)
  values (uid, purchase.id, daily_amt, new_days);

  insert into public.earnings (user_id, type, amount, source_id, description)
  values (
    uid,
    'vip_daily',
    daily_amt,
    purchase.id,
    'VIP daily income — day ' || new_days
  );

  update public.profiles
  set
    balance = balance + daily_amt,
    total_earned = total_earned + daily_amt
  where id = uid;

  update public.vip_purchases
  set
    days_claimed = new_days,
    last_vip_income_claim = today,
    status = case when new_days >= plan_duration then 'completed' else 'active' end
  where id = purchase.id;

  return jsonb_build_object(
    'success', 'Claimed ' || daily_amt || ' Birr VIP income (day ' || new_days || ').',
    'amount', daily_amt,
    'day', new_days
  );
end;
$$;

grant execute on function public.claim_vip_daily_income() to authenticated;

-- RLS policies needed for VIP purchase flow
create policy "Users can create own vip purchases"
  on public.vip_purchases for insert
  with check (auth.uid() = user_id);

create policy "Users can update own vip purchases"
  on public.vip_purchases for update
  using (auth.uid() = user_id);

create policy "Users can insert own earnings"
  on public.earnings for insert
  with check (auth.uid() = user_id);

-- Referrers can view profiles they directly invited (affiliate / referral pages)
create policy "Users can view direct referrals profiles"
  on public.profiles for select
  using (auth.uid() = id or referred_by = auth.uid());
