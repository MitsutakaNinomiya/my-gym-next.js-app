// app/logs/[date]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// 1セット=1行 のログの型
type LogRow = {
  id: string;
  date: string;
  exercise_id: string; // ベンチプレスなどの種目ID
  set_index: number;   // 何セット目か（1〜4）
  weight: number;
  reps: number;
  memo: string | null;
};


//ここに直接NextjsがURLで[date]で判断してくれて params: {date: "2025-12-08",} のオブジェクトを持ってきてくれる 
export default async function DailyLogsPage({ params }: { 
  params: Promise<{date: string}>;
}) { 
  const { date } = await params;

  // Supabase からこの日付のログを全部取得
  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .eq("date", date) // eq（イーキュー）= 「○○と等しい」（条件絞り込み）★4
    .order("exercise_id", { ascending: true })
    .order("set_index", { ascending: true });

  if (error) {
    // エラー時の表示
    return (
      <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-4">{date} の筋トレログ</h1>
        <p className="text-red-400 text-sm">
          ログの取得に失敗しました。
        </p>
      </main>
    );
  }

  // logs が null のときに備えて空配列にしておく
  const safeLogs: LogRow[] = (logs ?? []) as LogRow[];

  // 種目ごとにグループ分けする（exercise_id 単位でまとめる）★5
  const grouped: Record<string, LogRow[]> = {};
  safeLogs.forEach((log) => {
    if (!grouped[log.exercise_id]) {
      grouped[log.exercise_id] = [];
    }
    grouped[log.exercise_id].push(log);
  });

  // オブジェクト -> [ [exercise_id, LogRow[]], ... ] に変換
  const entries = Object.entries(grouped);
  // entries = [ ["bench_press", [LogRow, LogRow...]], ["lat_pull_down", [...]], ... ]

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      {/* ヘッダー */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{date} の筋トレログ</h1>
          <p className="text-xs text-gray-400">
            この日に記録した種目とセットの一覧です。
          </p>
        </div>

        {/* いったんトップへのリンク（あとでカレンダーに差し替え可） */}
        <Link
          href="/"
          className="text-m text-gray-300  underline-offset-2 rounded   hover:bg-emerald-600"
        >
          戻る
        </Link>
      </header>

      {/* ログがない場合 */}
      {entries.length === 0 && (
        <p className="text-sm text-gray-400">
          まだこの日には記録がありません。右下の「＋」から追加できます。
        </p>
      )}

      {/* 種目ごとのカード一覧 */}
      <section className="mt-4 space-y-4">
        {entries.map(([exerciseId, rows]) => (
          <article
            key={exerciseId}
            className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow"
          >
            {/* 種目名部分：今は exercise_id をそのまま表示（あとで日本語名にしてもOK） */}
            <h2 className="text-base font-semibold mb-2">
              種目: {exerciseId}
            </h2>

            {/* セット一覧 */}
            <ul className="space-y-1 text-sm">
              {rows.map((row) => (
                <li key={row.id}>
                  {row.set_index}. {row.weight}kg × {row.reps}回
                  {row.memo && (
                    <span className="text-xs text-gray-300 ml-2">
                      （{row.memo}）
                    </span>
                  )}
                </li>
              ))}
            </ul>

            {/* 種目記録画面へのリンク（あとで本物のURLに差し替える） */}
            <div className="mt-3 text-right">
              <Link
                href={`/logs/${date}/${exerciseId}`}
                className="text-xs text-emerald-400 underline underline-offset-2"
              >
                この種目を編集する（仮リンク）
              </Link>
            </div>
          </article>
        ))}
      </section>

      {/* 右下の＋ボタン（種目追加用・今はリンク先だけ用意） */}
      <Link
        href={`/logs/${date}/select`} // ← まだページがなくてもOK。あとで作る。
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl font-bold text-white shadow-lg hover:bg-emerald-600"
      >
        +
      </Link>
    </main>
  );
}
