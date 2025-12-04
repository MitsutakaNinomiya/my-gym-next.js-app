// app/logs/edit/EditLogClient.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Log型（1件分のトレーニングログ）
type Log = {
  id: string;
  part: string;
  exercise: string;
  weight: number;
  reps: number;
  date: string;
  text: string;
  memo: string;
};

// ページ本体（クライアントコンポーネント）
export function EditLogClient() {
  const router = useRouter();
  const searchParams = useSearchParams(); // URLの ?id= を読むフック
  const id = searchParams.get("id");      // 例: /logs/edit?id=XXXX から "XXXX" を取る

  // 取得したログデータ
  const [log, setLog] = useState<Log | null>(null);       
  const [loading, setLoading] = useState(true);           
  const [error, setError] = useState<string | null>(null); 

  // フォーム用 state
  const [part, setPart] = useState<string>("");         
  const [exercise, setExercise] = useState<string>(""); 
  const [weight, setWeight] = useState<string>("");     
  const [reps, setReps] = useState<string>("");         
  const [date, setDate] = useState<string>("");         
  const [memo, setMemo] = useState<string>("");        

  // ① id があれば supabase から1件取得
  useEffect(() => {
    if (!id) return; // id がないときは何もしない

    const fetchLog = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("logs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
        setError("データの取得に失敗しました");
      } else {
        setLog(data as Log);
      }

      setLoading(false);
    };

    fetchLog();
  }, [id]);

  // ② log が取れたら、それをフォーム用 state に流し込む
  useEffect(() => {
    if (!log) return;

    setPart(log.part);
    setExercise(log.exercise);
    setWeight(String(log.weight));
    setReps(String(log.reps));
    setDate(log.date);
    setMemo(log.memo);
  }, [log]);

  // ------- 表示パート（JSX） -------

  if (!id) {
    return <div>URL に id がついていません。</div>;
  }

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;
  if (!log) return <div>データが見つかりませんでした。</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">ログ編集ページ</h1>
      <p className="text-xs text-gray-400 mb-4">ID: {log.id}</p>

      <form
        className="space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();

          if (!id) return;

          const { error } = await supabase
            .from("logs")
            .update({
              part,
              exercise,
              weight: Number(weight),
              reps: Number(reps),
              date,
              memo,
            })
            .eq("id", id);

          if (error) {
            console.error(error);
            alert("更新に失敗しました");
            return;
          }

          alert("更新完了");
          router.push("/"); // 一覧に戻る
        }}
      >
        <div>
          <label className="block text-sm mb-1">
            部位:
            <input
              type="text"
              value={part}
              onChange={(e) => setPart(e.target.value)}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">
            種目:
            <input
              type="text"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">
            重量(kg):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">
            回数:
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">
            日付:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">
            メモ:
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm"
            />
          </label>
        </div>

        <button
          type="submit"
          className="mt-4 rounded bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          更新する
        </button>
      </form>
    </div>
  );
}
