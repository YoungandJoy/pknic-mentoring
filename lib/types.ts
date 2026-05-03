// PKNIC Mentoring — North America-based professionals mentoring NA + Korea students
// 멘토 = 북미 거주 직장인 / 멘티 = 북미 학생 + 한국 학생

export type Role = "mentor" | "mentee";
export type Program = "students" | "professionals"; // mentee가 선택. professionals는 Coming Soon
export type Country = "US" | "CA" | "KR" | "OTHER";

export type SurveyResponse = {
  id?: string;
  created_at?: string;

  // ─── Common ───
  name: string;
  email: string;
  phone?: string;
  country: Country;
  city?: string;
  linkedin?: string;
  role: Role;
  program: Program; // 어떤 프로그램에 참여하고 싶은지
  languages: string[]; // ["한국어","English","기타"]
  source?: string; // 어떻게 알게 됐는지
  consent: boolean;

  // ─── Mentor (북미 거주 직장인) ───
  mentor_company?: string;
  mentor_position?: string; // 현재 직무 e.g. Senior SWE, PM, Designer
  mentor_seniority?: string; // 연차 그룹
  mentor_industries?: string[]; // 전문 산업군
  mentor_functions?: string[]; // 직무 영역
  mentor_companies_history?: string; // 거쳐온 회사들 (자유 입력)
  mentor_years_in_na?: string; // 북미 체류 연차
  mentor_korean_origin?: string; // 한국 학력/배경 ("yes"/"no"/"partial")
  mentor_monthly_hours?: string; // 월 가용 시간
  mentor_formats?: string[]; // 1:1 화상 / 그룹 세션 / 비동기
  mentor_timeslots?: string[]; // 가능 시간대 (PT/KST 매핑)
  mentor_target_mentees?: string[]; // 어떤 멘티 선호 (NA 학생/KR 학생/취준생/주니어 직장인)
  mentor_bio?: string; // 한 줄 소개
  mentor_topics?: string[]; // 다룰 수 있는 주제 (취업·이직·비자·리더십 등)

  // ─── Mentee — 학생 (Mentorship for Students) ───
  mentee_school?: string;
  mentee_school_country?: Country; // 학교 소재 국가
  mentee_major?: string;
  mentee_grad_year?: string; // e.g. 2026
  mentee_degree?: string; // BS/MS/PhD/MBA
  mentee_target_industries?: string[];
  mentee_target_functions?: string[];
  mentee_target_market?: string; // "NA" / "KR" / "EITHER"
  mentee_career_stage?: string; // exploring / decided / job-search / internship-search
  mentee_pain_points?: string[]; // 가장 막히는 부분
  mentee_expectations?: string;
  mentee_pref_seniority?: string; // 선호 멘토 연차
  mentee_monthly_hours?: string;
  mentee_timeslots?: string[];
  mentee_resume_url?: string;

  // ─── Matching prefs (공통) ───
  match_priority?: string[]; // 산업/직무/타겟마켓/언어/시간대/배경
  match_format_pref?: string;
  match_followup_interest?: number; // 1~5 후속 프로그램 관심
  feedback?: string;
};

// ─── 옵션 상수 ───
export const COUNTRIES: { v: Country; label: string }[] = [
  { v: "US", label: "🇺🇸 미국" },
  { v: "CA", label: "🇨🇦 캐나다" },
  { v: "KR", label: "🇰🇷 대한민국" },
  { v: "OTHER", label: "기타" },
];

export const INDUSTRIES = [
  "Tech / Software",
  "Finance / IB",
  "Consulting",
  "Healthcare / Biotech",
  "Hardware / Semiconductors",
  "AI / ML",
  "Product / SaaS",
  "Media / Entertainment",
  "Consumer / Retail",
  "Energy / Climate",
  "Government / Non-profit",
  "Startup / VC",
  "Other",
];

export const FUNCTIONS = [
  "Software Engineering",
  "Product Management",
  "Design / UX",
  "Data / Analytics",
  "Marketing / Growth",
  "Sales / BD",
  "Finance / Accounting",
  "Operations / Strategy",
  "Research / R&D",
  "Legal / Compliance",
  "HR / People",
];

export const MENTOR_SENIORITY = [
  { v: "1-3y", label: "1~3년" },
  { v: "4-7y", label: "4~7년" },
  { v: "8-12y", label: "8~12년" },
  { v: "13-18y", label: "13~18년" },
  { v: "18y+", label: "18년+" },
];

export const MENTOR_TOPICS = [
  "북미 취업 (신입)",
  "북미 이직 / 인턴십",
  "비자 / OPT / H-1B",
  "이력서·포트폴리오 리뷰",
  "인터뷰 준비 (코딩·케이스·BQ)",
  "한국→북미 진출",
  "북미→한국 진출",
  "리더십 / 매니지먼트",
  "창업 / 사이드 프로젝트",
  "장기 커리어 설계",
];

export const MENTEE_PAIN_POINTS = [
  "어떤 산업/직무가 맞는지 모르겠음",
  "이력서·자소서가 약함",
  "인터뷰 준비가 막막함",
  "네트워킹할 채널이 없음",
  "비자·취업 절차가 복잡함",
  "학교 안에서 배우는 게 실무와 동떨어진 느낌",
  "정보가 너무 많아서 우선순위 못 정함",
];

export const TIME_SLOTS = [
  "주중 오전 (KST)",
  "주중 저녁 (KST)",
  "주말 (KST)",
  "Weekday morning (PT)",
  "Weekday evening (PT)",
  "Weekend (PT)",
];

export const DEGREES = ["High school", "Bachelor's", "Master's", "PhD", "MBA", "Bootcamp"];
