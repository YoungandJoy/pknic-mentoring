# PKNIC Mentoring

> **Don't navigate your career alone. Design it together.**
>
> 북미 거주 현직 직장인이 북미·한국 학생들과 1:1로 매칭되어 커리어 로드맵을 함께 설계하는 멘토링 프로그램.

**스택**: Next.js 14 (App Router) · TypeScript · Tailwind · Recharts · Supabase · Vercel

---

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 — Mentorship for Students(활성) + Career Strategy for Professionals(Coming Soon) |
| `/survey` | 멀티스텝 설문 (멘토/멘티 분기) — `?program=students` 쿼리로 프리셀렉트 가능 |
| `/dashboard` | 실시간 응답 분석 (NA 멘토 / NA 학생 / KR 학생 3축 세그먼트) |

---

## 매칭 대상

- **멘토**: 미국·캐나다 거주 현직 직장인 (산업 시니어)
- **멘티**: 북미 학생 + 한국 학생 (학부생 / 대학원생)
- **멘티 타겟 마켓**: North America / Korea / Either

---

## 로컬 개발

```bash
cd pknic-mentoring
npm install
cp .env.example .env.local   # Supabase 키 입력
npm run dev
```

http://localhost:3000

> Supabase가 설정되지 않아도 설문은 콘솔에 로그되고, 대시보드는 mock 데이터로 동작합니다.

---

## 배포 (이미 완료된 상태)

| 구성 | 위치 |
|------|------|
| GitHub | https://github.com/YoungandJoy/pknic-mentoring |
| Supabase | `zbvaaqlyqfenvszpqalz` (Singapore) |
| Vercel | https://pknic-mentoring.vercel.app |

`main` 브랜치에 push하면 Vercel이 자동 재배포합니다.

---

## 매칭 알고리즘 가중치 (참고)

| 변수 | 출처 | 가중치 |
|------|------|--------|
| `industry_score` | 멘토 전문산업 ↔ 멘티 관심산업 교집합 | 0.25 |
| `function_score` | 멘토 직무 ↔ 멘티 관심직무 교집합 | 0.20 |
| `target_market_score` | 멘티 `target_market`(NA/KR) ↔ 멘토 위치/배경 | 0.15 |
| `seniority_fit` | 멘티 학년 vs 멘토 연차 적합성 | 0.10 |
| `availability_overlap` | 시간대 교집합 | 0.10 |
| `language_match` | 한국어/English 매핑 | 0.10 |
| `topic_score` | 멘토 다룰 수 있는 주제 ↔ 멘티 pain points | 0.10 |

`/dashboard`의 자동 인사이트는 위 가중치를 단순화한 시그널을 노출합니다.

---

## 데이터 모델 (`survey_responses` 핵심 컬럼)

**공통**: `name`, `email`, `country` (US/CA/KR/OTHER), `role` (mentor/mentee), `program` (students/professionals), `languages[]`

**멘토**: `mentor_company`, `mentor_position`, `mentor_seniority`, `mentor_industries[]`, `mentor_functions[]`, `mentor_topics[]`, `mentor_korean_origin`, `mentor_target_mentees[]`, `mentor_timeslots[]`, `mentor_bio`

**멘티**: `mentee_school`, `mentee_school_country`, `mentee_major`, `mentee_grad_year`, `mentee_degree`, `mentee_target_industries[]`, `mentee_target_market` (NA/KR/EITHER), `mentee_career_stage`, `mentee_pain_points[]`, `mentee_expectations`

**매칭**: `match_priority[]`, `match_format_pref`, `match_followup_interest`

---

## 디렉터리 구조

```
pknic-mentoring/
├── app/
│   ├── layout.tsx
│   ├── page.tsx           # 랜딩
│   ├── globals.css
│   ├── survey/page.tsx    # ?program=students|professionals
│   └── dashboard/page.tsx
├── components/
│   ├── SurveyForm.tsx     # 멀티스텝 폼 (mentor/mentee 분기)
│   └── DashboardClient.tsx # 3축 세그먼트 시각화
├── lib/
│   ├── supabase.ts
│   └── types.ts
├── supabase/
│   └── schema.sql
└── package.json
```

---

## 다음 마일스톤

- [ ] 매칭 알고리즘 API (`/api/match`) — 가중 코사인 유사도
- [ ] 관리자 페이지 — 매칭 승인/거부 + 자동 이메일
- [ ] 한/영 i18n
- [ ] Career Strategy for Professionals 트랙 오픈
- [ ] mentoring.pknic.club 도메인 연결
