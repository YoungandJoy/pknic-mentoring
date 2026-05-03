-- ─────────────────────────────────────────────────────────────
-- PKNIC Mentoring — Supabase Schema (v2)
-- 멘토(NA 직장인) ↔ 멘티(NA 학생 + KR 학생) 매칭 프로그램용
-- 실행: Supabase 대시보드 > SQL Editor 에서 전체 붙여넣기 후 RUN
-- ─────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

-- 기존 테이블이 있으면 깨끗하게 제거 (운영 데이터 없을 때만 실행)
drop view if exists public.v_role_distribution cascade;
drop view if exists public.v_industry_demand cascade;
drop view if exists public.v_industry_supply cascade;
drop view if exists public.v_segment_distribution cascade;
drop table if exists public.survey_responses cascade;

create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Common
  name text not null,
  email text not null,
  phone text,
  country text not null check (country in ('US','CA','KR','OTHER')),
  city text,
  linkedin text,
  role text not null check (role in ('mentor','mentee')),
  program text not null default 'students' check (program in ('students','professionals')),
  languages text[] default '{}',
  source text,

  -- Mentor (북미 거주 직장인)
  mentor_company text,
  mentor_position text,
  mentor_seniority text,
  mentor_industries text[] default '{}',
  mentor_functions text[] default '{}',
  mentor_companies_history text,
  mentor_years_in_na text,
  mentor_korean_origin text,
  mentor_monthly_hours text,
  mentor_formats text[] default '{}',
  mentor_timeslots text[] default '{}',
  mentor_target_mentees text[] default '{}',
  mentor_bio text,
  mentor_topics text[] default '{}',

  -- Mentee (학생)
  mentee_school text,
  mentee_school_country text check (mentee_school_country in ('US','CA','KR','OTHER')),
  mentee_major text,
  mentee_grad_year text,
  mentee_degree text,
  mentee_target_industries text[] default '{}',
  mentee_target_functions text[] default '{}',
  mentee_target_market text check (mentee_target_market in ('NA','KR','EITHER')),
  mentee_career_stage text,
  mentee_pain_points text[] default '{}',
  mentee_expectations text,
  mentee_pref_seniority text,
  mentee_monthly_hours text,
  mentee_timeslots text[] default '{}',
  mentee_resume_url text,

  -- Matching prefs
  match_priority text[] default '{}',
  match_format_pref text,
  match_followup_interest int,

  -- Wrap-up
  feedback text,
  consent boolean not null default false
);

-- Indexes
create index idx_survey_role on public.survey_responses (role);
create index idx_survey_country on public.survey_responses (country);
create index idx_survey_school_country on public.survey_responses (mentee_school_country);
create index idx_survey_target_market on public.survey_responses (mentee_target_market);
create index idx_survey_program on public.survey_responses (program);
create index idx_survey_created_at on public.survey_responses (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────
alter table public.survey_responses enable row level security;

drop policy if exists "anon can insert responses" on public.survey_responses;
create policy "anon can insert responses"
  on public.survey_responses for insert
  to anon
  with check (true);

drop policy if exists "anon can read responses" on public.survey_responses;
create policy "anon can read responses"
  on public.survey_responses for select
  to anon
  using (true);

-- ─────────────────────────────────────────────────────────────
-- Helpful views
-- ─────────────────────────────────────────────────────────────

-- 3축 세그먼트 분포 (NA 멘토 / NA 학생 / KR 학생 / 기타)
create or replace view public.v_segment_distribution as
select
  case
    when role = 'mentor' and country in ('US','CA') then 'na_mentor'
    when role = 'mentee' and coalesce(mentee_school_country, country) = 'KR' then 'kr_student'
    when role = 'mentee' and coalesce(mentee_school_country, country) in ('US','CA') then 'na_student'
    else 'other'
  end as segment,
  count(*) as n
from public.survey_responses
group by 1;

-- 산업 수요 (멘티)
create or replace view public.v_industry_demand as
select unnest(mentee_target_industries) as industry, count(*) as demand
from public.survey_responses
where role = 'mentee'
group by 1;

-- 산업 공급 (멘토)
create or replace view public.v_industry_supply as
select unnest(mentor_industries) as industry, count(*) as supply
from public.survey_responses
where role = 'mentor'
group by 1;

-- 멘티 타겟 마켓 분포
create or replace view public.v_target_market as
select mentee_target_market, count(*) as n
from public.survey_responses
where role = 'mentee' and mentee_target_market is not null
group by 1;
