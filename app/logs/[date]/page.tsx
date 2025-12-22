// app/logs/[date]/page.tsx

import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

// ログ１行分の型定義
type LogRow = {
  id: string;
  date: string;
  exercise_id: string;
  set_index: number;   //何セット目か
  weight: number;
  reps: number;
  memo: string | null;
};


// URLに含まれる[date]パラメータをparamsが受け取り、ページ内で使えるようにする 
export default async function DailyLogsPage({ params }: {  // paramsはどこから来る？ → Next.jsのルーティング機能によって、自動的に渡される。 
  params: Promise<{date: string}>; // URLパラメータの型定義  
}) { 
  const { date } = await params; // URLパラメータから日付を取得     //awaitは非同期処理の完了を待つために使う

  // Supabase からこの日付のログを全部取得
  const { data: logs, error } = await supabase 
    .from("logs")
    .select("*")
    .eq("date", date) // eq（イーキュー）= 「○○と等しい」（条件絞り込み）★4
    .order("exercise_id", { ascending: true })
    .order("set_index", { ascending: true });

  if (error) {
    console.error("ログ取得エラー:", error);
    return (
      <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
        <h1 className="text-2xl font-bold mb-4">{date} の筋トレログ</h1>
        <p className="text-red-400 text-sm">
          ログの取得に失敗しました。
        </p>
      </main>
    );
  }

  // supabaseで取得したlogsがnull/undefinedの場合でも落ちないように、logs ?? [] で空配列を代入する
  const safeLogs: LogRow[] = (logs ?? []) as LogRow[]; //logs ?? [] は、logsがnullまたはundefinedの場合に空配列[]を代わりに使う。 as LogRow[] は型アサーションで、safeLogsがLogRow型の配列であることをTypeScriptに伝える。

  // 種目ごとにグループ分けする（exercise_id 単位でまとめる）
  const grouped: Record<string, LogRow[]> = {}; // Record<キーの型, 値の型> は、キーがstring型で値がLogRow型の配列であるオブジェクトを表す　
  safeLogs.forEach((log) => {                   // ↑ キーとしてexercise_idを使うのでstring型 何故キーがexercise_id？ → 種目ごとにまとめたいから
    if (!grouped[log.exercise_id]) {  
      grouped[log.exercise_id] = []; // まだその種目がなければ空配列を作成
    }
    grouped[log.exercise_id].push(log); // その種目の配列にログ行を追加
  }); 

  // オブジェクト  [ [exercise_id, LogRow[]], ... ] に変換. Object.entries()は静的メソッドで、与えられたobjectが所有する、文字列をキーとするすべての列挙可能なプロパティのキーと値のペアを配列の形で返す。
  const entries = Object.entries(grouped);  // key: exercise_id, value: LogRow[][] (LogRow配列の配列)に変換
  // entries: groupedオブジェクトの各キーと値のペアを配列の形で取得する。
  // [ ["bench_press", [LogRow, LogRow...]], ["lat_pull_down", [...]], ... ]


  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      {/* ヘッダー */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">{date} </h1>
          <p className="text-xs text-gray-400">
            この日に記録した種目とセットの一覧です。 
          </p>
        </div>

        {/*トップへのリンク */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5
            rounded-md
            border border-emerald-500/40
            bg-emerald-900/30 px-3 py-1.5
            text-xs font-medium text-emerald-200
            hover:bg-emerald-800/40
            active:scale-95
            transition"
        >
          ← 戻る
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
        {entries.map(([exerciseId, rows]) => ( // rowsはその種目のLogRow配列 [bench_press, [row1, row2,...]←これがrows]
          <article
            key={exerciseId}
            className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow"
          >
            {/* 種目名部分 */}
            <h2 className="text-base font-semibold mb-2">
              種目: {exerciseId}
            </h2>

            {/* セット一覧 */}
            <ul className="space-y-1 text-sm">
              {rows.map((row) => (
                <li key={row.id}>
                  {row.set_index}. {row.weight}kg × {row.reps}回 
                  {row.memo && (  //&&(): それがtrueの場合に次の部分を処理する。　
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
                className="inline-flex items-center gap-1.5
                  rounded-md
                  border border-emerald-500/40
                  bg-emerald-900/30 px-3 py-1.5
                  text-xs font-medium text-emerald-200
                  hover:bg-emerald-800/40
                  active:scale-95
                  transition"
              >
                この種目を編集する
              </Link>
            </div>
          </article>
        ))}
      </section>

      <Link 
        href={`/logs/${date}/select`} 
        className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-2xl font-bold text-white shadow-lg hover:bg-emerald-600"
      >
        +
      </Link>
    </main>
  );
}
