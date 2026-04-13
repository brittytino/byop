create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  github_id text not null unique,
  username text not null unique,
  name text not null,
  bio text,
  avatar_url text not null,
  email text,
  location text,
  skills jsonb not null default '[]'::jsonb,
  links jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  theme text not null default 'midnight-inferno',
  is_published boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  title text not null,
  description text,
  github_url text,
  live_url text,
  tech_stack jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists portfolio_views (
  id uuid primary key default gen_random_uuid(),
  portfolio_user_id uuid not null references users(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create index if not exists idx_users_username_lower on users (lower(username));
create index if not exists idx_portfolios_user_published on portfolios(user_id, is_published);
create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_projects_user_updated_at on projects(user_id, updated_at desc);
create unique index if not exists uq_projects_user_github_url
on projects (user_id, github_url)
where github_url is not null;
create index if not exists idx_portfolio_views_user on portfolio_views(portfolio_user_id);
