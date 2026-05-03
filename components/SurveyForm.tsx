"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  SurveyResponse,
  COUNTRIES,
  INDUSTRIES,
  FUNCTIONS,
  MENTOR_SENIORITY,
  MENTOR_TOPICS,
  MENTEE_PAIN_POINTS,
  TIME_SLOTS,
  DEGREES,
} from "@/lib/types";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import ResultPanel from "@/components/ResultPanel";

const STEPS = ["기본 정보", "역할별 정보", "매칭 선호도", "마무리"] as const;

const empty: SurveyResponse = {
  name: "",
  email: "",
  country: "US",
  role: "mentor",
  program: "students",
  languages: [],
  consent: false,
  match_priority: [],
  match_followup_interest: 3,
  mentor_industries: [],
  mentor_functions: [],
  mentor_formats: [],
  mentor_timeslots: [],
  mentor_target_mentees: [],
  mentor_topics: [],
  mentee_target_industries: [],
  mentee_target_functions: [],
  mentee_pain_points: [],
  mentee_timeslots: [],
};

const Pill = ({ active, onClick, children }: any) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
      active
        ? "bg-brand-primary text-brand-bg border-brand-primary"
        : "bg-transparent text-brand-textDim border-brand-border hover:border-brand-primary/50"
    }`}
  >
    {children}
  </button>
);

const Field = ({ label, children, hint }: any) => (
  <div className="space-y-2">
    <label className="block">{label}</label>
    {children}
    {hint && <div className="text-[11px] text-brand-textDim">{hint}</div>}
  </div>
);

export default function SurveyForm() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SurveyResponse>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // /survey?program=students 같은 쿼리 처리
  useEffect(() => {
    const p = searchParams.get("program");
    if (p === "professionals" || p === "students") {
      setData((d) => ({ ...d, program: p as any }));
    }
  }, [searchParams]);

  const update = (patch: Partial<SurveyResponse>) => setData((d) => ({ ...d, ...patch }));
  const toggle = (key: keyof SurveyResponse, value: string) => {
    const arr = (data[key] as string[]) || [];
    update({
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    } as any);
  };

  const isMentor = data.role === "mentor";
  const isMentee = data.role === "mentee";

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!data.name.trim()) return "성함을 입력해주세요";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "올바른 이메일을 입력해주세요";
      if (!data.languages.length) return "사용 가능한 언어를 1개 이상 선택해주세요";
    }
    if (step === 1) {
      if (isMentor) {
        if (!data.mentor_seniority) return "경력 연차를 선택해주세요";
        if (!(data.mentor_industries || []).length) return "전문 산업군을 1개 이상 선택해주세요";
        if (!data.mentor_company?.trim()) return "현재 소속을 입력해주세요";
      }
      if (isMentee) {
        if (!data.mentee_school?.trim()) return "소속 학교를 입력해주세요";
        if (!data.mentee_major?.trim()) return "전공을 입력해주세요";
        if (!(data.mentee_target_industries || []).length)
          return "관심 산업군을 1개 이상 선택해주세요";
        if (!data.mentee_target_market) return "타겟 마켓(지역)을 선택해주세요";
      }
    }
    if (step === 3 && !data.consent) return "결과 활용에 동의해주세요";
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  };

  const submit = async () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (!isSupabaseConfigured) {
        console.log("[DEV] Survey response:", data);
        await new Promise((r) => setTimeout(r, 800));
        setDone(true);
        return;
      }
      const { error } = await supabase
        .from("survey_responses")
        .insert([{ ...data, created_at: new Date().toISOString() }]);
      if (error) throw error;
      setDone(true);
    } catch (e: any) {
      setError(e.message || "제출 중 오류가 발생했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return <ResultPanel mine={data} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pb-20">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-xs text-brand-textDim">
          <span>
            Step {step + 1} of {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="h-1.5 bg-brand-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 md:p-8 space-y-6">
        {/* STEP 0 — Common */}
        {step === 0 && (
          <>
            <h2 className="text-xl font-bold">기본 정보</h2>
            <Field label="성함 *">
              <input
                value={data.name}
                onChange={(e) => update({ name: e.target.value })}
                placeholder="홍길동 / John Doe"
              />
            </Field>
            <Field label="이메일 *">
              <input
                type="email"
                value={data.email}
                onChange={(e) => update({ email: e.target.value })}
                placeholder="you@example.com"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="현재 거주 국가 *">
                <select
                  value={data.country}
                  onChange={(e) => update({ country: e.target.value as any })}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.v} value={c.v}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="도시">
                <input
                  value={data.city || ""}
                  onChange={(e) => update({ city: e.target.value })}
                  placeholder="Seattle / Seoul / NYC"
                />
              </Field>
            </div>
            <Field label="LinkedIn URL (선택)">
              <input
                value={data.linkedin || ""}
                onChange={(e) => update({ linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </Field>
            <Field label="참여 역할 *">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "mentor", label: "Mentor — 북미 현직 직장인" },
                  { v: "mentee", label: "Mentee — 학생" },
                ].map((r) => (
                  <button
                    key={r.v}
                    type="button"
                    onClick={() => update({ role: r.v as any })}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium transition text-left ${
                      data.role === r.v
                        ? "bg-brand-primary text-brand-bg border-brand-primary"
                        : "bg-brand-surface2 text-brand-textDim border-brand-border hover:border-brand-primary/50"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="참여 프로그램">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { v: "students", label: "Mentorship for Students" },
                  { v: "professionals", label: "Career Strategy (Coming Soon)" },
                ].map((p) => (
                  <button
                    key={p.v}
                    type="button"
                    onClick={() => update({ program: p.v as any })}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-medium transition ${
                      data.program === p.v
                        ? "bg-brand-primary text-brand-bg border-brand-primary"
                        : "bg-brand-surface2 text-brand-textDim border-brand-border"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="사용 가능 언어 *">
              <div className="flex flex-wrap gap-2">
                {["한국어", "English", "기타"].map((l) => (
                  <Pill
                    key={l}
                    active={data.languages.includes(l)}
                    onClick={() => toggle("languages", l)}
                  >
                    {l}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="어떻게 알게 되셨나요?">
              <select
                value={data.source || ""}
                onChange={(e) => update({ source: e.target.value })}
              >
                <option value="">선택</option>
                <option>학교/동아리</option>
                <option>LinkedIn</option>
                <option>지인 추천</option>
                <option>커뮤니티 (Slack/Discord)</option>
                <option>이벤트/세미나</option>
                <option>기타</option>
              </select>
            </Field>
          </>
        )}

        {/* STEP 1 — Role-specific */}
        {step === 1 && isMentor && (
          <>
            <h2 className="text-xl font-bold">멘토 정보</h2>
            <p className="text-xs text-brand-textDim -mt-3">
              북미 현직 시니어 — 멘티에게 노출될 핵심 프로필을 작성해주세요.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Field label="현재 회사 *">
                <input
                  value={data.mentor_company || ""}
                  onChange={(e) => update({ mentor_company: e.target.value })}
                  placeholder="Google / Meta / Stripe ..."
                />
              </Field>
              <Field label="직무">
                <input
                  value={data.mentor_position || ""}
                  onChange={(e) => update({ mentor_position: e.target.value })}
                  placeholder="Senior SWE / PM / Designer"
                />
              </Field>
            </div>
            <Field label="경력 연차 *">
              <div className="flex flex-wrap gap-2">
                {MENTOR_SENIORITY.map((s) => (
                  <Pill
                    key={s.v}
                    active={data.mentor_seniority === s.v}
                    onClick={() => update({ mentor_seniority: s.v })}
                  >
                    {s.label}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="전문 산업군 (최대 3개) *">
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((i) => (
                  <Pill
                    key={i}
                    active={(data.mentor_industries || []).includes(i)}
                    onClick={() => toggle("mentor_industries", i)}
                  >
                    {i}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="전문 직무 영역 (최대 3개)">
              <div className="flex flex-wrap gap-2">
                {FUNCTIONS.map((f) => (
                  <Pill
                    key={f}
                    active={(data.mentor_functions || []).includes(f)}
                    onClick={() => toggle("mentor_functions", f)}
                  >
                    {f}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="다룰 수 있는 멘토링 주제">
              <div className="flex flex-wrap gap-2">
                {MENTOR_TOPICS.map((t) => (
                  <Pill
                    key={t}
                    active={(data.mentor_topics || []).includes(t)}
                    onClick={() => toggle("mentor_topics", t)}
                  >
                    {t}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="이전 회사들 (자유 입력)">
              <input
                value={data.mentor_companies_history || ""}
                onChange={(e) => update({ mentor_companies_history: e.target.value })}
                placeholder="Apple → Stripe → Google"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="북미 체류 연차">
                <select
                  value={data.mentor_years_in_na || ""}
                  onChange={(e) => update({ mentor_years_in_na: e.target.value })}
                >
                  <option value="">선택</option>
                  <option>1~3년</option>
                  <option>4~7년</option>
                  <option>8~15년</option>
                  <option>15년+</option>
                  <option>북미 출생/성장</option>
                </select>
              </Field>
              <Field label="한국 학력/배경">
                <select
                  value={data.mentor_korean_origin || ""}
                  onChange={(e) => update({ mentor_korean_origin: e.target.value })}
                >
                  <option value="">선택</option>
                  <option value="yes">한국 학부 졸업</option>
                  <option value="partial">한국 일부 (고등/석사 등)</option>
                  <option value="no">전부 북미</option>
                </select>
              </Field>
            </div>
            <Field label="선호 멘티 유형">
              <div className="flex flex-wrap gap-2">
                {[
                  "북미 학부생",
                  "북미 대학원생",
                  "한국 학부생",
                  "한국 대학원생",
                  "주니어 직장인",
                  "career switcher",
                ].map((t) => (
                  <Pill
                    key={t}
                    active={(data.mentor_target_mentees || []).includes(t)}
                    onClick={() => toggle("mentor_target_mentees", t)}
                  >
                    {t}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="월 멘토링 가능 시간">
              <select
                value={data.mentor_monthly_hours || ""}
                onChange={(e) => update({ mentor_monthly_hours: e.target.value })}
              >
                <option value="">선택</option>
                <option value="1-2">1~2시간</option>
                <option value="3-5">3~5시간</option>
                <option value="6-10">6~10시간</option>
                <option value="10+">10시간+</option>
              </select>
            </Field>
            <Field label="가능 시간대">
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
                  <Pill
                    key={t}
                    active={(data.mentor_timeslots || []).includes(t)}
                    onClick={() => toggle("mentor_timeslots", t)}
                  >
                    {t}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="자기소개 (멘티에게 노출)" hint="200자 이내">
              <textarea
                rows={3}
                value={data.mentor_bio || ""}
                onChange={(e) => update({ mentor_bio: e.target.value })}
                maxLength={200}
              />
            </Field>
          </>
        )}

        {step === 1 && isMentee && (
          <>
            <h2 className="text-xl font-bold">멘티 정보 — 학생</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="소속 학교 *">
                <input
                  value={data.mentee_school || ""}
                  onChange={(e) => update({ mentee_school: e.target.value })}
                  placeholder="UC Berkeley / 서울대 ..."
                />
              </Field>
              <Field label="학교 소재 국가">
                <select
                  value={data.mentee_school_country || ""}
                  onChange={(e) => update({ mentee_school_country: e.target.value as any })}
                >
                  <option value="">선택</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.v} value={c.v}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="전공 *">
                <input
                  value={data.mentee_major || ""}
                  onChange={(e) => update({ mentee_major: e.target.value })}
                  placeholder="CS / Business / Bio ..."
                />
              </Field>
              <Field label="졸업 예정 연도">
                <input
                  value={data.mentee_grad_year || ""}
                  onChange={(e) => update({ mentee_grad_year: e.target.value })}
                  placeholder="2027"
                />
              </Field>
            </div>
            <Field label="학위 과정">
              <div className="flex flex-wrap gap-2">
                {DEGREES.map((d) => (
                  <Pill
                    key={d}
                    active={data.mentee_degree === d}
                    onClick={() => update({ mentee_degree: d })}
                  >
                    {d}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="관심 산업군 *">
              <div className="flex flex-wrap gap-2">
                {INDUSTRIES.map((i) => (
                  <Pill
                    key={i}
                    active={(data.mentee_target_industries || []).includes(i)}
                    onClick={() => toggle("mentee_target_industries", i)}
                  >
                    {i}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="관심 직무">
              <div className="flex flex-wrap gap-2">
                {FUNCTIONS.map((f) => (
                  <Pill
                    key={f}
                    active={(data.mentee_target_functions || []).includes(f)}
                    onClick={() => toggle("mentee_target_functions", f)}
                  >
                    {f}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="타겟 마켓 (어디서 일하고 싶나요?) *">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "NA", l: "North America" },
                  { v: "KR", l: "Korea" },
                  { v: "EITHER", l: "둘 다 / 미정" },
                ].map((o) => (
                  <button
                    key={o.v}
                    type="button"
                    onClick={() => update({ mentee_target_market: o.v })}
                    className={`py-3 rounded-xl border text-sm font-medium transition ${
                      data.mentee_target_market === o.v
                        ? "bg-brand-primary text-brand-bg border-brand-primary"
                        : "bg-brand-surface2 text-brand-textDim border-brand-border"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="현재 커리어 단계">
              <select
                value={data.mentee_career_stage || ""}
                onChange={(e) => update({ mentee_career_stage: e.target.value })}
              >
                <option value="">선택</option>
                <option value="exploring">진로 탐색 중</option>
                <option value="decided">방향 정해졌고 준비 중</option>
                <option value="internship">인턴십 찾는 중</option>
                <option value="fulltime">풀타임 취업 준비 중</option>
                <option value="grad-school">대학원 진학 고민 중</option>
              </select>
            </Field>
            <Field label="가장 막히는 부분 (복수 선택)">
              <div className="flex flex-wrap gap-2">
                {MENTEE_PAIN_POINTS.map((p) => (
                  <Pill
                    key={p}
                    active={(data.mentee_pain_points || []).includes(p)}
                    onClick={() => toggle("mentee_pain_points", p)}
                  >
                    {p}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="멘토에게 기대하는 것" hint="500자 이내">
              <textarea
                rows={4}
                value={data.mentee_expectations || ""}
                onChange={(e) => update({ mentee_expectations: e.target.value })}
                maxLength={500}
              />
            </Field>
            <Field label="선호 멘토 연차">
              <select
                value={data.mentee_pref_seniority || ""}
                onChange={(e) => update({ mentee_pref_seniority: e.target.value })}
              >
                <option value="">선택</option>
                <option>비슷한 연차 (3~5년 위)</option>
                <option>중견 (6~12년)</option>
                <option>시니어/리더 (13년+)</option>
                <option>무관</option>
              </select>
            </Field>
            <Field label="가능 시간대">
              <div className="flex flex-wrap gap-2">
                {TIME_SLOTS.map((t) => (
                  <Pill
                    key={t}
                    active={(data.mentee_timeslots || []).includes(t)}
                    onClick={() => toggle("mentee_timeslots", t)}
                  >
                    {t}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="이력서 / 포트폴리오 URL (선택)">
              <input
                value={data.mentee_resume_url || ""}
                onChange={(e) => update({ mentee_resume_url: e.target.value })}
                placeholder="https://..."
              />
            </Field>
          </>
        )}

        {/* STEP 2 — Matching */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold">매칭 선호도</h2>
            <Field label="매칭 시 가장 중요한 요소" hint="복수 선택 가능">
              <div className="flex flex-wrap gap-2">
                {[
                  "산업 일치",
                  "직무 일치",
                  "타겟 마켓",
                  "멘토 회사 (FAANG 등)",
                  "멘토 시니어리티",
                  "한국 학력/배경",
                  "언어",
                  "시간대",
                  "성향",
                ].map((p) => (
                  <Pill
                    key={p}
                    active={(data.match_priority || []).includes(p)}
                    onClick={() => toggle("match_priority", p)}
                  >
                    {p}
                  </Pill>
                ))}
              </div>
            </Field>
            <Field label="선호 진행 형식">
              <select
                value={data.match_format_pref || ""}
                onChange={(e) => update({ match_format_pref: e.target.value })}
              >
                <option value="">선택</option>
                <option>정기 1:1 (격주/월 1회)</option>
                <option>단발성 자문</option>
                <option>프로젝트/취업 시즌 한정 집중</option>
                <option>이벤트·그룹 세션</option>
              </select>
            </Field>
            <Field label="후속 프로그램(이벤트/그룹세션) 참여 의향" hint="1: 전혀 아니다 ~ 5: 매우 그렇다">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update({ match_followup_interest: n })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${
                      data.match_followup_interest === n
                        ? "bg-brand-primary text-brand-bg border-brand-primary"
                        : "bg-brand-surface2 text-brand-textDim border-brand-border"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </Field>
          </>
        )}

        {/* STEP 3 — Wrap */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold">마무리</h2>
            <Field label="프로그램에 바라는 점 (자유)">
              <textarea
                rows={4}
                value={data.feedback || ""}
                onChange={(e) => update({ feedback: e.target.value })}
              />
            </Field>
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-brand-border bg-brand-surface2">
              <input
                type="checkbox"
                checked={data.consent}
                onChange={(e) => update({ consent: e.target.checked })}
                style={{ width: 18, height: 18, marginTop: 2 }}
              />
              <span className="text-sm text-brand-text leading-relaxed">
                <span className="font-semibold">결과 활용 동의</span> · 응답 내용을 매칭 알고리즘
                입력값 및 통계 분석 목적으로 활용하는 것에 동의합니다. (개인정보는 매칭 외 목적으로
                사용되지 않습니다)
              </span>
            </label>
          </>
        )}

        {error && (
          <div className="rounded-lg border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
            {error}
          </div>
        )}

        <div className="flex items-center justify-between pt-4">
          {step > 0 ? (
            <button type="button" onClick={prev} className="btn-ghost inline-flex items-center gap-2">
              <ArrowLeft size={14} /> 이전
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary inline-flex items-center gap-2">
              다음 <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="btn-primary inline-flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> 제출 중...
                </>
              ) : (
                <>
                  제출하기 <Check size={14} />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {!isSupabaseConfigured && (
        <div className="mt-4 text-xs text-brand-warn text-center">
          ⚠ Supabase 환경변수가 설정되지 않았습니다. 응답은 콘솔에만 기록됩니다.
        </div>
      )}
    </div>
  );
}
