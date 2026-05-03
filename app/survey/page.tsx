import SurveyForm from "@/components/SurveyForm";
import Link from "next/link";
import { Suspense } from "react";

export default function SurveyPage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <nav className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="font-semibold">
          <span className="text-brand-text">PKNIC</span>{" "}
          <span className="text-brand-textDim">Mentoring</span>
        </Link>
        <Link href="/" className="text-xs text-brand-textDim hover:text-brand-text">
          ← 홈
        </Link>
      </nav>
      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto px-6 py-20 text-center text-brand-textDim text-sm">
            로딩 중...
          </div>
        }
      >
        <SurveyForm />
      </Suspense>
    </main>
  );
}
