import Link from "next/link";
import { ArrowRight, GraduationCap, Briefcase, ClipboardList, BarChart3, Sparkles } from "lucide-react";

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
            <a href="#programs" className="hover:text-brand-text">Programs</a>
            <a href="#how" className="hover:text-brand-text">How It Works</a>
            <a href="#data" className="hover:text-brand-text">Your Data</a>
            <a href="#faq" className="hover:text-brand-text">FAQ</a>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/survey"
              className="text-sm font-semibold px-4 py-2 rounded-full bg-brand-primary text-brand-bg hover:opacity-90 transition"
            >
              설문 참여 →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-primary bg-brand-primary/10 border border-brand-primary/30 rounded-full px-3 py-1.5 mb-6">
          <Sparkles size={12} /> 2026 시즌 수요조사 진행중 · 5분 소요
        </div>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight mb-6">
          Don&apos;t navigate your career alone.
          <br />
          <span className="bg-gradient-to-r from-brand-primary to-brand-accent bg-clip-text text-transparent">
            Design it together.
          </span>
        </h1>
        <p className="text-base md:text-lg text-brand-textDim max-w-2xl mx-auto leading-relaxed mb-3">
          PKNIC Mentoring은 북미 거주 현직 시니어와 북미·한국 학생을 1:1로 잇는 멘토링
          프로그램입니다.
        </p>
        <p className="text-sm md:text-base text-brand-textDim max-w-2xl mx-auto leading-relaxed mb-10">
          본 페이지는 <span className="text-brand-primary font-semibold">2026 시즌 수요조사</span>를
          위한 공간이에요. 5분 설문에 참여하시면 운영팀이 멘토 풀·산업 분포·시간대를 분석해 본
          시즌의 매칭과 이벤트를 설계합니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/survey" className="btn-primary inline-flex items-center gap-2 text-base">
            지금 설문 참여하기 <ArrowRight size={16} />
          </Link>
          <a href="#how" className="btn-ghost inline-flex items-center gap-2">
            How it works
          </a>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="max-w-5xl mx-auto px-6 pb-24 grid md:grid-cols-2 gap-5 scroll-mt-20">
        <div className="md:col-span-2 mb-2">
          <h2 className="text-2xl font-bold mb-2">두 개의 프로그램</h2>
          <p className="text-sm text-brand-textDim">
            대상에 맞는 프로그램을 선택하시면 설문에서 자동으로 해당 트랙으로 안내됩니다.
          </p>
        </div>

        {/* Active program */}
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-7 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-brand-primary/15 flex items-center justify-center mb-5">
              <GraduationCap size={20} className="text-brand-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-brand-primary">Mentorship for Students</h3>
            <p className="text-sm text-brand-textDim leading-relaxed mb-6">
              북미·한국 학생을 위한 1:1 시니어 멘토링. 진로 탐색부터 인턴십·풀타임 취업까지
              북미 현직 시니어와 함께 설계합니다.
              <br />
              <span className="text-brand-text/80">
                Design your first career step with industry seniors.
              </span>
            </p>
            <Link
              href="/survey?program=students"
              className="inline-flex items-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-xl border border-brand-border bg-brand-surface2 hover:border-brand-primary hover:text-brand-primary transition"
            >
              학생 설문 참여 <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Coming soon */}
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-7 relative">
          <span className="absolute top-5 right-5 text-[10px] font-bold tracking-wider px-2 py-1 rounded-full bg-brand-primary/15 text-brand-primary border border-brand-primary/30">
            COMING SOON
          </span>
          <div className="w-11 h-11 rounded-xl bg-brand-textDim/10 flex items-center justify-center mb-5">
            <Briefcase size={20} className="text-brand-textDim" />
          </div>
          <h3 className="text-xl font-bold mb-2">Career Strategy for Professionals</h3>
          <p className="text-sm text-brand-textDim leading-relaxed mb-6">
            주니어~시니어 직장인을 위한 커리어 전략 자문. 이직·리더십 전환·창업까지 다음 한
            발을 함께 설계합니다. 곧 오픈됩니다.
            <br />
            <span className="text-brand-textDim/80">
              Navigate career pivots, leadership transitions, and strategic growth.
            </span>
          </p>
          <Link
            href="/survey?program=professionals"
            className="inline-flex items-center gap-2 text-sm font-medium py-2.5 px-5 rounded-xl border border-brand-border text-brand-textDim hover:border-brand-primary/50 hover:text-brand-text transition"
          >
            관심 등록 (사전 설문) <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-5xl mx-auto px-6 pb-24 scroll-mt-20">
        <h2 className="text-2xl font-bold mb-2 text-center">How it works</h2>
        <p className="text-sm text-brand-textDim text-center mb-10">
          설문이 어떻게 활용되는지 한눈에 보여드립니다.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              icon: ClipboardList,
              step: "01 · 설문 (5분)",
              title: "수요조사 응답",
              desc: "산업·직무·타겟 마켓·시간대·언어 등 매칭에 필요한 정보를 답합니다. 응답은 Supabase에 즉시 저장돼요.",
            },
            {
              icon: BarChart3,
              step: "02 · 즉시 시각화",
              title: "본인 위치 확인",
              desc: "제출 직후 본인 프로필 요약 + 전체 풀에서의 위치(같은 산업/학교/세그먼트 인원수)를 미니 차트로 보여드립니다.",
            },
            {
              icon: Sparkles,
              step: "03 · 매칭 설계",
              title: "운영팀의 후속 작업",
              desc: "운영팀은 응답 풀을 분석해 멘토-멘티 매칭, 이벤트, 추가 모집 우선순위를 결정합니다. 매칭 결과는 이메일로 공지.",
            },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-brand-border bg-brand-surface p-6">
              <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4">
                <s.icon size={18} className="text-brand-primary" />
              </div>
              <div className="text-[11px] font-bold text-brand-primary tracking-wider mb-2">
                {s.step}
              </div>
              <div className="font-semibold mb-2">{s.title}</div>
              <div className="text-sm text-brand-textDim leading-relaxed">{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Your data */}
      <section id="data" className="max-w-5xl mx-auto px-6 pb-24 scroll-mt-20">
        <div className="rounded-2xl border border-brand-border bg-brand-surface p-7">
          <h2 className="text-2xl font-bold mb-2">Your data — 응답은 어디로 가나요?</h2>
          <p className="text-sm text-brand-textDim leading-relaxed mb-5">
            투명하게 안내드립니다. PKNIC Mentoring은 응답 데이터를 매칭·통계 분석 외 목적으로
            사용하지 않습니다.
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-brand-border bg-brand-surface2 p-4">
              <div className="font-semibold mb-2 text-brand-primary">저장 위치</div>
              <p className="text-brand-textDim leading-relaxed">
                응답은 Supabase Postgres(Asia-Pacific 리전)에 RLS 정책으로 보호되어 저장됩니다.
                운영팀만 전체 풀에 접근 가능합니다.
              </p>
            </div>
            <div className="rounded-xl border border-brand-border bg-brand-surface2 p-4">
              <div className="font-semibold mb-2 text-brand-primary">응답자에게 보여지는 것</div>
              <p className="text-brand-textDim leading-relaxed">
                본인이 입력한 정보 요약 + 전체 풀에서 본인 세그먼트(같은 산업·학교·연차) 분포만
                보여드립니다. 다른 응답자의 개인정보는 노출되지 않습니다.
              </p>
            </div>
            <div className="rounded-xl border border-brand-border bg-brand-surface2 p-4">
              <div className="font-semibold mb-2 text-brand-primary">운영팀 대시보드</div>
              <p className="text-brand-textDim leading-relaxed">
                실시간 분석 대시보드는 관리자 비밀번호로 보호됩니다. 매칭 결정·이벤트 기획에만
                사용됩니다.
              </p>
            </div>
            <div className="rounded-xl border border-brand-border bg-brand-surface2 p-4">
              <div className="font-semibold mb-2 text-brand-primary">파기·수정 요청</div>
              <p className="text-brand-textDim leading-relaxed">
                본인 응답 삭제·수정을 원하시면 응답 시 입력한 이메일로 운영팀에 회신해주세요.
                즉시 처리됩니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="max-w-5xl mx-auto px-6 pb-24 text-center">
        <div className="rounded-2xl border border-brand-primary/30 bg-gradient-to-br from-brand-primary/10 to-brand-accent/5 p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">5분이면 충분합니다</h2>
          <p className="text-brand-textDim mb-6">
            응답이 쌓일수록 더 정확한 매칭과 풍부한 이벤트가 가능해집니다.
          </p>
          <Link href="/survey" className="btn-primary inline-flex items-center gap-2 text-base">
            지금 설문 참여하기 <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-brand-border py-8 text-center text-xs text-brand-textDim">
        © 2026 PKNIC Mentoring · Connecting NA-based seniors with NA &amp; Korea students
      </footer>
    </main>
  );
}
