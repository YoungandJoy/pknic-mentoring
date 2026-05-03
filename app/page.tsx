import Link from "next/link";
import { ArrowRight, GraduationCap, Briefcase } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      {/* Top nav */}
      <nav className="border-b border-white/5 bg-white/[0.02] backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold tracking-tight">
            <span className="text-brand-text">PKNIC</span>{" "}
            <span className="text-brand-textDim">Mentoring</span>
          </Link>
          <div className="hidden md:flex items-center gap-7 text-sm text-brand-textDim">
            <span className="hover:text-brand-text cursor-default">Programs</span>
            <span className="hover:text-brand-text cursor-default">Find a Mentor</span>
            <span className="hover:text-brand-text cursor-default">Events &amp; Talks</span>
            <span className="hover:text-brand-text cursor-default">Support</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-sm text-brand-textDim hover:text-brand-text px-3 py-2">
              Dashboard
            </Link>
            <Link
              href="/survey"
              className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-primary text-brand-bg hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          Don&apos;t navigate your career alone.
          <br />
          <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            Design it together.
          </span>
        </h1>
        <p className="text-base md:text-lg text-brand-textDim max-w-2xl mx-auto leading-relaxed mb-10">
          Turn uncertainty into clarity with a practical, actionable career roadmap.
          <br />
          북미 현직 시니어와 1:1 매칭을 통해 다음 커리어 한 발을 함께 설계합니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/survey" className="btn-primary inline-flex items-center gap-2">
            Get Started <ArrowRight size={16} />
          </Link>
          <Link href="/dashboard" className="btn-ghost inline-flex items-center gap-2">
            View Live Demand
          </Link>
        </div>
      </section>

      {/* Two programs */}
      <section className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-5">
        {/* Active program */}
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-7 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-brand-primary/15 flex items-center justify-center mb-5">
              <GraduationCap size={20} className="text-brand-primary" />
            </div>
            <h2 className="text-xl font-bold mb-2 text-brand-primary">Mentorship for Students</h2>
            <p className="text-sm text-brand-textDim leading-relaxed mb-6">
              Design your first career step with industry seniors. Get matched with a consistent
              mentor for real-world growth and guidance.
              <br />
              <span className="text-brand-text/80">
                북미·한국 학생을 위한 1:1 시니어 멘토링 — 진로 탐색부터 인턴십·풀타임 취업까지.
              </span>
            </p>
            <Link
              href="/survey?program=students"
              className="inline-flex items-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-xl border border-brand-border bg-brand-surface2 hover:border-brand-primary hover:text-brand-primary transition"
            >
              Start as Student <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Coming soon */}
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-7 relative opacity-70">
          <span className="absolute top-5 right-5 text-[10px] font-bold tracking-wider px-2 py-1 rounded-full bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
            COMING SOON
          </span>
          <div className="w-11 h-11 rounded-xl bg-brand-textDim/10 flex items-center justify-center mb-5">
            <Briefcase size={20} className="text-brand-textDim" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-brand-textDim">
            Career Strategy for Professionals
          </h2>
          <p className="text-sm text-brand-textDim leading-relaxed mb-6">
            Navigate career pivots, leadership transitions, and strategic growth. Establish your
            presence as an industry leader or design your next big move.
            <br />
            <span className="text-brand-textDim/80">
              주니어~시니어 직장인을 위한 커리어 전략 자문 — 곧 오픈됩니다.
            </span>
          </p>
          <button
            disabled
            className="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-5 rounded-xl border border-brand-border text-brand-textDim cursor-not-allowed"
          >
            Start as Professional
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold mb-10 text-center">How matching works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "5분 설문",
              desc: "산업·직무·타겟 마켓·시간대·언어 등 매칭에 필요한 정보를 답합니다.",
            },
            {
              step: "02",
              title: "가중치 매칭",
              desc: "산업 일치, 직무 적합성, 시간대, 멘토 시니어리티를 종합 점수화합니다.",
            },
            {
              step: "03",
              title: "1:1 시작",
              desc: "2주 이내 매칭 결과 안내 — 첫 세션부터 정기 미팅까지 운영팀이 지원합니다.",
            },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-brand-border bg-brand-surface p-6">
              <div className="text-xs font-bold text-brand-primary tracking-wider mb-3">{s.step}</div>
              <div className="font-semibold mb-2">{s.title}</div>
              <div className="text-sm text-brand-textDim leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-brand-border py-8 text-center text-xs text-brand-textDim">
        © 2026 PKNIC Mentoring · Connecting NA-based seniors with NA &amp; Korea students
      </footer>
    </main>
  );
}
