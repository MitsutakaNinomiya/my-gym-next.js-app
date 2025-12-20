// app/logs/[date]/[exerciseId]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { AddSetForm } from "./AddSetForm";
import { EditSetRow } from "./EditSetRow";

// 1セット分の型
type LogRow = {
  id: string;
  date: string;
  exercise_id: string;
  set_index: number;
  weight: number;
  reps: number;
  memo: string | null;
};

// params は Promise　で来るので await が必要　　
export default async function ExerciseLogsPage({ params }: { //page.tsxは Next.jsの仕様でdefault export　が必須
  params: Promise<{ date: string; exerciseId: string }>;
}) {
  // URLパラメータ取得し、date と exerciseId に分解 　　paramsの中身は　{ date: string; exerciseId: string }　
  const { date, exerciseId} = await params;

  // 今日のこの種目のログを取得
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

  //合計ボリューム　reduceの初期値が0になるので、
  const totalVolume = logs.reduce((sum,row) => sum + row.weight*row.reps,0);


  // 次に追加するセット番号（1,2,3...）
  const nextSetIndex = logs.length + 1;

  // ② 前回の記録（Last Record）用に過去ログを取得
  const { data: pastData, error: pastError } = await supabase
    .from("logs")
    .select("*")
    .eq("exercise_id", exerciseId) // 同じ種目
    .lt("date", date) // 今日より前の日付だけ（lt = less than = より小さい）
    .order("date", { ascending: false }) // 日付の新しい順
    .order("set_index", { ascending: true }); // 同じ日の中ではセット順

  if (pastError) {
    console.error("LastRecord取得エラー:", pastError);
  }

  const pastLogs: LogRow[] = (pastData ?? []) as LogRow[];

  // 一番新しい「過去の日付」を特定
  let lastDate: string | null = null; // null可能性ありとすることで、まだ過去ログがない場合でもバグが発生しないようにする
  let lastLogs: LogRow[] = [];  // lastDateの日付ログだけを入れる配列　　//let は後に値が変更する可能性があるので、constではなくletで宣言

  if (pastLogs.length > 0) {
    lastDate = pastLogs[0].date; // 一番新しい日付
    lastLogs = pastLogs.filter((row) => row.date === lastDate);
  }


  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      {/* ヘッダー */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {date}  {exerciseId} 
          </h1>
          <p className="text-xs text-gray-400">
            この日付の、この種目のセット一覧です。
          </p>
        </div>

        <Link
          href={`/logs/${date}`}
          className="inline-flex items-center gap-1.5
            rounded-md
            border border-emerald-500/40
            bg-emerald-900/30 px-3 py-1.5
            text-xs font-medium text-emerald-200
            hover:bg-emerald-800/40
            active:scale-95
            transition"
        >
          {date} のログ一覧に戻る
        </Link>
      </header>

      {/* ③ Last Record（前回の記録） */}
      {lastLogs.length > 0 && lastDate && ( // lastLogsが空でなく、lastDateがnullでない場合に表示
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-1">Last Record</h2>
          <p className="text-xs text-gray-400 mb-1">{lastDate}</p>
          <p className="text-sm">
            {lastLogs.map((row, index) => (
              <span key={row.id}>
                {row.weight}kg × {row.reps}回
                {index !== lastLogs.length - 1 && " / "}
              </span>
            ))}
          </p>
        </section>
      )}
      

            {/* セット追加フォーム */}
      <AddSetForm
        date={date}
        exerciseId={exerciseId}
        nextSetIndex={nextSetIndex}
        totalVolume= {totalVolume}
      />


      
      

      {/* 今日のセット一覧（編集付き） */}
      {logs.length > 0 && ( //今日のログが1件以上ある場合に表示
        <section className="mt-2 space-y-2">
          <ul className="space-y-1 text-sm">
            {logs.map((row) => (
              <EditSetRow
                key={row.id}
                id={row.id}
                setIndex={row.set_index}
                defaultWeight={row.weight}
                defaultReps={row.reps}
                defaultMemo={row.memo}
              />
            ))}
          </ul>
        </section>
      )}

      
    
      
      


      

            {/* 今日のログがない場合 */}
      {logs.length === 0 && (
        <p className="text-sm text-gray-400 mb-2">
          まだこの日の記録はありません。
        </p>
      )}


    </main>
  );
}
