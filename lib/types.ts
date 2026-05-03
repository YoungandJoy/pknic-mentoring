export type Role = "mentor" | "mentee" | "both";

export type SurveyResponse = {
  id?: string;
  created_at?: string;

  // Common
  name: string;
  email: string;
  phone?: string;
  country: "KR" | "PK" | "OTHER";
  city?: string;
  affiliation?: string;
  role: Role;
  languages: string[];
  source?: string;

  // Mentor-specific
  mentor_position?: string;
  mentor_seniority?: string; // "3-5y" | "6-10y" | "11-15y" | "16-20y" | "20y+"
  mentor_industries?: string[];
  mentor_functions?: string[];
  mentor_kr_pk_experience?: string;
  mentor_monthly_hours?: string;
  mentor_formats?: string[];
  mentor_timeslots?: string[];
  mentor_target_stages?: string[];
  mentor_bio?: string;
  mentor_linkedin?: string;

  // Mentee-specific
  mentee_affiliation_type?: string;
  mentee_industries?: string[];
  mentee_position?: string;
  mentee_stage?: string;
  mentee_help_needs?: string[];
  mentee_expectations?: string;
  mentee_pref_seniority?: string;
  mentee_cross_border?: string;
  mentee_monthly_hours?: string;
  mentee_timeslots?: string[];
  mentee_company_intro?: string;
  mentee_url?: string;

  // Matching prefs
  match_priority?: string[];
  match_same_country?: string;
  match_gender_pref?: string;
  match_format?: string[];
  match_followup_interest?: number;

  // Wrap-up
  feedback?: string;
  consent: boolean;
};

export const INDUSTRIES = [
  "ICT/SaaS","Fintech","Ecommerce","AI/Data","Cybersecurity",
  "Domain/Infra","Gaming","Healthcare","Manufacturing","Content/Media","Other",
];

export const FUNCTIONS = [
  "Engineering","Product","Design/UX","Marketing/Growth","BD/Sales",
  "Investment/Finance","Legal/Regulatory","HR/Org","Global Expansion",
];

export const SENIORITY_MENTOR = [
  { v: "3-5y", label: "3~5년" },
  { v: "6-10y", label: "6~10년" },
  { v: "11-15y", label: "11~15년" },
  { v: "16-20y", label: "16~20년" },
  { v: "20y+", label: "20년+" },
];

export const STAGE_MENTEE = [
  { v: "idea", label: "아이디어/예비창업" },
  { v: "mvp", label: "MVP 개발중" },
  { v: "seed", label: "시드" },
  { v: "seriesA", label: "시리즈A" },
  { v: "growth", label: "시리즈B+ / 그로스" },
  { v: "student", label: "학생/취준" },
];
