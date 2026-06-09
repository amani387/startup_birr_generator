-- Google OAuth: support name from Google metadata + referral linking after OAuth

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

-- Link referral after Google OAuth (callback passes referral_code query param)
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
  where referral_code = trim(ref_code)
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

grant execute on function public.link_referral_by_code(text) to authenticated;
