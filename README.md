# PKNIC × KOTRA Mentoring Program

한국 ↔ 파키스탄 ICT/스타트업 멘토링 프로그램의 수요조사 + 실시간 매칭 분석 대시보드.

**스택**: Next.js 14 (App Router) · TypeScript · Tailwind · Recharts · Supabase · Vercel

---

## 페이지 구성

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 (CTA → 설문) |
| `/survey` | 멀티스텝 설문 (멘토/멘티/양방향 분기) |
| `/dashboard` | 실시간 응답 분석 대시보드 (다크모드, 비번 보호 옵션) |

---

## 로컬 개발

```bash
cd pknic-mentoring
npm install
cp .env.example .env.local   # Supabase 키 입력
npm run dev
```

http://localhost:3000 접속.

> Supabase가 설정되지 않아도 설문은 콘솔에 로그되고, 대시보드는 mock 데이터로 동작합니다.

---

## 1) Supabase 셋업

1. https://supabase.com 에서 새 프로젝트 생성
2. **Project Settings → API** 에서 다음 값 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **SQL Editor**에서 `supabase/schema.sql` 전체를 붙여넣고 RUN
4. `.env.local` 파일에 위 두 값 기록

## 2) GitHub 푸시

새 GitHub repo를 만든 뒤:

```bash
cd pknic-mentoring
git init
git add .
git commit -m "feat: initial PKNIC mentoring platform"
git branch -M main
git remote add origin https://github.com/<USERNAME>/<REPO>.git
git push -u origin main
```

## 3) Vercel 배포

1. https://vercel.com/new 접속
2. GitHub repo import
3. **Root Directory**: `pknic-mentoring` (모노레포 구조이므로)
4. **Environment Variables**에 Supabase 값 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_DASHBOARD_PASSWORD` (선택)
5. **Deploy** 클릭
6. (선택) `mentoring.pknic.club` 도메인을 Vercel Project → Domains 에서 연결

---

## 매칭 알고리즘 (참고)

| 변수 | 출처 | 가중치 |
|------|------|--------|
| `industry_score` | 멘토/멘티 산업 교집합 | 0.30 |
| `function_score` | 직무·도움영역 매핑 | 0.25 |
| `seniority_gap` | 멘토 연차 vs 멘티 단계 | 0.15 |
| `availability_overlap` | 시간대 교집합 | 0.15 |
| `language_match` | 공통 언어 | 0.10 |
| `cross_border_pref` | 양방향 희망 여부 | 0.05 |

`/dashboard`의 자동 인사이트는 위 가중치를 단순화하여 시그널을 추출합니다.

---

## 디렉터리 구조

```
pknic-mentoring/
├── app/
│   ├── layout.tsx
│   ├── page.tsx           # 랜딩
│   ├── globals.css
│   ├── survey/page.tsx
│   └── dashboard/page.tsx
├── components/
│   ├── SurveyForm.tsx     # 멀티스텝 폼
│   └── DashboardClient.tsx # Recharts 대시보드
├── lib/
│   ├── supabase.ts
│   └── types.ts
├── supabase/
│   └── schema.sql
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 다음 마일스톤

- [ ] 매칭 알고리즘 API (`/api/match`) — 가중 코사인 유사도
- [ ] 관리자 페이지 — 매칭 승인/거부 + 이메일 발송
- [ ] 다국어 (한/영/우르두)
- [ ] KOTRA 연동 — 응답 데이터 export API
