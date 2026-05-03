"use client";

import { useEffect, useState } from "react";
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
} from "recharts";
import {
  Check,
  Users,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Mail,
  Calendar,
  Sparkles,
  Globe2,
} from "lucide-react";
import Link from "next/link";

const BRAND = {
  bg: "#0A0F1C",
  surface: "#111827",
  surface2: "#1F2937",
  border: "#1E3A2F",
  primary: "#10B981",
  accent: "#34D399",
  warn: "#F59E0B",
  text: "#E5E7EB",
  textDim: "#9CA3AF",
};
const PALETTE = ["#10B981", "#F59E0B", "#3B82F6", "#A78BFA"];

type Props = { mine: SurveyResponse };

const segmentOf = (r: SurveyResponse) => {
  if (r.role === "mentor") return r.country === "US" || r.country === "CA" ? "na_mentor" : "other";
  const sc = r.mentee_school_country || r.country;
  if (sc === "KR") return "kr_student";
  if (sc === "US" || sc === "CA") return "na_student";
  return "other";
};
const segLabel = (s: string) =>
  s === "na_mentor" ? "NA 멘토" : s === "na_student" ? "NA 학생" : s === "kr_student" ? "KR 학생" : "기타";

export default function ResultPanel({ mine }: Props) {
  const [pool, setPool] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!isSupabaseConfigured) {
        setPool([mine]);
        setLoading(false);
        return;
      }
      const { data } = await supabase.from("survey_responses").select("*");
      const list = (data as any) || [];
      // Make sure my own row is included even if cache lag
      if (!list.find((r: any) => r.email === mine.email && r.role === mine.role)) list.push(mine);
      setPool(list);
      setLoading(false);
    })();
  }, [mine]);

  const mySeg = segmentOf(mine);
  const total = pool.length;

  // Segment distribution (with mine highlighted)
  const segmentData = (() => {
    const m: Record<string, number> = { na_mentor: 0, na_student: 0, kr_student: 0, other: 0 };
    pool.forEach((r) => {
      m[segmentOf(r)] = (m[segmentOf(r)] || 0) + 1;
    });
    return [
      { key: "na_mentor", name: "NA 멘토", value: m.na_mentor },
      { key: "na_student", name: "NA 학생", value: m.na_student },
      { key: "kr_student", name: "KR 학생", value: m.kr_student },
    ].filter((d) => d.value > 0);
  })();

  // Same-industry peers
  const myIndustries =
    mine.role === "mentor" ? mine.mentor_industries || [] : mine.mentee_target_industries || [];
  const sameIndustryCount = pool.filter((r) => {
    if (r.email === mine.email) return false;
    const theirs =
      r.role === "mentor" ? r.mentor_industries || [] : r.mentee_target_industries || [];
    return theirs.some((i) => myIndustries.includes(i));
  }).length;

  // Same school / same company
  const sameSchoolOrCompanyCount =
    mine.role === "mentee"
      ? pool.filter(
          (r) =>
            r.email !== mine.email &&
            r.role === "mentee" &&
            r.mentee_school &&
            mine.mentee_school &&
            r.mentee_school.trim().toLowerCase() === mine.mentee_school.trim().toLowerCase()
        ).length
      : pool.filter(
          (r) =>
            r.email !== mine.email &&
            r.role === "mentor" &&
            r.mentor_company &&
            mine.mentor_company &&
            r.mentor_company.trim().toLowerCase() === mine.mentor_company.trim().toLowerCase()
        ).length;

  // For mentees, count NA mentors in their target industries
  const matchableMentors =
    mine.role === "mentee"
      ? pool.filter(
          (r) =>
            r.role === "mentor" &&
            (r.mentor_industries || []).some((i) => myIndustries.includes(i))
        ).length
      : pool.filter(
          (r) =>
            r.role === "mentee" &&
            (r.mentee_target_industries || []).some((i) => myIndustries.includes(i))
        ).length;

  // Industry mini bar (top 5 in pool, mine highlighted)
  const industryBar = (() => {
    const m: Record<string, number> = {};
    pool.forEach((r) => {
      const inds = [...(r.mentor_industries || []), ...(r.mentee_target_industries || [])];
      inds.forEach((i) => {
        m[i] = (m[i] || 0) + 1;
      });
    });
    return Object.entries(m)
      .map(([name, value]) => ({ name, value, mine: myIndustries.includes(name) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  })();

  // Tooltip
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

  const myRoleLabel =
    mine.role === "mentor" ? "Mentor (북미 현직)" : "Mentee (학생)";
  const myAffiliation = mine.role === "mentor" ? mine.mentor_company : mine.mentee_school;
  const myDetail =
    mine.role === "mentor"
      ? mine.mentor_position || (mine.mentor_functions || []).join(", ")
      : `${mine.mentee_major || ""}${mine.mentee_grad_year ? ` · ${mine.mentee_grad_year}` : ""}`;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <Check className="text-brand-primary" size={26} />
        </div>
        <h1 className="text-3xl font-bold mb-3">
          감사합니다, <span className="text-brand-primary">{mine.name}</span>님!
        </h1>
        <p className="text-brand-textDim text-sm leading-relaxed max-w-xl mx-auto">
          응답이 안전하게 접수되었습니다. 매칭·이벤트 결과는{" "}
          <span className="text-brand-text">{mine.email}</span>로 안내드립니다.
        </p>
      </div>

      {/* Profile summary */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 mb-4">
        <div className="text-xs uppercase tracking-wider text-brand-textDim mb-4">
          📋 입력하신 프로필
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="역할">{myRoleLabel}</Field>
          <Field label="세그먼트">
            <span
              className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
              style={{ background: `${BRAND.primary}33`, color: BRAND.primary }}
            >
              {segLabel(mySeg)}
            </span>
          </Field>
          <Field label={mine.role === "mentor" ? "회사" : "학교"}>
            {myAffiliation || "—"}
          </Field>
          <Field label={mine.role === "mentor" ? "직무 / 연차" : "전공 / 졸업"}>
            {myDetail || "—"}
          </Field>
          <Field label="관심 산업">
            {(myIndustries.length ? myIndustries.slice(0, 3).join(", ") : "—")}
          </Field>
          <Field label="언어">{(mine.languages || []).join(" · ") || "—"}</Field>
          {mine.role === "mentee" && (
            <Field label="타겟 마켓">
              {mine.mentee_target_market === "NA"
                ? "🇺🇸🇨🇦 North America"
                : mine.mentee_target_market === "KR"
                ? "🇰🇷 Korea"
                : mine.mentee_target_market === "EITHER"
                ? "🌐 둘 다 / 미정"
                : "—"}
            </Field>
          )}
          {mine.role === "mentor" && (
            <Field label="월 멘토링 가능">{mine.mentor_monthly_hours || "—"}시간</Field>
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <MiniKpi
          icon={Users}
          label="총 응답자"
          value={total}
          sub="현재 풀 크기"
          accent={BRAND.primary}
        />
        <MiniKpi
          icon={mine.role === "mentor" ? Briefcase : GraduationCap}
          label={`같은 ${mine.role === "mentor" ? "회사" : "학교"}`}
          value={sameSchoolOrCompanyCount}
          sub={myAffiliation ? `with you` : "—"}
          accent={BRAND.accent}
        />
        <MiniKpi
          icon={TrendingUp}
          label="같은 산업"
          value={sameIndustryCount}
          sub={`${(myIndustries[0] || "—")} 외`}
          accent={BRAND.warn}
        />
        <MiniKpi
          icon={Globe2}
          label={mine.role === "mentee" ? "매칭 가능 멘토" : "매칭 가능 멘티"}
          value={matchableMentors}
          sub="산업 일치 기준"
          accent="#3B82F6"
        />
      </div>

      {/* Segment distribution with mine highlighted */}
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold">전체 풀 — 세그먼트 분포</h3>
              <p className="text-xs text-brand-textDim mt-0.5">
                <span className="text-brand-primary font-semibold">{segLabel(mySeg)}</span> 그룹이
                강조되어 있어요
              </p>
            </div>
            <Sparkles size={14} className="text-brand-accent" />
          </div>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-xs text-brand-textDim">
              불러오는 중...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={segmentData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {segmentData.map((d, i) => (
                    <Cell
                      key={i}
                      fill={d.key === mySeg ? BRAND.primary : `${PALETTE[i % PALETTE.length]}55`}
                      stroke={BRAND.bg}
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<Tip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="text-center text-xs text-brand-textDim -mt-2">
            나의 세그먼트 인원: {segmentData.find((d) => d.key === mySeg)?.value || 0}명 / 전체 {total}명
          </div>
        </div>

        <div className="rounded-2xl border border-brand-border bg-brand-surface p-5">
          <div className="mb-3">
            <h3 className="text-sm font-semibold">전체 산업 분포 (Top 6)</h3>
            <p className="text-xs text-brand-textDim mt-0.5">
              내가 선택한 산업은 <span className="text-brand-primary font-semibold">초록색</span>
            </p>
          </div>
          {loading ? (
            <div className="h-[200px] flex items-center justify-center text-xs text-brand-textDim">
              불러오는 중...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={industryBar} layout="vertical" margin={{ left: 10, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BRAND.border} />
                <XAxis type="number" stroke={BRAND.textDim} fontSize={10} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke={BRAND.textDim}
                  fontSize={10}
                  width={110}
                />
                <Tooltip content={<Tip />} cursor={{ fill: `${BRAND.primary}1A` }} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {industryBar.map((d, i) => (
                    <Cell key={i} fill={d.mine ? BRAND.primary : BRAND.textDim + "55"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-2xl border border-brand-border bg-brand-surface p-6 mb-6">
        <div className="text-xs uppercase tracking-wider text-brand-textDim mb-4">
          📨 다음 단계
        </div>
        <ul className="space-y-3 text-sm">
          <Step icon={Mail}>
            매칭 결과는 <span className="text-brand-text">2주 이내</span>에 이메일로 안내드려요.
          </Step>
          <Step icon={Calendar}>
            응답이 충분히 모이면 PKNIC Mentoring 운영팀이 시즌 이벤트(워크샵·패널 등)를
            기획합니다. 응답자에게 우선 초대를 보내드려요.
          </Step>
          <Step icon={Sparkles}>
            응답을 수정하거나 삭제하려면 본 이메일로 운영팀에 회신해주세요. 즉시 처리됩니다.
          </Step>
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-ghost inline-flex items-center gap-2">
          홈으로 돌아가기
        </Link>
        <button
          type="button"
          onClick={() => navigator.share && navigator.share({ url: window.location.origin })}
          className="btn-primary inline-flex items-center gap-2"
        >
          친구에게 추천하기
        </button>
      </div>
    </div>
  );
}

const Field = ({ label, children }: any) => (
  <div>
    <div className="text-[11px] uppercase tracking-wider text-brand-textDim mb-1">{label}</div>
    <div className="text-sm text-brand-text">{children}</div>
  </div>
);

const MiniKpi = ({ icon: Icon, label, value, sub, accent }: any) => (
  <div className="rounded-xl p-4 border border-brand-border bg-brand-surface">
    <div className="flex items-center justify-between mb-2">
      <span className="text-[10px] uppercase tracking-wider text-brand-textDim">{label}</span>
      <Icon size={14} style={{ color: accent }} />
    </div>
    <div className="text-2xl font-semibold">{value}</div>
    {sub && <div className="text-[10px] text-brand-textDim mt-0.5 truncate">{sub}</div>}
  </div>
);

const Step = ({ icon: Icon, children }: any) => (
  <li className="flex gap-3 items-start">
    <div className="w-7 h-7 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon size={13} className="text-brand-primary" />
    </div>
    <span className="text-brand-textDim leading-relaxed">{children}</span>
  </li>
);
