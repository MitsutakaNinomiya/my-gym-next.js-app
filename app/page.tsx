import { supabase } from "@/lib/supabaseClient";
import Link from "next/link"; 
import { DeleteButton } from "@/components/DeleteButton";

// Log型
type Log = {
  id:string;

  //ここは実際のカラムに合わせて増やしていけばOK
  created_at?: string;
  [key: string]: any;
  };


export default async function Home() {
  const { data: logs, error } = await supabase
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false });

  console.log("logs from supabase:", logs);
  console.log("supabase error:", error);

  if (error) {
    return (
      <main className="min-h-screen bg-gray-950 text-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4">筋トレログ</h1>
        <p className="text-red-500">データ取得に失敗しました。</p>
      </main>
    );
  }



  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      {/*ヘッダー・追加ボタン */}
    <header>
      <h1 className="text-2xl font-bold mb-6">
        筋トレログ(Supabaseから取得)
      </h1>

        <Link
          href="/logs/new" 
          className=" rounded-lg bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600 "
        >
          新規ログ追加
        </Link>
      </header>




      {/* ログ一覧 UI */}
      <section>
        <h2 className="text-lg font-semibold mb-4">ログ一覧</h2>

{/*logs が存在しない または logs が0件 のどちらかの場合、“まだログがありません” を表示する*/}
        {(!logs || logs.length === 0) && (            
          <p className="text-sm text-gray-400">まだログがありません</p>
        )}

        {/* grid（グリッドレイアウト）でカードを並べる */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {logs?.map((log: Log) => (
            <article
              key={log.id}
              className="rounded-xl border border-gray-800 bg-gray-900/70 p-4 shadow"
            >
              {/* 上段：日付とID */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>{log.date ?? "日付未入力"}</span>
                <span>ID: {log.id}</span>
              </div>

              {/* 中段：部位 / 種目 */}
              <p className="text-sm font-semibold">
                {log.part ?? "部位不明"} / {log.exercise ?? "種目不明"}
              </p>

              {/* 重量 × 回数 */}
              <p className="mt-1 text-sm">
                重量: {log.weight ?? "-"} kg × {log.reps ?? "-"} 回
              </p>

              {/* メモがあるときだけ表示（&& は「かつ」の意味でよく使われる） */}
              {log.memo && (
                <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
                  メモ: {log.memo}
                </p>
              )}
              {/*ボタンエリア*/}
              <div className="mt-4 flex justify-end gap-2">
              <Link
                href={`/logs/edit?id=${log.id}`}
                className="rounded-md border border-gray-600 px-3 py-1 text-xs text-gray-100 hover:bg-gray-700"
                >
                編集
              </Link>


              {/*削除機能*/}
                <DeleteButton id={log.id} />

              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
