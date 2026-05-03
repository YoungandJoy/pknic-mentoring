import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PKNIC Mentoring — Don't navigate your career alone. Design it together.",
  description:
    "북미 거주 현직 직장인이 북미·한국 학생들과 1:1로 매칭되어 커리어 로드맵을 함께 설계하는 멘토링 프로그램.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
