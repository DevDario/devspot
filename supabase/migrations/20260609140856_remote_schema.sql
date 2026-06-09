-- PLACES
create table places (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null check (type in ('café','cowork','esplanada','restaurant','library','other')),
  lat double precision not null,
  lng double precision not null,
  address text,
  hours text,
  price_range int check (price_range between 1 and 3),
  vibe text check (vibe in ('calm','retro','modern')),
  use_cases text[] default '{}',
  tags text[] default '{}',
  submitted_by uuid references auth.users(id),
  verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Full-text search (trigger-based)
alter table places add column fts tsvector;
create index places_fts_idx on places using gin(fts);

create or replace function places_fts_update() returns trigger as $$
begin
  new.fts := to_tsvector('portuguese', coalesce(new.name,'') || ' ' || coalesce(array_to_string(new.tags,' '), ''));
  return new;
end;
$$ language plpgsql;

create trigger places_fts_trigger
  before insert or update on places
  for each row execute function places_fts_update();

-- REVIEWS
create table reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid references places(id) on delete cascade,
  user_id uuid references auth.users(id),
  rating int not null check (rating between 1 and 5),
  wifi_quality int check (wifi_quality between 1 and 3),
  noise_level text check (noise_level in ('quiet','moderate','loud')),
  power_outlets boolean,
  body text,
  photos text[] default '{}',
  created_at timestamptz default now(),
  unique(place_id, user_id)
);

-- PROFILES (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id),
  username text unique not null,
  avatar_url text,
  bio text,
  role text default 'user' check (role in ('user','moderator','admin')),
  created_at timestamptz default now()
);

-- SAVES / FAVORITES
create table saves (
  user_id uuid references auth.users(id),
  place_id uuid references places(id),
  created_at timestamptz default now(),
  primary key(user_id, place_id)
);

-- RLS POLICIES
alter table places enable row level security;
create policy "public read" on places for select using (true);
create policy "auth insert" on places for insert with check (auth.uid() = submitted_by);
create policy "owner update" on places for update using (auth.uid() = submitted_by);

alter table reviews enable row level security;
create policy "public read reviews" on reviews for select using (true);
create policy "auth insert reviews" on reviews for insert with check (auth.uid() = user_id);
create policy "owner update reviews" on reviews for update using (auth.uid() = user_id);

alter table profiles enable row level security;
create policy "public read profiles" on profiles for select using (true);
create policy "auth insert profiles" on profiles for insert with check (auth.uid() = id);
create policy "owner update profiles" on profiles for update using (auth.uid() = id);

alter table saves enable row level security;
create policy "owner read saves" on saves for select using (auth.uid() = user_id);
create policy "owner insert saves" on saves for insert with check (auth.uid() = user_id);
create policy "owner delete saves" on saves for delete using (auth.uid() = user_id);

-- STORAGE BUCKETS
insert into storage.buckets (id, name, public) values ('place-photos', 'place-photos', true);
insert into storage.buckets (id, name, public) values ('review-photos', 'review-photos', true);
