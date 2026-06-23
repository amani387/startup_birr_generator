-- Admin-editable payment and social contact details
INSERT INTO public.platform_settings (key, value) VALUES
  ('telebirr_phone', to_jsonb('0929025757'::text)),
  ('telebirr_account_holder', to_jsonb('Abera'::text)),
  ('cbe_account_number', to_jsonb('Contact support for details'::text)),
  ('cbe_account_holder', to_jsonb('GoGenzeb'::text)),
  ('youtube_channel_url', to_jsonb('https://youtube.com'::text)),
  ('telegram_group_url', to_jsonb('https://t.me'::text)),
  ('telegram_channel_url', to_jsonb('https://t.me'::text)),
  ('twitter_url', to_jsonb('https://x.com'::text)),
  ('facebook_page_url', to_jsonb('https://facebook.com'::text))
ON CONFLICT (key) DO NOTHING;
