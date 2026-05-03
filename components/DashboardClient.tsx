"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SurveyResponse } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Users,
  Target,
  Globe2,
  Filter,
  Sparkles,
  Briefcase,
  Clock,
  RefreshCw,
  Lock,
  GraduationCap,
} from "lucide-react";

const BRAND = {
  bg: "#0A0F1C",
  surface: "#111827",
  surface2: "#1F2937",
  border: "#1E3A2F",
  primary: "#10B981",
  primaryDim: "#059669",
  accent: "#34D399",
  warn: "#F59E0B",
  text: "#E5E7EB",
  textDim: "#9CA3AF",
};
const PALETTE = [
  "#10B981", "#34D399", "#6EE7B7", "#A7F3D0",
  "#059669", "#047857", "#FBBF24", "#F59E0B",
  "#3B82F6", "#A78BFA", "#EF4444",
];

// Mock fallback when Supabase isn't configured or empty
const MOCK: SurveyResponse[] = (() => {
  const out: SurveyResponse[] = [];
  const mentorCompanies = ["Google", "Meta", "Amazon", "Apple", "Microsoft", "Stripe", "Netflix", "Airbnb", "Snowflake", "Databricks"];
  const mentorIndustries = ["Tech / Software", "Finance / IB", "AI / ML", "Product / SaaS", "Consulting", "Healthcare / Biotech"];
  const naSchools = ["UC Berkeley", "Stanford", "MIT", "CMU", "Univ. of Toronto", "Univ. of Washington", "UCLA", "Cornell"];
  const krSchools = ["서울대", "KAIST", "연세대", "고려대", "성균관대", "한양대"];
  const majors = ["Computer Science", "Business", "Electrical Engineering", "Economics", "Bioengineering", "Statistics", "Design"];
  const targets = ["NA", "KR", "EITHER"];

  // 12 mentors (NA-based)
  for (let i = 0; i < 12; i++) {
    out.push({
      name: `Mentor ${i + 1}`,
      email: `m${i}@x.com`,
      country: i % 4 === 0 ? "CA" : "US",
      role: "mentor",
      program: "students",
      consent: true,
      languages: ["한국어", "English"],
      mentor_company: mentorCompanies[i % mentorCompanies.length],
      mentor_seniority: ["4-7y", "8-12y", "13-18y", "18y+"][i % 4],
      mentor_industries: [mentorIndustries[i % mentorIndustries.length]],
      mentor_functions: [["Software Engineering", "Product Management", "Design / UX", "Data / Analytics"][i % 4]],
      mentor_korean_origin: ["yes", "partial", "no"][i % 3],
      mentor_monthly_hours: ["3-5", "6-10", "1-2"][i % 3],
    } as SurveyResponse);
  }
  // 16 mentees (NA + KR students)
  for (let i = 0; i < 16; i++) {
    const isKR = i % 2 === 0;
    out.push({
      name: `Mentee ${i + 1}`,
      email: `s${i}@x.com`,
      country: isKR ? "KR" : "US",
      role: "mentee",
      program: "students",
      consent: true,
      languages: isKR ? ["한국어", "English"] : ["English", "한국어"],
      mentee_school: isKR ? krSchools[i % krSchools.length] : naSchools[i % naSchools.length],
      mentee_school_country: isKR ? "KR" : "US",
      mentee_major: majors[i % majors.length],
      mentee_grad_year: ["2025", "2026", "2027", "2028"][i % 4],
      mentee_degree: ["Bachelor's", "Master's"][i % 2],
      mentee_target_industries: [mentorIndustries[i % mentorIndustries.length]],
      mentee_target_market: targets[i % 3],
      mentee_career_stage: ["exploring", "internship", "fulltime", "decided"][i % 4],
    } as SurveyResponse);
  }
  return out;
})();

export default function DashboardClient() {
  const [authed, setAuthed] = useState<boolean>(false);
  const [pwInput, setPwInput] = useState("");
  const dashboardPw = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "";

  useEffect(() => {
    if (!dashboardPw) setAuthed(true);
  }, [dashboardPw]);

  const [rows, setRows] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [usedMock, setUsedMock] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setRows(MOCK);
      setUsedMock(true);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      setRows(MOCK);
      setUsedMock(true);
    } else {
      setRows(data as any);
      setUsedMock(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authed) fetchData();
  }, [authed]);

  // ── Filters ──
  const [roleFilter, setRoleFilter] = useState("all"); // all | mentor | mentee
  const [segmentFilter, setSegmentFilter] = useState("all"); // all | na_mentor | na_student | kr_student

  const segmentOf = (r: SurveyResponse): "na_mentor" | "na_student" | "kr_student" | "other" => {
    if (r.role === "mentor") return r.country === "US" || r.country === "CA" ? "na_mentor" : "other";
    // mentee
    const sc = r.mentee_school_country || r.country;
    if (sc === "KR") return "kr_student";
    if (sc === "US" || sc === "CA") return "na_student";
    return "other";
  };

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (roleFilter === "all" || r.role === roleFilter) &&
          (segmentFilter === "all" || segmentOf(r) === segmentFilter)
      ),
    [rows, roleFilter, segmentFilter]
  );

  const total = filtered.length;
  const mentors = filtered.filter((r) => r.role === "mentor").length;
  const mentees = filtered.filter((r) => r.role === "mentee").length;
  const ratio = mentees > 0 ? (mentors / mentees).toFixed(2) : "—";

  // ── Aggregations ──
  const segmentAgg = useMemo(() => {
    const m: Record<string, number> = { "NA 멘토": 0, "NA 학생": 0, "KR 학생": 0, 기타: 0 };
    filtered.forEach((r) => {
      const s = segmentOf(r);
      const k =
        s === "na_mentor" ? "NA 멘토" : s === "na_student" ? "NA 학생" : s === "kr_student" ? "KR 학생" : "기타";
      m[k] = (m[k] || 0) + 1;
    });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const targetMarketAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered
      .filter((r) => r.role === "mentee" && r.mentee_target_market)
      .forEach((r) => {
        const k =
          r.mentee_target_market === "NA"
            ? "North America"
            : r.mentee_target_market === "KR"
            ? "Korea"
            : "둘 다 / 미정";
        m[k] = (m[k] || 0) + 1;
      });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const industryAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach((r) => {
      const inds = [...(r.mentor_industries || []), ...(r.mentee_target_industries || [])];
      inds.forEach((i) => {
        m[i] = (m[i] || 0) + 1;
      });
    });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [filtered]);

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
      .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
  }, [filtered]);

  const mentorCompanyAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered
      .filter((r) => r.role === "mentor" && r.mentor_company)
      .forEach((r) => {
        const c = (r.mentor_company || "").trim();
        if (c) m[c] = (m[c] || 0) + 1;
      });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filtered]);

  const seniorityAgg = useMemo(() => {
    const order = ["1-3y", "4-7y", "8-12y", "13-18y", "18y+"];
    const m: Record<string, number> = {};
    filtered
      .filter((r) => r.role === "mentor")
      .forEach((r) => {
        const s = r.mentor_seniority;
        if (s) m[s] = (m[s] || 0) + 1;
      });
    return order.filter((k) => m[k]).map((k) => ({ name: k, value: m[k] }));
  }, [filtered]);

  const schoolAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered
      .filter((r) => r.role === "mentee" && r.mentee_school)
      .forEach((r) => {
        const s = (r.mentee_school || "").trim();
        if (s) m[s] = (m[s] || 0) + 1;
      });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filtered]);

  const careerStageAgg = useMemo(() => {
    const m: Record<string, number> = {};
    const labelMap: Record<string, string> = {
      exploring: "진로 탐색",
      decided: "방향 정해짐",
      internship: "인턴십 준비",
      fulltime: "풀타임 준비",
      "grad-school": "대학원 고민",
    };
    filtered
      .filter((r) => r.role === "mentee" && r.mentee_career_stage)
      .forEach((r) => {
        const k = labelMap[r.mentee_career_stage || ""] || r.mentee_career_stage || "기타";
        m[k] = (m[k] || 0) + 1;
      });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const matchScore = useMemo(() => {
    if (!total) return 0;
    const balance = mentees && mentors ? Math.min(mentors, mentees) / Math.max(mentors, mentees) : 0;
    const diversity = Math.min(industryAgg.length / 8, 1);
    return Math.round((balance * 0.55 + diversity * 0.45) * 100);
  }, [total, mentors, mentees, industryAgg.length]);

  const insights = useMemo(() => {
    const out: { type: string; text: string }[] = [];
    if (mentees > mentors * 1.5)
      out.push({
        type: "warn",
        text: `멘티가 멘토보다 약 ${(mentees / Math.max(mentors, 1)).toFixed(1)}배 — NA 직장인 멘토 추가 모집 필요`,
      });
    if (mentors > mentees * 1.5)
      out.push({ type: "info", text: `멘토 풀이 충분 — 1:N 그룹 멘토링·학교별 세션 검토 가능` });
    const top = supplyDemand[0];
    if (top && Math.abs(top.gap) >= 2) {
      out.push({
        type: top.gap > 0 ? "warn" : "info",
        text: `${top.name} 분야 ${top.gap > 0 ? "멘토 부족" : "멘토 잉여"} (갭 ${top.gap > 0 ? "+" : ""}${top.gap})`,
      });
    }
    const naStudents = segmentAgg.find((d) => d.name === "NA 학생")?.value || 0;
    const krStudents = segmentAgg.find((d) => d.name === "KR 학생")?.value || 0;
    if (naStudents && krStudents) {
      out.push({
        type: "good",
        text: `학생 분포: NA ${naStudents}명 / KR ${krStudents}명 — 양 지역 모두 활성`,
      });
    }
    const krWantingNA = filtered.filter(
      (r) => r.mentee_school_country === "KR" && r.mentee_target_market === "NA"
    ).length;
    if (krWantingNA >= 2) {
      out.push({
        type: "info",
        text: `한국 학생 중 ${krWantingNA}명이 북미 진출 희망 — 비자/글로벌 취업 트랙 멘토 매칭 우선`,
      });
    }
    if (out.length === 0) out.push({ type: "info", text: "현재 필터 조건에서 특이 시그널 없음" });
    return out;
  }, [mentors, mentees, supplyDemand, segmentAgg, filtered]);

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-primary/20 flex items-center justify-center">
            <Lock className="text-brand-primary" size={20} />
          </div>
          <h2 className="text-lg font-bold mb-2">대시보드 접근</h2>
          <p className="text-sm text-brand-textDim mb-5">관리자 비밀번호를 입력해주세요</p>
          <input
            type="password"
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setAuthed(pwInput === dashboardPw);
            }}
            placeholder="••••••••"
            className="mb-3"
          />
          <button className="btn-primary w-full" onClick={() => setAuthed(pwInput === dashboardPw)}>
            접속
          </button>
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
      <div
        className="rounded-lg px-3 py-2 border text-xs"
        style={{ background: BRAND.surface2, borderColor: BRAND.border, color: BRAND.text }}
      >
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
      <div className="flex items-center justify-between mb-5 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-3 text-brand-textDim">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            {usedMock
              ? "Mock data (응답이 쌓이면 실제 데이터로 자동 전환)"
              : `Live · ${total} responses`}
          </span>
          {loading && <span>· loading...</span>}
        </div>
        <button onClick={fetchData} className="btn-ghost text-xs inline-flex items-center gap-1.5 py-1.5 px-3">
          <RefreshCw size={12} /> 새로고침
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-4 mb-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-brand-textDim">
          <Filter size={14} /> 필터
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-brand-textDim">역할</span>
          {[
            { v: "all", l: "전체" },
            { v: "mentor", l: "멘토" },
            { v: "mentee", l: "멘티" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setRoleFilter(o.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                roleFilter === o.v
                  ? "bg-brand-primary text-brand-bg border-brand-primary"
                  : "text-brand-textDim border-brand-border"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-brand-textDim">세그먼트</span>
          {[
            { v: "all", l: "전체" },
            { v: "na_mentor", l: "NA 멘토" },
            { v: "na_student", l: "NA 학생" },
            { v: "kr_student", l: "KR 학생" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => setSegmentFilter(o.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                segmentFilter === o.v
                  ? "bg-brand-primary text-brand-bg border-brand-primary"
                  : "text-brand-textDim border-brand-border"
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Kpi icon={Users} label="총 응답" value={total} sub="필터 적용 기준" />
        <Kpi icon={Briefcase} label="멘토 (NA)" value={mentors} sub={`멘티 대비 ${ratio}배`} accent={BRAND.accent} />
        <Kpi icon={GraduationCap} label="멘티 (학생)" value={mentees} sub="NA + KR 학생 합계" accent={BRAND.warn} />
        <Kpi icon={Target} label="매칭 적합도" value={`${matchScore}점`} sub="균형·다양성 가중평균" accent="#3B82F6" />
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="3-축 분포" subtitle="NA 멘토 / NA 학생 / KR 학생">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={segmentAgg.filter((d) => d.value > 0)}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {segmentAgg.filter((d) => d.value > 0).map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke={BRAND.bg} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="멘티 타겟 마켓" subtitle="어디서 일하고 싶나요?">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={targetMarketAgg} layout="vertical" margin={{ left: 30, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis type="number" stroke={BRAND.textDim} fontSize={11} />
              <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={11} width={100} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Bar dataKey="value" fill={BRAND.primary} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="멘토 시니어리티 분포" subtitle="현직 직장인 연차">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={seniorityAgg} margin={{ top: 10, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis dataKey="name" stroke={BRAND.textDim} fontSize={11} />
              <YAxis stroke={BRAND.textDim} fontSize={11} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Bar dataKey="value" fill={BRAND.accent} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card title="산업별 수요-공급 갭" subtitle="멘티 관심산업 vs 멘토 전문산업 — 갭 양수 = 멘토 부족">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={supplyDemand} margin={{ top: 10, right: 16, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis
                dataKey="name"
                stroke={BRAND.textDim}
                fontSize={10}
                angle={-25}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke={BRAND.textDim} fontSize={11} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 12 }} />
              <Bar dataKey="mentor" name="멘토" fill={BRAND.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="mentee" name="멘티" fill={BRAND.warn} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="멘티 커리어 단계" subtitle="학생 응답자 단계 분포">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={careerStageAgg}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={{ fontSize: 11, fill: BRAND.textDim }}
              >
                {careerStageAgg.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke={BRAND.bg} strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="멘토 회사 Top" subtitle="현직 회사 분포 (상위 10)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mentorCompanyAgg} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis type="number" stroke={BRAND.textDim} fontSize={11} />
              <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={11} width={90} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {mentorCompanyAgg.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="멘티 학교 Top" subtitle="학생 응답자 학교 분포 (상위 10)">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={schoolAgg} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis type="number" stroke={BRAND.textDim} fontSize={11} />
              <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={11} width={90} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {schoolAgg.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="자동 인사이트" subtitle="매칭 알고리즘 시그널" right={<Sparkles size={16} className="text-brand-accent" />}>
          <ul className="space-y-3">
            {insights.map((it, i) => {
              const color = it.type === "warn" ? BRAND.warn : it.type === "good" ? BRAND.accent : BRAND.primary;
              return (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span>{it.text}</span>
                </li>
              );
            })}
          </ul>
          <div className="mt-5 pt-4 border-t border-brand-border text-xs text-brand-textDim">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={12} /> 다음 단계
            </div>
            <div>1) 갭 큰 산업 멘토 추가 모집 · 2) 한국 학생 NA 진출 트랙 매칭 · 3) 시간대 정렬</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card title="응답 명세 (필터 결과)" subtitle={`${total}건 — 매칭 심사용 raw view`}>
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
                <th className="py-2 pr-4">타겟마켓</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => {
                const seg = segmentOf(r);
                const segLabel =
                  seg === "na_mentor" ? "NA 멘토" : seg === "na_student" ? "NA 학생" : seg === "kr_student" ? "KR 학생" : "기타";
                const segColor = seg === "na_mentor" ? BRAND.primary : seg === "na_student" ? "#3B82F6" : seg === "kr_student" ? BRAND.warn : BRAND.textDim;
                return (
                  <tr key={idx} className="border-b border-brand-border">
                    <td className="py-2 pr-4 text-brand-textDim">{idx + 1}</td>
                    <td className="py-2 pr-4">{r.name || "—"}</td>
                    <td className="py-2 pr-4">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                        style={{ background: `${segColor}33`, color: segColor }}
                      >
                        {segLabel}
                      </span>
                    </td>
                    <td className="py-2 pr-4 text-brand-textDim">
                      {r.role === "mentor" ? r.mentor_company : r.mentee_school || "—"}
                    </td>
                    <td className="py-2 pr-4">
                      {r.role === "mentor"
                        ? r.mentor_position || (r.mentor_functions || []).join(",")
                        : r.mentee_major || "—"}
                    </td>
                    <td className="py-2 pr-4">
                      {[...(r.mentor_industries || []), ...(r.mentee_target_industries || [])]
                        .slice(0, 2)
                        .join(", ") || "—"}
                    </td>
                    <td className="py-2 pr-4">{r.mentor_seniority || r.mentee_grad_year || r.mentee_career_stage || "—"}</td>
                    <td className="py-2 pr-4 text-brand-textDim">
                      {r.mentee_target_market === "NA"
                        ? "NA"
                        : r.mentee_target_market === "KR"
                        ? "KR"
                        : r.mentee_target_market === "EITHER"
                        ? "둘다"
                        : "—"}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-brand-textDim">
                    조건에 맞는 응답이 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

const Kpi = ({ icon: Icon, label, value, sub, accent }: any) => (
  <div className="rounded-2xl p-5 border border-brand-border bg-brand-surface">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs uppercase tracking-wider text-brand-textDim">{label}</span>
      <div className="rounded-lg p-2" style={{ background: `${accent || "#10B981"}1A` }}>
        <Icon size={16} style={{ color: accent || "#10B981" }} />
      </div>
    </div>
    <div className="text-3xl font-semibold text-brand-text">{value}</div>
    {sub && <div className="text-xs mt-1 text-brand-textDim">{sub}</div>}
  </div>
);

const Card = ({ title, subtitle, children, right, className = "" }: any) => (
  <div className={`rounded-2xl p-5 border border-brand-border bg-brand-surface ${className}`}>
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && <p className="text-xs mt-1 text-brand-textDim">{subtitle}</p>}
      </div>
      {right}
    </div>
    {children}
  </div>
);
