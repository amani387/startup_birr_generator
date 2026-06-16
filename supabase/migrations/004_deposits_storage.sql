-- Deposits storage bucket for payment screenshot uploads

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'deposits',
  'deposits',
  false,
  5242880,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Users upload to their own folder: {user_id}/{filename}
create policy "Users upload own deposit screenshots"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'deposits'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users read own deposit screenshots"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'deposits'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Admins read all deposit screenshots"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'deposits'
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
