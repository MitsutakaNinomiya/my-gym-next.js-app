// app/layout.tsx

import type { Metadata } from "next"; // Metadata: メタデータ（ページ情報）
import "./globals.css";
import Link from "next/link"; // Link: Next.js専用のリンクコンポーネント

export const metadata: Metadata = {
  // metadata: ページ全体のタイトルや説明をNextに教えるオブジェクト
  title: "My Gym Log",
  description: "筋トレ記録アプリ（Next.js版）",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // children: 子コンポーネント（各ページ）の中身
}) {
  return (
    <html lang="ja">
      <body className="bg-slate-950 text-slate-50">
        {/* 共通ヘッダー */}
        <header className="border-b border-slate-800 bg-slate-900/80">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <div className="font-bold tracking-tight">My Gym Log</div>

            {/* ナビゲーション */}
            <nav className="flex gap-4 text-sm">
              <Link
              href={`/`}
              >
                カレンダー
              </Link>


            </nav>
          </div>
        </header>




        {/* 各ページの中身がここに入る */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
