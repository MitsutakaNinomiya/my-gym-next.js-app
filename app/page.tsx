// カレンダーのサーバー側　Server Component
import { supabase } from "@/lib/supabaseClient";
import CalendarClient from "./CalendarClient";

export default async function Page() { //サーバー側でデータ取りに行くので、async/awaitを使う
  const { data, error } = await supabase  //supabaseは{data:"...",error:"..."} が返って来る。
  .from("logs")  
  .select("date"); // logsテーブルからdate列だけ取る。 select("*")にしないのは通信料やバグリスクを考えている。 必要最低限の物だけを取り出すことを意識。

  if (error) {
    return <div className="p-6">取得エラー</div>;
  }

  //dataを１行ずつStringで文字列に変換、slice(0,10)で先頭から10文字だけを切り取り整形("YYYY-MM-DD")　markedDateは["2025-12-14", "2025-12-13", ...] みたいな「日付文字列の配列」になる。
  const markedDates = (data ?? []).map((row) => String(row.date).slice(0, 10)); //(data ?? [])はdataがnull/undefinedであれば空配列　dataが無い時でも.mapで落ちないようにする保険


  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-4">筋トレLog App</h1>
        <div className="mx-auto max-w-md">
          <CalendarClient markedDates={markedDates} />
        </div>
    </main>
  );
}
