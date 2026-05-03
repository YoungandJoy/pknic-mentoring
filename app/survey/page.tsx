import SurveyForm from "@/components/SurveyForm";
import Link from "next/link";

export default function SurveyPage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm bg-gradient-to-br from-brand-primary to-brand-primaryDim text-brand-bg">PK</div>
          <span className="text-sm font-semibold">PKNIC Mentoring</span>
        </Link>
        <Link href="/" className="text-xs text-brand-textDim hover:text-brand-text">← 홈</Link>
      </nav>
      <SurveyForm />
    </main>
  );
}
