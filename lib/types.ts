// PKNIC Mentoring — North America-based seniors mentoring NA + Korea students AND junior professionals
// 멘토 = 북미 거주 직장인 / 멘티 = 학생 또는 주니어·미드 직장인

export type Role = "mentor" | "mentee";
export type MenteeType = "student" | "professional"; // 학생 vs 직장인 멘티
export type Program = "students" | "professionals";
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
  mentee_type?: MenteeType; // role === mentee 일 때 학생/직장인
  program: Program;
  languages: string[];
  source?: string;
  consent: boolean;

  // 매칭 효율을 높이는 새 공통 필드
  mentoring_language_pref?: string; // 멘토링 시 선호 언어
  urgency?: string; // 매칭 시급도
  visa_status?: string; // 신분/비자 (멘티에게 유의미)

  // ─── Mentor (북미 거주 직장인) ───
  mentor_company?: string;
  mentor_position?: string;
  mentor_seniority?: string;
  mentor_management?: string; // IC vs People Manager 등
  mentor_industries?: string[];
  mentor_functions?: string[];
  mentor_companies_history?: string;
  mentor_years_in_na?: string;
  mentor_korean_origin?: string; // 더 다양한 옵션
  mentor_monthly_hours?: string;
  mentor_formats?: string[];
  mentor_timeslots?: string[];
  mentor_target_mentees?: string[];
  mentor_bio?: string;
  mentor_topics?: string[];

  // ─── Mentee — 학생 ───
  mentee_school?: string;
  mentee_school_country?: Country;
  mentee_major?: string;
  mentee_grad_year?: string;
  mentee_degree?: string;

  // ─── Mentee — 직장인 (주니어/이직/리더십 고민) ───
  mentee_pro_company?: string;
  mentee_pro_position?: string; // 자유 입력 (정확한 직책)
  mentee_pro_current_function?: string; // 표준화된 직무 카테고리 (FUNCTIONS 중 하나)
  mentee_pro_seniority?: string; // 1-3y / 4-7y / 8-12y / 13y+
  mentee_pro_career_stage?: string; // junior / senior / lead_manager / career_switcher
  mentee_pro_focus?: string; // 큰 카테고리: 이직 / 승진 / 창업 / 글로벌 / 학위 / 피봇 / 일반
  mentee_pro_needs?: string[]; // 세부 멘토링 니즈 (multi-select)
  mentee_pro_management_track?: string; // IC vs Manager 트랙 선호
  mentee_korean_origin?: string; // 멘티 본인의 한국 학력/배경 (멘토와 동일 옵션 사용)

  // ─── Mentee — 공통 (학생·직장인 둘 다) ───
  mentee_target_industries?: string[];
  mentee_target_functions?: string[];
  mentee_target_market?: string; // "NA" / "KR" / "EITHER"
  mentee_career_stage?: string;
  mentee_pain_points?: string[];
  mentee_expectations?: string;
  mentee_pref_seniority?: string;
  mentee_monthly_hours?: string;
  mentee_timeslots?: string[];
  mentee_resume_url?: string;

  // ─── Matching prefs ───
  match_priority?: string[];
  match_format_pref?: string;
  match_followup_interest?: number;
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
  "Education / EdTech",
  "Real Estate / PropTech",
  "Legal",
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

export const MENTEE_PRO_SENIORITY = [
  { v: "0-1y", label: "신입~1년" },
  { v: "1-3y", label: "1~3년" },
  { v: "4-7y", label: "4~7년" },
  { v: "8-12y", label: "8~12년" },
  { v: "13y+", label: "13년+" },
];

export const MENTEE_PRO_FOCUS = [
  "이직 (북미 내)",
  "이직 (한국 ↔ 북미)",
  "승진 / 리더십 전환",
  "창업 / 사이드 프로젝트",
  "대학원 / 학위 진학",
  "커리어 피봇 (직무 전환)",
  "전반 커리어 코칭",
];

// ── 직장인 멘티 — 경력 단계 카테고리 (연차와는 다른 차원) ──
export const MENTEE_PRO_CAREER_STAGE = [
  { v: "junior", label: "🌱 주니어", desc: "1~3년차 / 첫 직장·실무 적응 단계" },
  { v: "senior", label: "🚀 시니어 IC", desc: "4~10년차 IC / 시니어 트랙 진행 중" },
  { v: "lead_manager", label: "👥 팀장·매니저", desc: "사람 관리 시작했거나 시니어 리더 트랙" },
  { v: "career_switcher", label: "🔄 커리어 전환자", desc: "직무·산업·국가 전환 고민 중" },
];

// ── 직장인 멘티 — 세부 멘토링 니즈 (multi-select, 직장인 특화) ──
// 카테고리: 네트워킹 / 이직 준비 / 직무 스킬 / 리더십 / 글로벌 / 라이프
export const MENTEE_PRO_NEEDS = [
  // 네트워킹
  "🤝 산업 네트워킹·인맥 확장",
  "🗣 커뮤니티·단톡방 진입",
  // 이직 준비
  "📝 이력서·LinkedIn 리뷰",
  "🎯 인터뷰 준비 (BQ·기술·케이스)",
  "💰 오퍼·연봉 협상",
  "📌 채용 전략·타겟 회사 선정",
  // 직무 스킬
  "🔧 직무 스킬 업 (기술·도메인)",
  "📊 데이터·AI 리터러시",
  "🎨 프로덕트·UX 감각",
  // 리더십
  "📈 시니어 IC 트랙 / 프로모션",
  "👥 IC → People Manager 전환",
  "🏛 시니어 리더십·디렉터 트랙",
  "📋 성과 평가·리뷰 전략",
  // 글로벌·창업·학위
  "🌏 한국 ↔ 북미 글로벌 이직",
  "🛂 비자·sponsorship 전략",
  "💡 창업·사이드 프로젝트",
  "🎓 MBA·대학원 진학",
  // 피봇·라이프
  "🔄 직무·산업 피봇",
  "⚖️ 워크라이프 밸런스·번아웃",
  "🧭 장기 커리어 설계",
];

export const PRO_TRACK_PREF = [
  { v: "ic", label: "IC 트랙 유지" },
  { v: "manager", label: "People Manager 전환" },
  { v: "either", label: "둘 다 열려있음" },
  { v: "undecided", label: "아직 모름" },
];

export const MENTOR_TOPICS = [
  "북미 취업 (신입)",
  "북미 이직 / 인턴십",
  "비자 / OPT / H-1B",
  "이력서·포트폴리오 리뷰",
  "인터뷰 준비 (코딩·케이스·BQ)",
  "한국 → 북미 진출",
  "북미 → 한국 진출",
  "리더십 / 매니지먼트",
  "창업 / 사이드 프로젝트",
  "장기 커리어 설계",
  "대학원 진학 / 학업",
  "이민·정착 일반",
];

export const MENTEE_PAIN_POINTS = [
  "어떤 산업·직무가 맞는지 모르겠음",
  "이력서·자소서가 약함",
  "인터뷰 준비가 막막함",
  "네트워킹 채널이 없음",
  "비자·취업 절차가 복잡함",
  "학교에서 배우는 게 실무와 동떨어짐",
  "정보 과잉 — 우선순위 못 정함",
  "이직 타이밍·전략이 고민",
  "한국 ↔ 북미 진출 의사결정",
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

// 한국 배경 — 더 다양한 옵션 (single select이지만 다양한 케이스 포괄)
export const KOREAN_ORIGIN = [
  { v: "kr_native", label: "한국에서 출생·성장 후 북미 진출 (1세대)" },
  { v: "kr_grad_then_na", label: "한국 학부 → 북미 대학원/취업" },
  { v: "kr_to_na_undergrad", label: "한국 K-12 → 북미 학부 (조기 유학)" },
  { v: "1_5_gen", label: "1.5세 (어린 시절 북미 이주)" },
  { v: "2nd_gen", label: "북미 출생·성장 (2세 이상)" },
  { v: "na_to_kr", label: "북미에서 자랐고 한국 대학/경력" },
  { v: "mixed", label: "혼합/제3국 경험 (예: 한국·미국·유럽)" },
  { v: "non_korean", label: "한국 백그라운드 없음 / 응답 안 함" },
];

// 신분/비자 — 매칭에서 매우 중요한 변수 (특히 북미 취업 멘토링)
export const VISA_STATUS = [
  { v: "us_citizen_pr", label: "🇺🇸 미국 시민권 / 영주권" },
  { v: "ca_citizen_pr", label: "🇨🇦 캐나다 시민권 / 영주권" },
  { v: "f1", label: "F-1 (학생비자)" },
  { v: "opt", label: "OPT / STEM OPT" },
  { v: "h1b", label: "H-1B / 취업비자 (sponsorship 필요)" },
  { v: "kr_resident", label: "한국 거주 (비자 무관)" },
  { v: "other_visa", label: "기타" },
  { v: "no_answer", label: "응답하지 않음" },
];

export const MENTORING_LANG = [
  { v: "ko", label: "한국어 위주" },
  { v: "en", label: "English 위주" },
  { v: "both", label: "둘 다 가능" },
];

export const URGENCY = [
  { v: "asap", label: "🔥 즉시 (1개월 내)" },
  { v: "short", label: "단기 (1~3개월)" },
  { v: "mid", label: "중기 (3~6개월)" },
  { v: "long", label: "장기 / 무관" },
];

export const MGMT_TYPE = [
  { v: "ic", label: "IC (Individual Contributor)" },
  { v: "manager", label: "Manager (직접 관리)" },
  { v: "director_plus", label: "Director / Senior Leadership" },
  { v: "founder", label: "Founder / Co-founder" },
];
