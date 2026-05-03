import Link from "next/link";
import { ArrowRight, Sparkles, Users, Target } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      {/* Nav */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base bg-gradient-to-br from-brand-primary to-brand-primaryDim text-brand-bg">PK</div>
          <div>
            <div className="text-sm font-semibold">PKNIC × KOTRA</div>
            <div className="text-xs text-brand-textDim">Mentoring Program</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/dashboard" className="text-sm text-brand-textDim hover:text-brand-text transition px-3 py-2">대시보드</Link>
          <Link href="/survey" className="btn-primary text-sm">설문 참여 →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-primary bg-brand-primary/10 border border-brand-primary/30 rounded-full px-3 py-1.5 mb-6">
          <Sparkles size={12} /> 2026 수요조사 진행중
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
          한국 ↔ 파키스탄
          <br />
          <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">ICT 멘토링</span>으로 연결합니다
        </h1>
        <p className="text-lg text-brand-textDim max-w-2xl mb-8 leading-relaxed">
          PKNIC과 KOTRA가 함께 만드는 한-파 ICT/스타트업 멘토링 프로그램. 5분의 설문이
          당신과 가장 맞는 멘토 또는 멘티를 찾아드립니다.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/survey" className="btn-primary inline-flex items-center gap-2">
            지금 참여하기 <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className="btn-ghost inline-flex items-center gap-2">
            실시간 현황 보기
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-4">
        {[
          { icon: Users, title: "1:1 매칭", desc: "산업·직무·연차·시간대를 고려한 가중치 기반 매칭 알고리즘" },
          { icon: Target, title: "양방향 진출 지원", desc: "한국→파키스탄, 파키스탄→한국 모든 방향의 비즈니스 협력" },
          { icon: Sparkles, title: "공신력", desc: "PKNIC + KOTRA 협업으로 검증된 멘토 풀과 후속 프로그램 연계" },
        ].map((f, i) => (
          <div key={i} className="rounded-2xl border border-brand-border bg-brand-surface p-6">
            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
              <f.icon size={18} className="text-brand-primary" />
            </div>
            <div className="font-semibold mb-1.5">{f.title}</div>
            <div className="text-sm text-brand-textDim leading-relaxed">{f.desc}</div>
          </div>
        ))}
      </section>

      <footer className="border-t border-brand-border py-8 text-center text-xs text-brand-textDim">
        © 2026 PKNIC Mentoring Program · Powered by Next.js + Supabase + Vercel
      </footer>
    </main>
  );
}
