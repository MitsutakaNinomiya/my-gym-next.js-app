// app/logs/[date]/[exerciseId]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { AddSetForm } from "./AddSetForm"; // ← 追加 ★3

type LogRow = {
  id: string;
  date: string;
  exercise_id: string;
  set_index: number;
  weight: number;
  reps: number;
  memo: string | null;
};

type ExerciseLogsPageProps = {
  params: {
    date: string;
    exerciseId: string;
  };
};

export default async function ExerciseLogsPage({
  params,
}: ExerciseLogsPageProps) {
  const { date, exerciseId } = params;

  const { data, error } = await supabase
    .from("logs")
    .select("*")
    .eq("date", date)
    .eq("exercise_id", exerciseId)
    .order("set_index", { ascending: true });

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-4">
          {date} / {exerciseId} のログ
        </h1>
        <p className="text-red-400 text-sm">ログの取得に失敗しました。</p>
      </main>
    );
  }

  const logs: LogRow[] = (data ?? []) as LogRow[];

  // 次に追加するセット番号（1,2,3...）★3
  const nextSetIndex = logs.length + 1;

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      {/* ヘッダー */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {date} の {exerciseId} ログ
          </h1>
          <p className="text-xs text-gray-400">
            この日付の、この種目のセット一覧です。
          </p>
        </div>

        <Link
          href={`/logs/${date}`}
          className="text-xs text-gray-300 underline underline-offset-2"
        >
          {date} のログ一覧に戻る
        </Link>
      </header>

      {/* ログがない場合 */}
      {logs.length === 0 && (
        <p className="text-sm text-gray-400">
          まだこの種目の記録はありません。
        </p>
      )}

      {/* セット一覧 */}
      {logs.length > 0 && (
        <section className="mt-4 space-y-2">
          <ul className="space-y-1 text-sm">
            {logs.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-gray-800 bg-gray-900/70 px-4 py-2"
              >
                <div>
                  セット {row.set_index}: {row.weight}kg × {row.reps}回
                </div>
                {row.memo && (
                  <div className="text-xs text-gray-300 mt-1">
                    メモ: {row.memo}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* セット追加フォームをここに表示 */}
      <AddSetForm
        date={date}
        exerciseId={exerciseId}
        nextSetIndex={nextSetIndex}
      />
    </main>
  );
}
