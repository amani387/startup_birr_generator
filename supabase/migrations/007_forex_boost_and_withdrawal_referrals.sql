-- Forex VIP income boost + withdrawal referral requirement setting

INSERT INTO public.platform_settings (key, value)
VALUES ('forex_interest_rate', '1.15')
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.platform_settings (key, value)
VALUES ('withdrawal_required_referrals', '2')
ON CONFLICT (key) DO NOTHING;

-- Boosted VIP daily income when user has VIP (forex trade unlocked)
CREATE OR REPLACE FUNCTION public.claim_vip_daily_income()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  uid uuid;
  purchase record;
  plan_duration int;
  base_daily numeric;
  daily_amt numeric;
  new_days int;
  today date := current_date;
  user_vip int := 0;
  forex_rate numeric := 1.15;
  rate_setting jsonb;
BEGIN
  uid := auth.uid();
  IF uid IS NULL THEN
    RETURN jsonb_build_object('error', 'Not authenticated.');
  END IF;

  SELECT vip_level INTO user_vip FROM public.profiles WHERE id = uid;

  SELECT value INTO rate_setting
  FROM public.platform_settings
  WHERE key = 'forex_interest_rate';

  IF rate_setting IS NOT NULL THEN
    forex_rate := (rate_setting #>> '{}')::numeric;
  END IF;

  SELECT vp.* INTO purchase
  FROM public.vip_purchases vp
  WHERE vp.user_id = uid
    AND vp.status = 'active'
    AND vp.expires_at > now()
  ORDER BY vp.created_at DESC
  LIMIT 1;

  IF purchase IS NULL THEN
    RETURN jsonb_build_object('error', 'No active VIP membership.');
  END IF;

  SELECT duration_days INTO plan_duration
  FROM public.vip_plans
  WHERE id = purchase.plan_id;

  IF plan_duration IS NULL THEN
    plan_duration := 7;
  END IF;

  IF purchase.days_claimed >= plan_duration THEN
    UPDATE public.vip_purchases
    SET status = 'completed'
    WHERE id = purchase.id;
    RETURN jsonb_build_object('error', 'VIP package fully claimed.');
  END IF;

  IF purchase.last_vip_income_claim = today THEN
    RETURN jsonb_build_object('error', 'You already claimed today''s VIP income.');
  END IF;

  base_daily := purchase.daily_income;

  IF user_vip > 0 THEN
    daily_amt := round(base_daily * forex_rate + user_vip, 2);
  ELSE
    daily_amt := base_daily;
  END IF;

  new_days := purchase.days_claimed + 1;

  INSERT INTO public.vip_income_claims (user_id, vip_purchase_id, amount, day_number)
  VALUES (uid, purchase.id, daily_amt, new_days);

  INSERT INTO public.earnings (user_id, type, amount, source_id, description)
  VALUES (
    uid,
    'vip_daily',
    daily_amt,
    purchase.id,
    'Forex VIP income — day ' || new_days || ' (boosted)'
  );

  UPDATE public.profiles
  SET
    balance = balance + daily_amt,
    total_earned = total_earned + daily_amt
  WHERE id = uid;

  UPDATE public.vip_purchases
  SET
    days_claimed = new_days,
    last_vip_income_claim = today,
    status = CASE WHEN new_days >= plan_duration THEN 'completed' ELSE 'active' END
  WHERE id = purchase.id;

  RETURN jsonb_build_object(
    'success', 'Claimed ' || daily_amt || ' Birr VIP income (day ' || new_days || ').',
    'amount', daily_amt,
    'day', new_days
  );
END;
$$;
