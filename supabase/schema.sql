-- ─────────────────────────────────────────────────────────────
-- PKNIC × KOTRA Mentoring Program — Supabase Schema
-- 실행: Supabase 대시보드 > SQL Editor 에서 전체 붙여넣기 후 RUN
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Common
  name text not null,
  email text not null,
  phone text,
  country text not null check (country in ('KR','PK','OTHER')),
  city text,
  affiliation text,
  role text not null check (role in ('mentor','mentee','both')),
  languages text[] default '{}',
  source text,

  -- Mentor
  mentor_position text,
  mentor_seniority text,
  mentor_industries text[] default '{}',
  mentor_functions text[] default '{}',
  mentor_kr_pk_experience text,
  mentor_monthly_hours text,
  mentor_formats text[] default '{}',
  mentor_timeslots text[] default '{}',
  mentor_target_stages text[] default '{}',
  mentor_bio text,
  mentor_linkedin text,

  -- Mentee
  mentee_affiliation_type text,
  mentee_industries text[] default '{}',
  mentee_position text,
  mentee_stage text,
  mentee_help_needs text[] default '{}',
  mentee_expectations text,
  mentee_pref_seniority text,
  mentee_cross_border text,
  mentee_monthly_hours text,
  mentee_timeslots text[] default '{}',
  mentee_company_intro text,
  mentee_url text,

  -- Matching prefs
  match_priority text[] default '{}',
  match_same_country text,
  match_gender_pref text,
  match_format text[] default '{}',
  match_followup_interest int,

  -- Wrap-up
  feedback text,
  consent boolean not null default false
);

create index if not exists idx_survey_role on public.survey_responses (role);
create index if not exists idx_survey_country on public.survey_responses (country);
create index if not exists idx_survey_created_at on public.survey_responses (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.survey_responses enable row level security;

-- 누구나 응답 제출(insert) 가능 (anon 키 기준)
drop policy if exists "anon can insert responses" on public.survey_responses;
create policy "anon can insert responses"
  on public.survey_responses for insert
  to anon
  with check (true);

-- anon 키로는 읽기 가능 — 대시보드에서 시각화 용도.
-- 보안 강화: 실제 운영 시 service_role 키로만 select 허용하도록 변경 권장.
drop policy if exists "anon can read responses" on public.survey_responses;
create policy "anon can read responses"
  on public.survey_responses for select
  to anon
  using (true);

-- ─────────────────────────────────────────────────────────────
-- Helpful views (선택)
-- ─────────────────────────────────────────────────────────────
create or replace view public.v_role_distribution as
select role, count(*) as n
from public.survey_responses
group by role;

create or replace view public.v_industry_demand as
select unnest(mentee_industries) as industry, count(*) as demand
from public.survey_responses
where role in ('mentee','both')
group by 1;

create or replace view public.v_industry_supply as
select unnest(mentor_industries) as industry, count(*) as supply
from public.survey_responses
where role in ('mentor','both')
group by 1;
