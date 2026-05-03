import DashboardClient from "@/components/DashboardClient";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <nav className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm bg-gradient-to-br from-brand-primary to-brand-primaryDim text-brand-bg">PK</div>
          <div>
            <div className="text-sm font-semibold">PKNIC Mentoring</div>
            <div className="text-[10px] text-brand-textDim">Real-time Demand Dashboard</div>
          </div>
        </Link>
        <Link href="/survey" className="btn-ghost text-sm">설문 참여</Link>
      </nav>
      <DashboardClient />
    </main>
  );
}
