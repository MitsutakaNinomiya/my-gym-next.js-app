import { supabase } from "@/lib/supabaseClient";

// Log型
type Log = {
  id:string;

  //ここは実際のカラムに合わせて増やしていけばOK
  created_at?: string;
  [key: string]: any;
  };


export default async function Home() {
  //supabaseからlogsテーブルを全部取得
  //from = どのテーブルから取るか
  //select = どのカラムを取るか　"*"は全部
  const { data: logs, error} = await supabase //awaitは時間のかかるネットワーク通信を待つために使う
    .from("logs")
    .select("*")
    .order("created_at", { ascending: false}); //新しい順に並べる

    console.log("logs from supabase:", logs);
  console.log("supabase error:", error);

  if(error) {
    console.log(error);
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-2xl font-bold mb-4">筋トレログ</h1>
        <p className="text-red-500">データ取得に失敗しました。</p>
      </main>
    );
  }


  return (
    <main className="min-h-screen p-8">
      <h1 className="test-2xl font-bold mb-4">筋トレログ(supabaseから取得)</h1>

      {/* 確認ゾーン */}
      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">生データ(JSON)</h2>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
          {JSON.stringify(logs, null, 2)}
        </pre>
      </section>

      {/* 一件ずつ表示してみる */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold mb-2">ログ一覧</h2>
        {(!logs || logs.length ===0 ) && (
          <p>まだログがありません</p>
        )}

        {logs?.map((log: Log) => ( // .?はエラーをスルーする  return の代わりにundefined が返る
          <div  
            key={log.id} 
            className="border border-gray-700 rounded-lg p-4"
          >
            <p className="text-xs text-gray-400 mb-1">
              ID:{log.id}
            </p>
            <p className="text-sm">
              {/*実際のカラム名に合わせて後で修正していく */}
              created_at: {log.created_at ?? "不明"}
            </p>
          </div>
        ))}
      
      </section>
    </main>
  )

}




// import App from "./App";    


// export default function Page() { 
//     return <App />;
  
// }