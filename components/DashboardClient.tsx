"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { SurveyResponse } from "@/lib/types";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import { Users, Target, Globe2, Filter, Sparkles, Briefcase, Clock, RefreshCw, Lock } from "lucide-react";

const BRAND = {
  bg: "#0A0F1C", surface: "#111827", surface2: "#1F2937",
  border: "#1E3A2F", primary: "#10B981", primaryDim: "#059669",
  accent: "#34D399", warn: "#F59E0B", text: "#E5E7EB", textDim: "#9CA3AF",
};
const PALETTE = ["#10B981","#34D399","#6EE7B7","#A7F3D0","#059669","#047857","#FBBF24","#F59E0B","#3B82F6","#EF4444","#A78BFA"];

// Mock fallback when Supabase isn't configured
const MOCK: SurveyResponse[] = Array.from({ length: 24 }).map((_, i) => {
  const isMentor = i % 2 === 0;
  const country = i % 3 === 0 ? "KR" : "PK";
  const industries = ["ICT/SaaS","Fintech","Ecommerce","AI/Data","Cybersecurity","Gaming","Healthcare","Content/Media"];
  const ind = industries[i % industries.length];
  return {
    name: `Sample ${i+1}`, email: `s${i}@x.com`,
    country: country as any, role: isMentor ? "mentor" : "mentee",
    languages: country === "KR" ? ["한국어","English"] : ["English","Urdu"],
    consent: true,
    mentor_seniority: isMentor ? ["6-10y","11-15y","16-20y","20y+"][i % 4] : undefined,
    mentor_industries: isMentor ? [ind] : undefined,
    mentor_functions: isMentor ? [["Engineering","Product","Marketing/Growth","BD/Sales"][i % 4]] : undefined,
    mentor_monthly_hours: isMentor ? ["3-5","6-10","1-2"][i % 3] : undefined,
    mentee_industries: !isMentor ? [ind] : undefined,
    mentee_stage: !isMentor ? ["idea","mvp","seed","seriesA"][i % 4] : undefined,
    mentee_help_needs: !isMentor ? [["기술","마케팅","BD/세일즈","투자유치"][i % 4]] : undefined,
    mentee_cross_border: !isMentor ? ["bidirectional","kr_to_pk","pk_to_kr"][i % 3] : undefined,
  } as SurveyResponse;
});

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
      setRows(MOCK); setUsedMock(true); setLoading(false); return;
    }
    const { data, error } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      setRows(MOCK); setUsedMock(true);
    } else {
      setRows(data as any); setUsedMock(false);
    }
    setLoading(false);
  };

  useEffect(() => { if (authed) fetchData(); }, [authed]);

  // Filters
  const [roleFilter, setRoleFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const filtered = useMemo(() => rows.filter(r =>
    (roleFilter === "all" || r.role === roleFilter) &&
    (countryFilter === "all" || r.country === countryFilter)
  ), [rows, roleFilter, countryFilter]);

  const total = filtered.length;
  const mentors = filtered.filter(r => r.role === "mentor" || r.role === "both").length;
  const mentees = filtered.filter(r => r.role === "mentee" || r.role === "both").length;
  const ratio = mentees > 0 ? (mentors / mentees).toFixed(2) : "—";

  const roleData = [
    { name: "멘토", value: mentors },
    { name: "멘티", value: mentees },
  ];

  const countryAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach(r => { const k = r.country === "KR" ? "대한민국" : r.country === "PK" ? "파키스탄" : "기타"; m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const industryAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach(r => {
      const inds = [...(r.mentor_industries || []), ...(r.mentee_industries || [])];
      inds.forEach(i => { m[i] = (m[i] || 0) + 1; });
    });
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value);
  }, [filtered]);

  const supplyDemand = useMemo(() => {
    const m: Record<string, { name: string; mentor: number; mentee: number }> = {};
    filtered.forEach(r => {
      (r.mentor_industries || []).forEach(ind => {
        if (!m[ind]) m[ind] = { name: ind, mentor: 0, mentee: 0 };
        m[ind].mentor += 1;
      });
      (r.mentee_industries || []).forEach(ind => {
        if (!m[ind]) m[ind] = { name: ind, mentor: 0, mentee: 0 };
        m[ind].mentee += 1;
      });
    });
    return Object.values(m).map(d => ({ ...d, gap: d.mentee - d.mentor })).sort((a,b) => Math.abs(b.gap) - Math.abs(a.gap));
  }, [filtered]);

  const crossBorderAgg = useMemo(() => {
    const m: Record<string, number> = {};
    filtered.forEach(r => {
      const v = r.mentee_cross_border;
      if (!v) return;
      const k = v === "bidirectional" ? "양방향" : v === "kr_to_pk" ? "한→파" : v === "pk_to_kr" ? "파→한" : "해당없음";
      m[k] = (m[k] || 0) + 1;
    });
    return Object.entries(m).map(([name, value]) => ({ name, value }));
  }, [filtered]);

  const functionRadar = useMemo(() => {
    const funcs = ["Engineering","Product","Marketing/Growth","BD/Sales","Investment/Finance"];
    return funcs.map(f => ({
      function: f,
      mentor: filtered.filter(r => (r.mentor_functions || []).includes(f)).length,
      mentee: filtered.filter(r => (r.mentee_help_needs || []).some(n => f.toLowerCase().includes(n.toLowerCase()))).length,
    }));
  }, [filtered]);

  const matchScore = useMemo(() => {
    if (!total) return 0;
    const balance = mentees && mentors ? Math.min(mentors, mentees) / Math.max(mentors, mentees) : 0;
    const diversity = Math.min(industryAgg.length / 8, 1);
    return Math.round((balance * 0.55 + diversity * 0.45) * 100);
  }, [total, mentors, mentees, industryAgg.length]);

  const insights = useMemo(() => {
    const out: { type: string; text: string }[] = [];
    if (mentees > mentors * 1.3) out.push({ type: "warn", text: `멘티 수가 멘토보다 약 ${(mentees / Math.max(mentors,1)).toFixed(1)}배 — 추가 멘토 모집 필요` });
    if (mentors > mentees * 1.3) out.push({ type: "info", text: `멘토 풀이 충분 — 1:N 그룹 멘토링 옵션 검토 가능` });
    const top = supplyDemand[0];
    if (top && Math.abs(top.gap) >= 2) {
      out.push({ type: top.gap > 0 ? "warn" : "info", text: `${top.name} 분야 ${top.gap > 0 ? "멘토 부족" : "멘토 잉여"} (갭 ${top.gap > 0 ? "+" : ""}${top.gap})` });
    }
    const cross = crossBorderAgg.find(d => d.name === "양방향");
    if (cross && total > 0) out.push({ type: "good", text: `응답자 중 ${Math.round(cross.value/total*100)}%가 양방향 협력 희망` });
    if (out.length === 0) out.push({ type: "info", text: "현재 필터 조건에서 특이 시그널 없음" });
    return out;
  }, [mentors, mentees, supplyDemand, crossBorderAgg, total]);

  if (!authed) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-brand-primary/20 flex items-center justify-center">
            <Lock className="text-brand-primary" size={20} />
          </div>
          <h2 className="text-lg font-bold mb-2">대시보드 접근</h2>
          <p className="text-sm text-brand-textDim mb-5">관리자 비밀번호를 입력해주세요</p>
          <input type="password" value={pwInput} onChange={e => setPwInput(e.target.value)}
                 onKeyDown={e => { if (e.key === "Enter") setAuthed(pwInput === dashboardPw); }}
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
      {/* Top status bar */}
      <div className="flex items-center justify-between mb-5 text-xs flex-wrap gap-2">
        <div className="flex items-center gap-3 text-brand-textDim">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
            {usedMock ? "Mock data (Supabase 미연결 또는 응답 0건)" : `Live · ${total} responses`}
          </span>
          {loading && <span>· loading...</span>}
        </div>
        <button onClick={fetchData} className="btn-ghost text-xs inline-flex items-center gap-1.5 py-1.5 px-3">
          <RefreshCw size={12} /> 새로고침
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-4 mb-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-brand-textDim"><Filter size={14} /> 필터</div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-brand-textDim">역할</span>
          {[
            { v: "all", l: "전체" },
            { v: "mentor", l: "멘토" },
            { v: "mentee", l: "멘티" },
            { v: "both", l: "양방향" },
          ].map(o => (
            <button key={o.v} onClick={() => setRoleFilter(o.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                roleFilter === o.v ? "bg-brand-primary text-brand-bg border-brand-primary"
                : "text-brand-textDim border-brand-border"
              }`}>{o.l}</button>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-brand-textDim">국가</span>
          {[
            { v: "all", l: "전체" },
            { v: "KR", l: "대한민국" },
            { v: "PK", l: "파키스탄" },
          ].map(o => (
            <button key={o.v} onClick={() => setCountryFilter(o.v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                countryFilter === o.v ? "bg-brand-primary text-brand-bg border-brand-primary"
                : "text-brand-textDim border-brand-border"
              }`}>{o.l}</button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Kpi icon={Users} label="총 응답" value={total} sub="필터 적용 기준" />
        <Kpi icon={Briefcase} label="멘토 / 멘티" value={`${mentors} / ${mentees}`} sub={`비율 ${ratio} : 1`} accent={BRAND.accent} />
        <Kpi icon={Target} label="매칭 적합도" value={`${matchScore}점`} sub="균형·다양성 가중평균" accent={BRAND.warn} />
        <Kpi icon={Globe2} label="양방향 희망" value={`${crossBorderAgg.find(d=>d.name==="양방향")?.value || 0}명`} sub="크로스보더 매칭" accent="#3B82F6" />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="역할 분포">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={roleData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {roleData.map((_, i) => <Cell key={i} fill={i === 0 ? BRAND.primary : BRAND.warn} stroke={BRAND.bg} strokeWidth={2} />)}
              </Pie>
              <Tooltip content={<Tip />} />
              <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card title="국가별 응답">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={countryAgg} layout="vertical" margin={{ left: 20, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis type="number" stroke={BRAND.textDim} fontSize={11} />
              <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={11} width={70} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Bar dataKey="value" fill={BRAND.primary} radius={[0,6,6,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="크로스보더 진출 관심">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={crossBorderAgg} dataKey="value" nameKey="name" outerRadius={80} label={{ fontSize: 11, fill: BRAND.textDim }}>
                {crossBorderAgg.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} stroke={BRAND.bg} strokeWidth={2} />)}
              </Pie>
              <Tooltip content={<Tip />} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <Card title="산업별 수요-공급 갭" subtitle="멘티(수요) vs 멘토(공급) — 갭 양수 = 멘토 부족">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={supplyDemand} margin={{ top: 10, right: 16, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis dataKey="name" stroke={BRAND.textDim} fontSize={10} angle={-25} textAnchor="end" interval={0} />
              <YAxis stroke={BRAND.textDim} fontSize={11} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 12 }} />
              <Bar dataKey="mentor" name="멘토" fill={BRAND.primary} radius={[4,4,0,0]} />
              <Bar dataKey="mentee" name="멘티" fill={BRAND.warn} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card title="직무 영역 매핑" subtitle="멘토 공급 vs 멘티 수요">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={functionRadar} outerRadius={100}>
              <PolarGrid stroke={BRAND.border} />
              <PolarAngleAxis dataKey="function" tick={{ fill: BRAND.textDim, fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: BRAND.textDim, fontSize: 10 }} stroke={BRAND.border} />
              <Radar name="멘토" dataKey="mentor" stroke={BRAND.primary} fill={BRAND.primary} fillOpacity={0.4} />
              <Radar name="멘티" dataKey="mentee" stroke={BRAND.warn} fill={BRAND.warn} fillOpacity={0.3} />
              <Legend wrapperStyle={{ color: BRAND.textDim, fontSize: 12 }} />
              <Tooltip content={<Tip />} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card title="산업군 응답량 Top" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={industryAgg.slice(0,8)} layout="vertical" margin={{ left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
              <XAxis type="number" stroke={BRAND.textDim} fontSize={11} />
              <YAxis dataKey="name" type="category" stroke={BRAND.textDim} fontSize={11} width={100} />
              <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
              <Bar dataKey="value" radius={[0,6,6,0]}>
                {industryAgg.slice(0,8).map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
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
            <div className="flex items-center gap-2 mb-1"><Clock size={12} /> 다음 단계</div>
            <div>1) 갭 큰 산업군 멘토 추가 모집 · 2) 양방향 희망자 우선 매칭 · 3) 시간대 정렬</div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card title="응답 명세 (필터 결과)" subtitle={`${total}건 표시 — 매칭 심사용 raw view`}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-brand-textDim border-b border-brand-border">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">이름</th>
                <th className="py-2 pr-4">역할</th>
                <th className="py-2 pr-4">국가</th>
                <th className="py-2 pr-4">소속</th>
                <th className="py-2 pr-4">산업</th>
                <th className="py-2 pr-4">단계/연차</th>
                <th className="py-2 pr-4">방향</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={idx} className="border-b border-brand-border">
                  <td className="py-2 pr-4 text-brand-textDim">{idx+1}</td>
                  <td className="py-2 pr-4">{r.name || "—"}</td>
                  <td className="py-2 pr-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{
                        background: r.role === "mentor" ? `${BRAND.primary}33` : r.role === "mentee" ? `${BRAND.warn}33` : "#3B82F633",
                        color: r.role === "mentor" ? BRAND.primary : r.role === "mentee" ? BRAND.warn : "#3B82F6"
                      }}>
                      {r.role === "mentor" ? "멘토" : r.role === "mentee" ? "멘티" : "양방향"}
                    </span>
                  </td>
                  <td className="py-2 pr-4">{r.country === "KR" ? "🇰🇷 KR" : r.country === "PK" ? "🇵🇰 PK" : "기타"}</td>
                  <td className="py-2 pr-4 text-brand-textDim">{r.affiliation || "—"}</td>
                  <td className="py-2 pr-4">{[...(r.mentor_industries||[]),...(r.mentee_industries||[])].slice(0,2).join(", ") || "—"}</td>
                  <td className="py-2 pr-4">{r.mentor_seniority || r.mentee_stage || "—"}</td>
                  <td className="py-2 pr-4 text-brand-textDim">
                    {r.mentee_cross_border === "bidirectional" ? "양방향" :
                     r.mentee_cross_border === "kr_to_pk" ? "한→파" :
                     r.mentee_cross_border === "pk_to_kr" ? "파→한" : "—"}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-brand-textDim">조건에 맞는 응답이 없습니다</td></tr>
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
