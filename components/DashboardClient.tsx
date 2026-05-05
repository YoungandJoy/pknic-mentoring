"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SurveyResponse } from "@/lib/types";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LineChart, Line, Area, AreaChart,
} from "recharts";
import {
  Users, Target, Filter, Sparkles, Briefcase, Clock, RefreshCw, Lock,
  GraduationCap, AlertTriangle, TrendingUp, AlertCircle, Mail, Flame, CheckCircle2,
} from "lucide-react";

const BRAND = {
  bg: "#0A0F1C", surface: "#111827", surface2: "#1F2937",
  border: "#1E3A2F", primary: "#10B981", primaryDim: "#059669",
  accent: "#34D399", warn: "#F59E0B", danger: "#EF4444",
  text: "#E5E7EB", textDim: "#9CA3AF", blue: "#3B82F6", purple: "#A78BFA",
};
const PALETTE = ["#10B981","#34D399","#3B82F6","#A78BFA","#F59E0B","#EF4444","#FBBF24","#6EE7B7","#059669"];

const SEG_COLOR: Record<string, string> = {
  na_mentor: BRAND.primary,
  na_student: BRAND.blue,
  kr_student: BRAND.warn,
  na_mentee_pro: BRAND.accent,
  kr_mentee_pro: BRAND.purple,
  other: BRAND.textDim,
};
const SEG_LABEL: Record<string, string> = {
  na_mentor: "NA 멘토",
  na_student: "NA 학생",
  kr_student: "KR 학생",
  na_mentee_pro: "NA 직장 멘티",
  kr_mentee_pro: "KR 직장 멘티",
  other: "기타",
};

// ── Mock data ──
const MOCK: SurveyResponse[] = (() => {
  const out: SurveyResponse[] = [];
  const mentorCompanies = ["Google","Meta","Amazon","Apple","Microsoft","Stripe","Netflix","Airbnb","Snowflake","Databricks"];
  const naSchools = ["UC Berkeley","Stanford","MIT","CMU","Univ. of Toronto","Univ. of Washington","UCLA","Cornell"];
  const krSchools = ["서울대","KAIST","연세대","고려대","성균관대","한양대"];
  const majors = ["Computer Science","Business","Electrical Engineering","Economics","Bioengineering","Statistics","Design"];
  const proCompanies = ["Coupang","Naver","Kakao","Goldman Sachs","McKinsey","Robinhood","Toss","Bytedance"];
  const inds = ["Tech / Software","Finance / IB","AI / ML","Product / SaaS","Consulting","Healthcare / Biotech","Consumer / Retail"];
  for (let i = 0; i < 12; i++) {
    out.push({
      name: `Mentor ${i+1}`, email: `m${i}@x.com`,
      country: i % 4 === 0 ? "CA" : "US", role: "mentor", program: "students", consent: true,
      languages: ["한국어","English"],
      mentor_company: mentorCompanies[i % mentorCompanies.length],
      mentor_seniority: ["4-7y","8-12y","13-18y","18y+"][i % 4],
      mentor_industries: [inds[i % inds.length]],
      mentor_functions: [["Software Engineering","Product Management","Design / UX","Data / Analytics"][i % 4]],
      mentor_korean_origin: ["kr_native","kr_grad_then_na","1_5_gen","2nd_gen"][i % 4],
      mentor_monthly_hours: ["3-5","6-10","1-2"][i % 3],
      created_at: new Date(Date.now() - (15 - i) * 86400000).toISOString(),
    } as SurveyResponse);
  }
  for (let i = 0; i < 14; i++) {
    const isKR = i % 2 === 0;
    out.push({
      name: `Student ${i+1}`, email: `s${i}@x.com`,
      country: isKR ? "KR" : "US", role: "mentee", mentee_type: "student", program: "students", consent: true,
      languages: isKR ? ["한국어","English"] : ["English","한국어"],
      mentee_school: isKR ? krSchools[i % krSchools.length] : naSchools[i % naSchools.length],
      mentee_school_country: isKR ? "KR" : "US",
      mentee_major: majors[i % majors.length],
      mentee_grad_year: ["2025","2026","2027","2028"][i % 4],
      mentee_target_industries: [inds[i % inds.length]],
      mentee_target_market: ["NA","KR","EITHER"][i % 3],
      mentee_career_stage: ["exploring","internship","fulltime","decided"][i % 4],
      visa_status: isKR ? "kr_resident" : ["f1","opt","us_citizen_pr"][i % 3],
      created_at: new Date(Date.now() - (14 - i) * 86400000).toISOString(),
    } as SurveyResponse);
  }
  for (let i = 0; i < 6; i++) {
    out.push({
      name: `Pro ${i+1}`, email: `p${i}@x.com`,
      country: i % 2 === 0 ? "US" : "KR", role: "mentee", mentee_type: "professional", program: "students", consent: true,
      languages: ["한국어","English"],
      mentee_pro_company: proCompanies[i % proCompanies.length],
      mentee_pro_position: ["SWE","PM","Analyst","Designer"][i % 4],
      mentee_pro_seniority: ["1-3y","4-7y","0-1y"][i % 3],
      mentee_pro_focus: ["이직 (북미 내)","승진 / 리더십 전환","이직 (한국 ↔ 북미)"][i % 3],
      mentee_target_industries: [inds[i % inds.length]],
      mentee_target_market: ["NA","KR","EITHER"][i % 3],
      visa_status: i % 2 === 0 ? "h1b" : "kr_resident",
      created_at: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
    } as SurveyResponse);
  }
  return out;
})();

const segmentOf = (r: SurveyResponse): string => {
  if (r.role === "mentor") return r.country === "US" || r.country === "CA" ? "na_mentor" : "other";
  if (r.mentee_type === "professional") return r.country === "KR" ? "kr_mentee_pro" : "na_mentee_pro";
  const sc = r.mentee_school_country || r.country;
  if (sc === "KR") return "kr_student";
  if (sc === "US" || sc === "CA") return "na_student";
  return "other";
};

export default function DashboardClient() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [pwInput, setPwInput] = useState("");
  const dashboardPw = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "";

  useEffect(() => { if (!dashboardPw) setAuthed(true); }, [dashboardPw]);

  const [rows, setRows] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [usedMock, setUsedMock] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) { setRows(MOCK); setUsedMock(true); setLoading(false); return; }
    const { data, error } = await supabase
      .from("survey_responses").select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) { setRows(MOCK); setUsedMock(true); }
    else { setRows(data as any); setUsedMock(false); }
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchData(); }, [authed]);

  // ── Filters ──
  const [roleFilter, setRoleFilter] = useState("all");
  const [segmentFilter, setSegmentFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => rows.filter((r) =>
    (roleFilter === "all" || r.role === roleFilter) &&
    (segmentFilter === "all" || segmentOf(r) === segmentFilter) &&
    (search === "" || JSON.stringify(r).toLowerCase().includes(search.toLowerCase()))
  ), [rows, roleFilter, segmentFilter, search]);

  const total = filtered.length;
  const mentors = filtered.filter((r) => r.role === "mentor").length;
  const mentees = filtered.filter((r) => r.role === "mentee").length;
  const menteeStudents = filtered.filter((r) => r.role === "mentee" && r.mentee_type !== "professional").length;
  const menteePros = filtered.filter((r) => r.role === "mentee" && r.mentee_type === "professional").length;
  const ratio = mentees > 0 ? (mentors / mentees).toFixed(2) : "—";

  // ── Segment ──
  const segmentAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach((r) => { const s = segmentOf(r); m[s] = (m[s] || 0) + 1; });
    return Object.entries(m)
      .filter(([k]) => k !== "other" || m[k] > 0)
      .map(([k, v]) => ({ key: k, name: SEG_LABEL[k] || k, value: v }));
  }, [filtered]);

  // ── Industry supply/demand ──
  const supplyDemand = useMemo(() => {
    const m: Record<string, { name: string; mentor: number; mentee: number }> = {};
    filtered.forEach((r) => {
      (r.mentor_industries || []).forEach((ind) => {
        if (!m[ind]) m[ind] = { name: ind, mentor: 0, mentee: 0 };
        m[ind].mentor += 1;
      });
      (r.mentee_target_industries || []).forEach((ind) => {
        if (!m[ind]) m[ind] = { name: ind, mentor: 0, mentee: 0 };
        m[ind].mentee += 1;
      });
    });
    return Object.values(m)
      .map((d) => ({ ...d, gap: d.mentee - d.mentor }))
      .sort((a, b) => b.gap - a.gap);
  }, [filtered]);

  const top3UndersuppliedIndustries = useMemo(
    () => supplyDemand.filter((d) => d.gap > 0).slice(0, 3),
    [supplyDemand]
  );

  // ── Time series (response 추이) ──
  const timeSeries = useMemo(() => {
    const m: Record<string, { date: string; total: number; mentor: number; mentee: number }> = {};
    filtered.forEach((r) => {
      const d = (r.created_at || "").slice(0, 10);
      if (!d) return;
      if (!m[d]) m[d] = { date: d, total: 0, mentor: 0, mentee: 0 };
      m[d].total += 1;
      if (r.role === "mentor") m[d].mentor += 1; else m[d].mentee += 1;
    });
    return Object.values(m).sort((a, b) => a.date.localeCompare(b.date));
  }, [filtered]);

  // ── Mentor company / Mentee school top ──
  const mentorCompanyAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.filter((r) => r.role === "mentor").forEach((r) => {
      const c = (r.mentor_company || "").trim();
      if (c) m[c] = (m[c] || 0) + 1;
    });
    return Object.entries(m).map(([n, v]) => ({ name: n, value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered]);

  const schoolAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.filter((r) => r.role === "mentee" && r.mentee_school).forEach((r) => {
      const s = (r.mentee_school || "").trim();
      if (s) m[s] = (m[s] || 0) + 1;
    });
    return Object.entries(m).map(([n, v]) => ({ name: n, value: v }))
      .sort((a, b) => b.value - a.value).slice(0, 8);
  }, [filtered]);

  // ── 직장인 멘티 멘토링 니즈 Top ──
  const proNeedsAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered
      .filter((r) => r.role === "mentee" && r.mentee_type === "professional")
      .forEach((r) => {
        (r.mentee_pro_needs || []).forEach((n) => {
          m[n] = (m[n] || 0) + 1;
        });
      });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filtered]);

  // ── 직장인 멘티 경력 단계 분포 ──
  const proCareerStageAgg = useMemo(() => {
    const m: Record<string, number> = {};
    const labels: Record<string, string> = {
      junior: "🌱 주니어",
      senior: "🚀 시니어 IC",
      lead_manager: "👥 팀장·매니저",
      career_switcher: "🔄 커리어 전환",
    };
    filtered
      .filter((r) => r.role === "mentee" && r.mentee_type === "professional" && r.mentee_pro_career_stage)
      .forEach((r) => {
        const k = labels[r.mentee_pro_career_stage as string] || (r.mentee_pro_career_stage as string);
        m[k] = (m[k] || 0) + 1;
      });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  // ── 한국 학력/배경 분포 (멘토 + 멘티 모두) ──
  const koreanOriginAgg = useMemo(() => {
    const m: Record<string, number> = {};
    const labels: Record<string, string> = {
      kr_native: "한국 출생·성장 (1세대)",
      kr_grad_then_na: "한국 학부 → 북미",
      kr_to_na_undergrad: "한국 K-12 → 북미 학부",
      "1_5_gen": "1.5세",
      "2nd_gen": "북미 2세 이상",
      na_to_kr: "북미 → 한국 대학·경력",
      mixed: "혼합·제3국",
      non_korean: "한국 배경 없음",
    };
    filtered.forEach((r) => {
      const k = r.role === "mentor" ? r.mentor_korean_origin : r.mentee_korean_origin;
      if (k) {
        const label = labels[k] || k;
        m[label] = (m[label] || 0) + 1;
      }
    });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [filtered]);

  // ── Visa status ──
  const visaAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.filter((r) => r.visa_status).forEach((r) => {
      m[r.visa_status as string] = (m[r.visa_status as string] || 0) + 1;
    });
    const labels: Record<string, string> = {
      us_citizen_pr: "🇺🇸 시민/PR", ca_citizen_pr: "🇨🇦 시민/PR",
      f1: "F-1", opt: "OPT", h1b: "H-1B",
      kr_resident: "한국 거주", other_visa: "기타", no_answer: "응답 안 함",
    };
    return Object.entries(m).map(([k, v]) => ({ name: labels[k] || k, value: v }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

  // ── Urgency ──
  const urgentCount = useMemo(
    () => filtered.filter((r) => r.urgency === "asap").length,
    [filtered]
  );

  // ── Match score ──
  const matchScore = useMemo(() => {
    if (!total) return 0;
    const balance = mentees && mentors ? Math.min(mentors, mentees) / Math.max(mentors, mentees) : 0;
    const diversity = Math.min(supplyDemand.length / 8, 1);
    const urgentResolved = total > 0 ? 1 - urgentCount / total : 1;
    return Math.round((balance * 0.45 + diversity * 0.35 + urgentResolved * 0.20) * 100);
  }, [total, mentors, mentees, supplyDemand.length, urgentCount]);

  // ── Auto insights (action-oriented) ──
  const actions = useMemo(() => {
    const out: { tone: "danger" | "warn" | "info" | "good"; text: string; sub?: string }[] = [];
    if (mentees > mentors * 1.5) {
      out.push({
        tone: "danger",
        text: `🚨 멘티가 멘토보다 약 ${(mentees / Math.max(mentors,1)).toFixed(1)}배 많음`,
        sub: "직장인 멘토 추가 모집 권장",
      });
    } else if (mentors > mentees * 1.5) {
      out.push({
        tone: "info",
        text: `멘토 풀 충분 (${mentors}명) — 1:N 그룹 멘토링 검토 가능`,
      });
    } else {
      out.push({
        tone: "good",
        text: `✅ 멘토:멘티 비율 균형 (${ratio} : 1)`,
      });
    }
    if (top3UndersuppliedIndustries.length) {
      const t = top3UndersuppliedIndustries[0];
      out.push({
        tone: "warn",
        text: `${t.name} 멘토 ${t.gap}명 부족`,
        sub: `이 산업 시니어를 우선 모집해주세요`,
      });
    }
    if (urgentCount > 0) {
      out.push({
        tone: "warn",
        text: `🔥 즉시 매칭 희망자 ${urgentCount}명`,
        sub: "1주 내 매칭 안내 권장",
      });
    }
    const krWantingNA = filtered.filter(
      (r) => r.role === "mentee" && r.mentee_target_market === "NA" && r.country === "KR"
    ).length;
    if (krWantingNA >= 2) {
      out.push({
        tone: "info",
        text: `한국→북미 진출 희망 멘티 ${krWantingNA}명`,
        sub: "비자/글로벌 트랙 멘토 매칭 우선",
      });
    }
    return out;
  }, [mentees, mentors, ratio, top3UndersuppliedIndustries, urgentCount, filtered]);

  // ────────────────── UI ──────────────────
  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-primary/20 flex items-center justify-center">
            <Lock className="text-brand-primary" size={20} />
          </div>
          <h2 className="text-lg font-bold mb-2">대시보드 접근</h2>
          <p className="text-sm text-brand-textDim mb-5">관리자 비밀번호를 입력해주세요</p>
          <input type="password" value={pwInput} onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") setAuthed(pwInput === dashboardPw); }}
            placeholder="••••••••" className="mb-3" />
          <button className="btn-primary w-full" onClick={() => setAuthed(pwInput === dashboardPw)}>접속</button>
          {pwInput && pwInput !== dashboardPw && (
            <p className="text-xs text-brand-danger mt-3">비밀번호가 일치하지 않습니다</p>
          )}
        </div>
      </div>
    );
  }

  const Tip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg px-3 py-2 border text-xs"
        style={{ background: BRAND.surface2, borderColor: BRAND.border, color: BRAND.text }}>
        {label && <div className="font-semibold mb-1">{label}</div>}
        {payload.map((p: any, i: number) => (
          <div key={i} style={{ color: p.color || BRAND.text }}>
            {p.name}: <span className="font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      {/* ── 상단 status & filters ── */}
      <div className="flex items-center justify-between mb-4 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-3 text-brand-textDim">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            {usedMock ? "Mock data (응답 시 실제 데이터로 자동 전환)" : `Live · ${total} responses`}
          </span>
          {loading && <span>· loading...</span>}
        </div>
        <button onClick={fetchData} className="btn-ghost text-xs inline-flex items-center gap-1.5 py-1.5 px-3">
          <RefreshCw size={12} /> 새로고침
        </button>
      </div>

      {/* ── ⭐ HERO: 운영자 액션 카드 ⭐ ── */}
      <div className="rounded-2xl border-2 border-brand-primary/30 bg-gradient-to-br from-brand-primary/10 to-transparent p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-brand-accent" />
          <h2 className="text-base font-bold">오늘 운영자가 챙길 것</h2>
          <span className="text-[11px] text-brand-textDim">— 응답 풀에서 자동 도출된 액션 시그널</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {actions.map((a, i) => {
            const color = a.tone === "danger" ? BRAND.danger : a.tone === "warn" ? BRAND.warn : a.tone === "good" ? BRAND.accent : BRAND.blue;
            const Icon = a.tone === "danger" ? AlertTriangle : a.tone === "warn" ? AlertCircle : a.tone === "good" ? CheckCircle2 : TrendingUp;
            return (
              <div key={i} className="rounded-xl border p-4 flex gap-3"
                style={{ background: `${color}11`, borderColor: `${color}55` }}>
                <Icon size={18} style={{ color, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div className="text-sm font-semibold text-brand-text">{a.text}</div>
                  {a.sub && <div className="text-xs text-brand-textDim mt-0.5">{a.sub}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── KPI ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-5">
        <Kpi icon={Users} label="총 응답" value={total} sub={`멘토 ${mentors} / 멘티 ${mentees}`} />
        <Kpi icon={Briefcase} label="NA 멘토" value={mentors} sub={`멘티 대비 ${ratio}배`} accent={BRAND.primary} />
        <Kpi icon={GraduationCap} label="학생 멘티" value={menteeStudents} sub="NA + KR" accent={BRAND.blue} />
        <Kpi icon={Briefcase} label="직장 멘티" value={menteePros} sub="이직·승진 등" accent={BRAND.accent} />
        <Kpi icon={Flame} label="🔥 즉시 매칭" value={urgentCount} sub="urgency = asap" accent={BRAND.danger} />
      </div>

      {/* ── Filter bar ── */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-3 mb-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-brand-textDim pl-2">
          <Filter size={13} /> 필터
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-brand-textDim mr-1">역할</span>
          {[
            { v: "all", l: "전체" },
            { v: "mentor", l: "멘토" },
            { v: "mentee", l: "멘티" },
          ].map((o) => (
            <button key={o.v} onClick={() => setRoleFilter(o.v)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${
                roleFilter === o.v
                  ? "bg-brand-primary text-brand-bg border-brand-primary"
                  : "text-brand-textDim border-brand-border"
              }`}>{o.l}</button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-brand-textDim mr-1">세그먼트</span>
          {[
            { v: "all", l: "전체" },
            { v: "na_mentor", l: "NA 멘토" },
            { v: "na_student", l: "NA 학생" },
            { v: "kr_student", l: "KR 학생" },
            { v: "na_mentee_pro", l: "NA 직장 멘티" },
            { v: "kr_mentee_pro", l: "KR 직장 멘티" },
          ].map((o) => (
            <button key={o.v} onClick={() => setSegmentFilter(o.v)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${
                segmentFilter === o.v
                  ? "bg-brand-primary text-brand-bg border-brand-primary"
                  : "text-brand-textDim border-brand-border"
              }`}>{o.l}</button>
          ))}
        </div>
        <div className="flex-1 min-w-[180px]">
          <input
            type="text" placeholder="검색 (이름·회사·학교·산업...)"
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="text-xs"
            style={{ padding: "0.5rem 0.875rem" }}
          />
        </div>
      </div>

      {/* ── Row 1: 시계열 + 매칭 적합도 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="응답 추이" subtitle="일별 누적 응답" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeSeries} margin={{ top: 10, right: 16, bottom: 0 }}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={BRAND.primary} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={BRAND.primary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis dataKey="date" stroke={BRAND.textDim} fontSize={10} />
              <YAxis stroke={BRAND.textDim} fontSize={10} />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="total" name="응답 수" stroke={BRAND.primary} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card title="매칭 적합도" subtitle="균형·다양성·시급도 가중평균">
          <div className="flex items-center justify-center h-[220px]">
            <div className="text-center">
              <div className="text-6xl font-extrabold" style={{ color: matchScore >= 70 ? BRAND.primary : matchScore >= 50 ? BRAND.warn : BRAND.danger }}>
                {matchScore}
              </div>
              <div className="text-sm text-brand-textDim mt-2">/ 100점</div>
              <div className="mt-4 text-[11px] text-brand-textDim space-y-1">
                <div>균형 가중치 45% · 다양성 35% · 시급도 20%</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Row 2: 산업 갭 + 세그먼트 ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card
          title="산업별 수요-공급 갭"
          subtitle="갭 양수(주황) = 멘토 부족 → 추가 모집 필요"
          className="lg:col-span-2"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supplyDemand} layout="vertical" margin={{ left: 70, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis type="number" stroke={BRAND.textDim} fontSize={11} />
              <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={10} width={120} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 11 }} />
              <Bar dataKey="mentor" name="멘토 (공급)" fill={BRAND.primary} radius={[0,4,4,0]} />
              <Bar dataKey="mentee" name="멘티 (수요)" fill={BRAND.warn} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="세그먼트 분포" subtitle="NA 멘토/학생 + KR 학생 + 직장 멘티">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={segmentAgg} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={2}>
                {segmentAgg.map((d, i) => (
                  <Cell key={i} fill={SEG_COLOR[d.key] || PALETTE[i % PALETTE.length]} stroke={BRAND.bg} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Row 3: Mentor 회사, Mentee 학교, Visa ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="멘토 회사 Top" subtitle="현직 회사 분포">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={mentorCompanyAgg} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis type="number" stroke={BRAND.textDim} fontSize={10} />
              <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={10} width={100} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Bar dataKey="value" fill={BRAND.primary} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="학생 멘티 학교 Top" subtitle="응답자 학교 분포">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={schoolAgg} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis type="number" stroke={BRAND.textDim} fontSize={10} />
              <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={10} width={100} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.blue}1A` }} />
              <Bar dataKey="value" fill={BRAND.blue} radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="신분 / 비자 분포" subtitle="멘티 응답자 (선택 응답)">
          {visaAgg.length === 0 ? (
            <div className="h-[260px] flex items-center justify-center text-xs text-brand-textDim">
              아직 데이터가 충분하지 않습니다
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={visaAgg} layout="vertical" margin={{ left: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
                <XAxis type="number" stroke={BRAND.textDim} fontSize={10} />
                <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={10} width={120} />
                <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.accent}1A` }} />
                <Bar dataKey="value" fill={BRAND.accent} radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      {/* ── Row 4: 직장인 멘티 전용 인사이트 ── */}
      {menteePros > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Briefcase size={14} className="text-brand-accent" />
            <h3 className="text-sm font-bold">직장인 멘티 인사이트</h3>
            <span className="text-[11px] text-brand-textDim">— Professional track {menteePros}건</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title="멘토링 니즈 Top 10" subtitle="구체적인 멘토링 요청 — 매칭 우선순위" className="lg:col-span-2">
              {proNeedsAgg.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-xs text-brand-textDim">
                  직장인 멘티 응답이 아직 없습니다
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={proNeedsAgg} layout="vertical" margin={{ left: 10, right: 16 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
                    <XAxis type="number" stroke={BRAND.textDim} fontSize={10} />
                    <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={10} width={210} />
                    <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.accent}1A` }} />
                    <Bar dataKey="value" fill={BRAND.accent} radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
            <Card title="경력 단계 분포" subtitle="주니어 / 시니어 / 매니저 / 전환자">
              {proCareerStageAgg.length === 0 ? (
                <div className="h-[300px] flex items-center justify-center text-xs text-brand-textDim">
                  데이터 없음
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={proCareerStageAgg}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={95}
                      label={{ fontSize: 10, fill: BRAND.textDim }}
                    >
                      {proCareerStageAgg.map((_, i) => (
                        <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke={BRAND.bg} strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<Tip />} />
                    <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ── Row 5: 한국 학력/배경 분포 (전체) ── */}
      {koreanOriginAgg.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <Card title="한국 학력/배경 분포" subtitle="멘토·멘티 응답자 전체 — 비슷한 배경 매칭에 활용">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={koreanOriginAgg} layout="vertical" margin={{ left: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
                <XAxis type="number" stroke={BRAND.textDim} fontSize={10} />
                <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={10} width={150} />
                <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.purple}1A` }} />
                <Bar dataKey="value" fill={BRAND.purple} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card title="매칭 시그널 요약" subtitle="응답 풀에서 도출된 매칭 가능성">
            <div className="space-y-3 text-sm pt-2">
              <SignalRow label="🤝 같은 산업 + 같은 시니어리티 매칭 가능 추정" value={Math.min(mentors, mentees)} />
              <SignalRow label="🌏 크로스보더 (한국 ↔ 북미) 매칭 후보" value={
                filtered.filter((r) => r.mentee_target_market === "EITHER" || (r.country === "KR" && r.mentee_target_market === "NA")).length
              } />
              <SignalRow label="🛂 비자 sponsorship 경험 필요 멘티" value={
                filtered.filter((r) => r.role === "mentee" && (r.visa_status === "f1" || r.visa_status === "opt" || r.visa_status === "h1b")).length
              } />
              <SignalRow label="🔥 즉시 매칭 희망" value={urgentCount} />
              <SignalRow label="💼 직장인 멘티 (전체 멘티 대비)" value={`${menteePros} / ${mentees}`} />
            </div>
          </Card>
        </div>
      )}

      {/* ── Response table ── */}
      <Card title="응답 명세" subtitle={`${total}건 · 클릭하여 상세 보기 (검색 위 필터바 활용)`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-brand-textDim border-b border-brand-border">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">이름</th>
                <th className="py-2 pr-4">세그먼트</th>
                <th className="py-2 pr-4">소속</th>
                <th className="py-2 pr-4">전공/직무</th>
                <th className="py-2 pr-4">산업</th>
                <th className="py-2 pr-4">단계/연차</th>
                <th className="py-2 pr-4">타겟</th>
                <th className="py-2 pr-4">시급도</th>
                <th className="py-2 pr-4">제출일</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 100).map((r, idx) => {
                const seg = segmentOf(r);
                const segLabel = SEG_LABEL[seg] || "기타";
                const segColor = SEG_COLOR[seg] || BRAND.textDim;
                const affil = r.role === "mentor" ? r.mentor_company : r.mentee_type === "professional" ? r.mentee_pro_company : r.mentee_school;
                const detail = r.role === "mentor"
                  ? r.mentor_position
                  : r.mentee_type === "professional"
                  ? r.mentee_pro_position
                  : r.mentee_major;
                const stage = r.mentor_seniority || r.mentee_pro_seniority || r.mentee_grad_year || r.mentee_career_stage || "—";
                const target = r.mentee_target_market === "NA" ? "NA" : r.mentee_target_market === "KR" ? "KR" : r.mentee_target_market === "EITHER" ? "둘다" : "—";
                return (
                  <tr key={idx} className="border-b border-brand-border hover:bg-white/[0.02]">
                    <td className="py-2 pr-4 text-brand-textDim">{idx+1}</td>
                    <td className="py-2 pr-4">{r.name || "—"}</td>
                    <td className="py-2 pr-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: `${segColor}33`, color: segColor }}>
                        {segLabel}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-brand-textDim">{affil || "—"}</td>
                    <td className="py-2 pr-4">{detail || "—"}</td>
                    <td className="py-2 pr-4">
                      {[...(r.mentor_industries||[]),...(r.mentee_target_industries||[])].slice(0,2).join(", ") || "—"}
                    </td>
                    <td className="py-2 pr-4">{stage}</td>
                    <td className="py-2 pr-4 text-brand-textDim">{target}</td>
                    <td className="py-2 pr-4">
                      {r.urgency === "asap" ? <span className="text-brand-danger">🔥 즉시</span>
                        : r.urgency === "short" ? "단기"
                        : r.urgency === "mid" ? "중기"
                        : r.urgency === "long" ? "장기"
                        : "—"}
                    </td>
                    <td className="py-2 pr-4 text-brand-textDim">{(r.created_at || "").slice(0, 10)}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="py-8 text-center text-brand-textDim">조건에 맞는 응답이 없습니다</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 100 && (
          <div className="text-[11px] text-brand-textDim mt-3 text-center">
            상위 100건만 표시 — 더 많이 보려면 검색·필터로 좁혀주세요
          </div>
        )}
      </Card>
    </div>
  );
}

const Kpi = ({ icon: Icon, label, value, sub, accent }: any) => (
  <div className="rounded-xl p-4 border border-brand-border bg-brand-surface">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] uppercase tracking-wider text-brand-textDim">{label}</span>
      <div className="rounded-md p-1.5" style={{ background: `${accent || "#10B981"}1A` }}>
        <Icon size={14} style={{ color: accent || "#10B981" }} />
      </div>
    </div>
    <div className="text-2xl font-bold text-brand-text">{value}</div>
    {sub && <div className="text-[11px] mt-0.5 text-brand-textDim">{sub}</div>}
  </div>
);

const SignalRow = ({ label, value }: any) => (
  <div className="flex items-center justify-between border-b border-brand-border/50 pb-2.5 last:border-b-0 last:pb-0">
    <span className="text-brand-textDim text-xs">{label}</span>
    <span className="font-bold text-brand-text">{value}</span>
  </div>
);

const Card = ({ title, subtitle, children, right, className = "" }: any) => (
  <div className={`rounded-2xl p-5 border border-brand-border bg-brand-surface ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {subtitle && <p className="text-[11px] mt-0.5 text-brand-textDim">{subtitle}</p>}
      </div>
      {right}
    </div>
    {children}
  </div>
);
