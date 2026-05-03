import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PKNIC × KOTRA Mentoring Program",
  description: "한국-파키스탄 ICT/스타트업 멘토링 프로그램 수요조사 및 매칭 대시보드",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
