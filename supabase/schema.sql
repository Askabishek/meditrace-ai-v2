-- Optional private history table. The starter does not write to this table yet.
create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) <= 160),
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

create policy "Users can read their own analyses"
on public.analyses for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Users can create their own analyses"
on public.analyses for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "Users can delete their own analyses"
on public.analyses for delete
to authenticated
using ((select auth.uid()) = user_id);

-- No UPDATE policy is provided because the starter does not need updates.
