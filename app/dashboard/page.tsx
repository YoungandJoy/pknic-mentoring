import DashboardClient from "@/components/DashboardClient";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm bg-gradient-to-br from-brand-primary to-brand-primaryDim text-brand-bg">
            PK
          </div>
          <div>
            <div className="text-sm font-semibold flex items-center gap-2">
              PKNIC Mentoring
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-warn/15 text-brand-warn border border-brand-warn/30">
                <ShieldCheck size={10} /> ADMIN
              </span>
            </div>
            <div className="text-[10px] text-brand-textDim">
              운영자 전용 · 응답 풀 분석 대시보드
            </div>
          </div>
        </Link>
        <Link href="/survey" className="btn-ghost text-sm">
          설문 페이지로
        </Link>
      </nav>
      <DashboardClient />
    </main>
  );
}
