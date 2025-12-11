// app/logs/page.tsx

import Link from "next/link";

export default function LogsMenu() {
  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-4">筋トレログ</h1>

      <Link
        href={`/logs/${new Date().toISOString().slice(0, 10)}`}
        className="block rounded-lg bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-600"
      >
        今日の記録を見る
      </Link>

      <p className="text-xs text-gray-400 mt-4">
        ※ 履歴・カレンダーは後で正式に作成します。
      </p>
    </main>
  );
}
