"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  SurveyResponse,
  INDUSTRIES,
  FUNCTIONS,
  SENIORITY_MENTOR,
  STAGE_MENTEE,
} from "@/lib/types";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

const STEPS = ["기본 정보", "역할별 정보", "매칭 선호도", "마무리"] as const;

const empty: SurveyResponse = {
  name: "", email: "", country: "KR", role: "mentor",
  languages: [], consent: false,
  match_priority: [], match_format: [], match_followup_interest: 3,
  mentor_industries: [], mentor_functions: [], mentor_formats: [], mentor_timeslots: [], mentor_target_stages: [],
  mentee_industries: [], mentee_help_needs: [], mentee_timeslots: [],
};

const Pill = ({ active, onClick, children }: any) => (
  <button type="button" onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
      active ? "bg-brand-primary text-brand-bg border-brand-primary"
             : "bg-transparent text-brand-textDim border-brand-border hover:border-brand-primary/50"
    }`}>
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
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SurveyResponse>(empty);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (patch: Partial<SurveyResponse>) => setData(d => ({ ...d, ...patch }));
  const toggle = (key: keyof SurveyResponse, value: string) => {
    const arr = (data[key] as string[]) || [];
    update({ [key]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] } as any);
  };

  const validateStep = (): string | null => {
    if (step === 0) {
      if (!data.name.trim()) return "성함을 입력해주세요";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "올바른 이메일을 입력해주세요";
      if (!data.languages.length) return "사용 가능한 언어를 1개 이상 선택해주세요";
    }
    if (step === 1) {
      if (data.role === "mentor" || data.role === "both") {
        if (!data.mentor_seniority) return "멘토 경력 연차를 선택해주세요";
        if (!(data.mentor_industries || []).length) return "전문 산업군을 1개 이상 선택해주세요";
      }
      if (data.role === "mentee" || data.role === "both") {
        if (!data.mentee_stage) return "현재 단계를 선택해주세요";
        if (!(data.mentee_industries || []).length) return "관심 산업군을 1개 이상 선택해주세요";
      }
    }
    if (step === 3) {
      if (!data.consent) return "결과 활용에 동의해주세요";
    }
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = () => { setError(null); setStep(s => Math.max(s - 1, 0)); };

  const submit = async () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setSubmitting(true); setError(null);
    try {
      if (!isSupabaseConfigured) {
        // Dev fallback: log to console
        console.log("[DEV] Survey response:", data);
        await new Promise(r => setTimeout(r, 800));
        setDone(true);
        return;
      }
      const { error } = await supabase.from("survey_responses").insert([{
        ...data,
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setDone(true);
    } catch (e: any) {
      setError(e.message || "제출 중 오류가 발생했습니다");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <Check className="text-brand-primary" size={28} />
        </div>
        <h2 className="text-2xl font-bold mb-3">제출이 완료되었습니다</h2>
        <p className="text-brand-textDim mb-8">
          매칭 결과는 2주 이내에 <span className="text-brand-text">{data.email}</span>로 안내드립니다.
        </p>
        <a href="/" className="btn-ghost">홈으로 돌아가기</a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 pb-20">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2 text-xs text-brand-textDim">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="h-1.5 bg-brand-surface rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all"
               style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      </div>

      <div className="rounded-2xl bg-brand-surface border border-brand-border p-6 md:p-8 space-y-6">
        {/* STEP 0: Common */}
        {step === 0 && (
          <>
            <h2 className="text-xl font-bold">기본 정보</h2>
            <Field label="성함 *">
              <input value={data.name} onChange={e => update({ name: e.target.value })} placeholder="홍길동 / John Doe" />
            </Field>
            <Field label="이메일 *">
              <input type="email" value={data.email} onChange={e => update({ email: e.target.value })} placeholder="you@example.com" />
            </Field>
            <Field label="휴대전화 (선택)">
              <input value={data.phone || ""} onChange={e => update({ phone: e.target.value })} placeholder="+82 10-..." />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="거주 국가 *">
                <select value={data.country} onChange={e => update({ country: e.target.value as any })}>
                  <option value="KR">대한민국</option>
                  <option value="PK">파키스탄</option>
                  <option value="OTHER">기타</option>
                </select>
              </Field>
              <Field label="도시">
                <input value={data.city || ""} onChange={e => update({ city: e.target.value })} placeholder="Seoul / Karachi" />
              </Field>
            </div>
            <Field label="소속 기관 (회사·대학·기관)">
              <input value={data.affiliation || ""} onChange={e => update({ affiliation: e.target.value })} />
            </Field>
            <Field label="참여 역할 *">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { v: "mentor", label: "멘토" },
                  { v: "mentee", label: "멘티" },
                  { v: "both", label: "양방향" },
                ].map(r => (
                  <button key={r.v} type="button" onClick={() => update({ role: r.v as any })}
                    className={`py-3 rounded-xl border text-sm font-medium transition ${
                      data.role === r.v
                        ? "bg-brand-primary text-brand-bg border-brand-primary"
                        : "bg-brand-surface2 text-brand-textDim border-brand-border hover:border-brand-primary/50"
                    }`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="사용 가능 언어 *">
              <div className="flex flex-wrap gap-2">
                {["한국어", "English", "Urdu", "기타"].map(l => (
                  <Pill key={l} active={data.languages.includes(l)} onClick={() => toggle("languages", l)}>{l}</Pill>
                ))}
              </div>
            </Field>
          </>
        )}

        {/* STEP 1: Role-specific */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-bold">{data.role === "mentor" ? "멘토 정보" : data.role === "mentee" ? "멘티 정보" : "멘토 + 멘티 정보"}</h2>

            {(data.role === "mentor" || data.role === "both") && (
              <div className="space-y-5">
                <div className="text-xs uppercase tracking-wider text-brand-primary font-semibold">멘토 프로필</div>
                <Field label="현재 직무">
                  <input value={data.mentor_position || ""} onChange={e => update({ mentor_position: e.target.value })} placeholder="예: CTO, PM, Investor" />
                </Field>
                <Field label="총 경력 연차 *">
                  <div className="flex flex-wrap gap-2">
                    {SENIORITY_MENTOR.map(s => (
                      <Pill key={s.v} active={data.mentor_seniority === s.v} onClick={() => update({ mentor_seniority: s.v })}>{s.label}</Pill>
                    ))}
                  </div>
                </Field>
                <Field label="전문 산업군 (최대 3개) *">
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(i => (
                      <Pill key={i} active={(data.mentor_industries || []).includes(i)} onClick={() => toggle("mentor_industries", i)}>{i}</Pill>
                    ))}
                  </div>
                </Field>
                <Field label="전문 직무 영역 (최대 3개)">
                  <div className="flex flex-wrap gap-2">
                    {FUNCTIONS.map(f => (
                      <Pill key={f} active={(data.mentor_functions || []).includes(f)} onClick={() => toggle("mentor_functions", f)}>{f}</Pill>
                    ))}
                  </div>
                </Field>
                <Field label="월 멘토링 가능 시간">
                  <select value={data.mentor_monthly_hours || ""} onChange={e => update({ mentor_monthly_hours: e.target.value })}>
                    <option value="">선택</option>
                    <option value="1-2">1~2시간</option>
                    <option value="3-5">3~5시간</option>
                    <option value="6-10">6~10시간</option>
                    <option value="10+">10시간+</option>
                  </select>
                </Field>
                <Field label="가능 시간대 (KST)">
                  <div className="flex flex-wrap gap-2">
                    {["평일 오전", "평일 점심", "평일 저녁", "주말"].map(t => (
                      <Pill key={t} active={(data.mentor_timeslots || []).includes(t)} onClick={() => toggle("mentor_timeslots", t)}>{t}</Pill>
                    ))}
                  </div>
                </Field>
                <Field label="자기소개 한 줄 (멘티에게 노출)" hint="200자 이내">
                  <textarea rows={3} value={data.mentor_bio || ""} onChange={e => update({ mentor_bio: e.target.value })} maxLength={200} />
                </Field>
                <Field label="LinkedIn / 포트폴리오 URL">
                  <input value={data.mentor_linkedin || ""} onChange={e => update({ mentor_linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
                </Field>
              </div>
            )}

            {(data.role === "mentee" || data.role === "both") && (
              <div className="space-y-5 pt-4 border-t border-brand-border">
                <div className="text-xs uppercase tracking-wider text-brand-warn font-semibold">멘티 프로필</div>
                <Field label="현재 소속 유형">
                  <select value={data.mentee_affiliation_type || ""} onChange={e => update({ mentee_affiliation_type: e.target.value })}>
                    <option value="">선택</option>
                    <option>예비창업자</option>
                    <option>스타트업 (Founder)</option>
                    <option>스타트업 (직원)</option>
                    <option>학생</option>
                    <option>기업 재직자</option>
                    <option>프리랜서</option>
                  </select>
                </Field>
                <Field label="관심 산업군 *">
                  <div className="flex flex-wrap gap-2">
                    {INDUSTRIES.map(i => (
                      <Pill key={i} active={(data.mentee_industries || []).includes(i)} onClick={() => toggle("mentee_industries", i)}>{i}</Pill>
                    ))}
                  </div>
                </Field>
                <Field label="현재 단계 *">
                  <div className="flex flex-wrap gap-2">
                    {STAGE_MENTEE.map(s => (
                      <Pill key={s.v} active={data.mentee_stage === s.v} onClick={() => update({ mentee_stage: s.v })}>{s.label}</Pill>
                    ))}
                  </div>
                </Field>
                <Field label="가장 도움이 필요한 영역">
                  <div className="flex flex-wrap gap-2">
                    {["기술", "프로덕트", "마케팅", "BD/세일즈", "투자유치", "글로벌진출", "법무·규제", "조직·HR"].map(n => (
                      <Pill key={n} active={(data.mentee_help_needs || []).includes(n)} onClick={() => toggle("mentee_help_needs", n)}>{n}</Pill>
                    ))}
                  </div>
                </Field>
                <Field label="멘토에게 기대하는 것" hint="500자 이내">
                  <textarea rows={4} value={data.mentee_expectations || ""} onChange={e => update({ mentee_expectations: e.target.value })} maxLength={500} />
                </Field>
                <Field label="한-파 진출 관심도">
                  <select value={data.mentee_cross_border || ""} onChange={e => update({ mentee_cross_border: e.target.value })}>
                    <option value="">선택</option>
                    <option value="kr_to_pk">한국→파키스탄 진출</option>
                    <option value="pk_to_kr">파키스탄→한국 진출</option>
                    <option value="bidirectional">양방향</option>
                    <option value="none">해당 없음</option>
                  </select>
                </Field>
                <Field label="가능 시간대 (KST)">
                  <div className="flex flex-wrap gap-2">
                    {["평일 오전", "평일 점심", "평일 저녁", "주말"].map(t => (
                      <Pill key={t} active={(data.mentee_timeslots || []).includes(t)} onClick={() => toggle("mentee_timeslots", t)}>{t}</Pill>
                    ))}
                  </div>
                </Field>
                <Field label="회사/프로젝트 소개 (선택)">
                  <input value={data.mentee_company_intro || ""} onChange={e => update({ mentee_company_intro: e.target.value })} />
                </Field>
              </div>
            )}
          </>
        )}

        {/* STEP 2: Matching prefs */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold">매칭 선호도</h2>
            <Field label="매칭 시 가장 중요한 요소" hint="복수 선택 가능 (가중치에 반영됩니다)">
              <div className="flex flex-wrap gap-2">
                {["산업 일치", "직무 일치", "언어", "시간대", "멘토 연차", "한-파 경험", "성향"].map(p => (
                  <Pill key={p} active={(data.match_priority || []).includes(p)} onClick={() => toggle("match_priority", p)}>{p}</Pill>
                ))}
              </div>
            </Field>
            <Field label="같은 국가 매칭 선호?">
              <select value={data.match_same_country || ""} onChange={e => update({ match_same_country: e.target.value })}>
                <option value="">선택</option>
                <option value="yes">같은 국가 선호</option>
                <option value="no">크로스보더 선호</option>
                <option value="any">무관</option>
              </select>
            </Field>
            <Field label="매칭 후 진행 형식">
              <div className="flex flex-wrap gap-2">
                {["정기 (격주/월 1회)", "단발성 자문", "프로젝트 기간 한정"].map(f => (
                  <Pill key={f} active={(data.match_format || []).includes(f)} onClick={() => toggle("match_format", f)}>{f}</Pill>
                ))}
              </div>
            </Field>
            <Field label="후속 프로그램(데모데이 등) 참여 의향" hint="1: 전혀 아니다 ~ 5: 매우 그렇다">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => update({ match_followup_interest: n })}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition ${
                      data.match_followup_interest === n
                        ? "bg-brand-primary text-brand-bg border-brand-primary"
                        : "bg-brand-surface2 text-brand-textDim border-brand-border"
                    }`}>{n}</button>
                ))}
              </div>
            </Field>
          </>
        )}

        {/* STEP 3: Wrap */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold">마무리</h2>
            <Field label="프로그램에 바라는 점 (자유)">
              <textarea rows={4} value={data.feedback || ""} onChange={e => update({ feedback: e.target.value })} />
            </Field>
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border border-brand-border bg-brand-surface2">
              <input type="checkbox" checked={data.consent} onChange={e => update({ consent: e.target.checked })}
                style={{ width: 18, height: 18, marginTop: 2 }} />
              <span className="text-sm text-brand-text leading-relaxed">
                <span className="font-semibold">결과 활용 동의</span> · 응답 내용을 매칭 알고리즘 입력값 및 통계 분석 목적으로 활용하는 것에 동의합니다. (개인정보는 매칭 외 목적으로 사용되지 않습니다)
              </span>
            </label>
          </>
        )}

        {error && (
          <div className="rounded-lg border border-brand-danger/40 bg-brand-danger/10 px-4 py-3 text-sm text-brand-danger">
            {error}
          </div>
        )}

        {/* Nav */}
        <div className="flex items-center justify-between pt-4">
          {step > 0 ? (
            <button type="button" onClick={prev} className="btn-ghost inline-flex items-center gap-2">
              <ArrowLeft size={14} /> 이전
            </button>
          ) : <span />}
          {step < STEPS.length - 1 ? (
            <button type="button" onClick={next} className="btn-primary inline-flex items-center gap-2">
              다음 <ArrowRight size={14} />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="btn-primary inline-flex items-center gap-2">
              {submitting ? <><Loader2 size={14} className="animate-spin" /> 제출 중...</> : <>제출하기 <Check size={14} /></>}
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
