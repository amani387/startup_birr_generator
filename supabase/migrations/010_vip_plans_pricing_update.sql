-- Sync VIP plan pricing and daily income (6 tiers)

UPDATE public.vip_plans SET active = false WHERE level > 6 OR level < 1;

INSERT INTO public.vip_plans (level, name, price, daily_income, duration_days, total_return, active) VALUES
  (1, 'VIP 1', 650, 23.21, 7, 162.47, true),
  (2, 'VIP 2', 2700, 96.43, 7, 675.01, true),
  (3, 'VIP 3', 6400, 228.57, 7, 1599.99, true),
  (4, 'VIP 4', 13800, 492.86, 7, 3450.02, true),
  (5, 'VIP 5', 24000, 857.14, 7, 5999.98, true),
  (6, 'VIP 6', 38000, 1357.14, 7, 9499.98, true)
ON CONFLICT (level) DO UPDATE SET
  name = EXCLUDED.name,
  price = EXCLUDED.price,
  daily_income = EXCLUDED.daily_income,
  duration_days = EXCLUDED.duration_days,
  total_return = EXCLUDED.total_return,
  active = EXCLUDED.active,
  updated_at = now();
