-- ============================================================
-- CABLELINE — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`).
-- Sets up profiles, posts, likes, comments, follows, storage and RLS.
-- ============================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  home_park text,
  created_at timestamptz not null default now()
);

-- ---------- posts ----------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles (id) on delete cascade,
  image_url text not null,
  caption text,
  park text,
  created_at timestamptz not null default now()
);
create index if not exists posts_author_created_idx
  on public.posts (author_id, created_at desc);
create index if not exists posts_created_idx on public.posts (created_at desc);

-- ---------- likes ----------
create table if not exists public.likes (
  post_id uuid not null references public.posts (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ---------- comments ----------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists comments_post_idx on public.comments (post_id, created_at);

-- ---------- follows ----------
create table if not exists public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  following_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (follower_id, following_id),
  check (follower_id <> following_id)
);

-- ============================================================
-- Auto-create a profile row when a user signs up.
-- The username is taken from sign-up metadata; falls back to a unique slug.
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  uname text;
begin
  uname := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    'rider_' || substr(new.id::text, 1, 8)
  );
  -- guarantee uniqueness
  if exists (select 1 from public.profiles where username = uname) then
    uname := uname || '_' || substr(new.id::text, 1, 4);
  end if;

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    uname,
    coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), uname)
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.likes enable row level security;
alter table public.comments enable row level security;
alter table public.follows enable row level security;

-- profiles: world-readable, self-writable
drop policy if exists "profiles read" on public.profiles;
create policy "profiles read" on public.profiles for select using (true);
drop policy if exists "profiles update self" on public.profiles;
create policy "profiles update self" on public.profiles
  for update using (auth.uid() = id);
drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles insert self" on public.profiles
  for insert with check (auth.uid() = id);

-- posts: world-readable, author-writable
drop policy if exists "posts read" on public.posts;
create policy "posts read" on public.posts for select using (true);
drop policy if exists "posts insert own" on public.posts;
create policy "posts insert own" on public.posts
  for insert with check (auth.uid() = author_id);
drop policy if exists "posts delete own" on public.posts;
create policy "posts delete own" on public.posts
  for delete using (auth.uid() = author_id);

-- likes: world-readable, self-writable
drop policy if exists "likes read" on public.likes;
create policy "likes read" on public.likes for select using (true);
drop policy if exists "likes insert self" on public.likes;
create policy "likes insert self" on public.likes
  for insert with check (auth.uid() = user_id);
drop policy if exists "likes delete self" on public.likes;
create policy "likes delete self" on public.likes
  for delete using (auth.uid() = user_id);

-- comments: world-readable, author-writable
drop policy if exists "comments read" on public.comments;
create policy "comments read" on public.comments for select using (true);
drop policy if exists "comments insert own" on public.comments;
create policy "comments insert own" on public.comments
  for insert with check (auth.uid() = author_id);
drop policy if exists "comments delete own" on public.comments;
create policy "comments delete own" on public.comments
  for delete using (auth.uid() = author_id);

-- follows: world-readable, follower-writable
drop policy if exists "follows read" on public.follows;
create policy "follows read" on public.follows for select using (true);
drop policy if exists "follows insert self" on public.follows;
create policy "follows insert self" on public.follows
  for insert with check (auth.uid() = follower_id);
drop policy if exists "follows delete self" on public.follows;
create policy "follows delete self" on public.follows
  for delete using (auth.uid() = follower_id);

-- ============================================================
-- Storage buckets for images (public read).
-- ============================================================
insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id in ('posts', 'avatars'));

drop policy if exists "media auth upload" on storage.objects;
create policy "media auth upload" on storage.objects
  for insert with check (
    bucket_id in ('posts', 'avatars') and auth.role() = 'authenticated'
  );

drop policy if exists "media owner update" on storage.objects;
create policy "media owner update" on storage.objects
  for update using (owner = auth.uid());

drop policy if exists "media owner delete" on storage.objects;
create policy "media owner delete" on storage.objects
  for delete using (owner = auth.uid());
