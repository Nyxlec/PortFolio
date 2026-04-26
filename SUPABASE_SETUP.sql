-- =========================================================
-- Configuration Supabase pour le portfolio Dorian Lecomte
-- À exécuter une seule fois dans : Supabase Dashboard → SQL Editor
-- =========================================================

-- 1. Table messages
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 100),
  email       text not null check (char_length(email) between 3 and 200),
  subject     text check (char_length(subject) <= 200),
  body        text not null check (char_length(body) between 1 and 5000),
  ip_hash     text,
  user_agent  text,
  read        boolean not null default false
);

create index if not exists messages_created_at_idx on public.messages (created_at desc);
create index if not exists messages_read_idx on public.messages (read);

-- 2. Active Row Level Security
alter table public.messages enable row level security;

-- 3. Policies : N'IMPORTE QUI peut INSERT (formulaire public)
--    Mais SEUL un utilisateur authentifié peut SELECT/UPDATE/DELETE
drop policy if exists "anyone can insert messages" on public.messages;
create policy "anyone can insert messages"
  on public.messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "only authenticated can read messages" on public.messages;
create policy "only authenticated can read messages"
  on public.messages
  for select
  to authenticated
  using (true);

drop policy if exists "only authenticated can update messages" on public.messages;
create policy "only authenticated can update messages"
  on public.messages
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "only authenticated can delete messages" on public.messages;
create policy "only authenticated can delete messages"
  on public.messages
  for delete
  to authenticated
  using (true);

-- 4. Vérification
-- Tu dois voir 4 policies actives sur la table messages
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where tablename = 'messages';
