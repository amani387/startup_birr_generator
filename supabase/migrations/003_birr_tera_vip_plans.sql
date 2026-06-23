-- GoGenzeb: update VIP plans to 6 tiers with new pricing

update public.vip_plans set active = false where level <= 5;

insert into public.vip_plans (level, name, price, daily_income, duration_days, total_return, active) values
  (1, 'VIP 1', 650, 23.21, 7, 162.47, true),
  (2, 'VIP 2', 2700, 96.43, 7, 675.01, true),
  (3, 'VIP 3', 6400, 228.57, 7, 1599.99, true),
  (4, 'VIP 4', 13800, 492.86, 7, 3450.02, true),
  (5, 'VIP 5', 24000, 857.14, 7, 5999.98, true),
  (6, 'VIP 6', 38000, 1357.14, 7, 9499.98, true)
on conflict (level) do update set
  name = excluded.name,
  price = excluded.price,
  daily_income = excluded.daily_income,
  duration_days = excluded.duration_days,
  total_return = excluded.total_return,
  active = excluded.active,
  updated_at = now();

-- Update referral commission settings (15% L1 invitation reward base)
update public.platform_settings set value = '15' where key = 'referral_commission_l1';
