-- Ejecutar en Supabase: SQL Editor > New query
create extension if not exists "pgcrypto";

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- Sin políticas: solo el backend (service role) puede leer/escribir
alter table public.users enable row level security;
