"use client";


import { useState, useEffect } from "react"; // useState / useEffect を読み込み
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation"; // URLの ?id= を読む
import { supabase } from "@/lib/supabaseClient"; // 自分の supabase クライアントのパスに合わせてね
import { useRouter } from "next/navigation";


// ★★★★★ ここは自分の型に合わせて書く（できれば理解しながら）
// Log: トレーニングログ1件分の型
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

export default function EditPage() {
  const router = useRouter();

  const params = useParams<{id: string}>();
  const logId = params.id;

  // useSearchParams: URL のクエリパラメータ（?id=◯◯）を読む Hook（フック：特別な関数）
  const searchParams = useSearchParams(); // ★★★★☆ 自分で書けるようになりたい
  const id = searchParams.get("id");      // ★★★★★ 超重要！

  // useState: 状態（state）を持つための Hook
  const [log, setLog] = useState<Log | null>(null);           // ★★★★★ 自分の手で書きたい
  const [loading, setLoading] = useState(true);               // ★★★☆☆ コピペでもOK
  const [error, setError] = useState<string | null>(null);    // ★★★☆☆ コピペでもOK



    // -------- フォーム用の state（画面上で編集する値） --------
  const [part, setPart] = useState<string>("");           // 部位 ★★★★★
  const [exercise, setExercise] = useState<string>("");   // 種目 ★★★★★
  const [weight, setWeight] = useState<string>("");       // 重量（文字列でOK）★★★★☆
  const [reps, setReps] = useState<string>("");           // 回数（同上）★★★★☆
  const [date, setDate] = useState<string>("");           // 日付 ★★★★☆
  const [memo, setMemo] = useState<string>("");           // メモ ★★★★☆




  // useEffect: 副作用処理用の Hook（初回表示時や依存が変わったときに実行される）
  useEffect(() => {
    if (!id) return; // id がないなら何もしない

    const fetchLog = async () => { // fetchLog: ログを取得する非同期関数
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("logs")     // from: 「logs テーブルから」
        .select("*")      // select("*"): 全カラム
        .eq("id", id)     // eq: 「id 列が id と等しい行」
        .single();        // single: 1件だけ返してね

      if (error) {
        console.error(error);
        setError("データの取得に失敗しました");
      } else {
        setLog(data as Log); // data を Log 型としてセット
      }

      setLoading(false);
    };

    fetchLog();
  }, [id]); // 依存配列：id が変わったらもう一度実行される


  //logが取得出来たら、その内容をフォーム用stateに流し込む 
  useEffect(() => {
    if(!log) return;

    setPart(log.part);
    setExercise(log.exercise);
    setWeight(String(log.weight)) //数値→　文字列にしてセット
    setReps(String(log.reps));
    setDate(log.date);
    setMemo(log.memo);
  }, [log]); // log が変わったタイミングで実行される
 

  // ここから下は表示部分（JSX）

  if (!id) {
    return <div>URL に id がついていません。</div>;
  }

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;
  if (!log) return <div>データが見つかりませんでした。</div>;

  return (
    <div>
      <h1>ログ編集ページ</h1>
      <p>ID: {log.id}</p>
      

      <form 
        onSubmit={async (e) => {
          e.preventDefault(); // フォーム送信によるページリロードを防ぐ

          if(!id) return;
          
          //数字変換し、update実行
          const {error} = await supabase
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

            if(error) { 
              console.error(error);
              alert("更新に失敗しました");
              return;
            }

            alert("更新完了");
            router.push("/"); //一覧ページに戻る
        }}
      >
        <div>
          <label>
            部位:
            <input
              type="text"
              value={part}
              onChange={(e) => setPart(e.target.value)}
              className="border"
            />
          </label>
        </div>

        <div>
          <label>
            種目:
            <input
              type="text"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
              className="border"
            />
          </label>
        </div>

        <div>
          <label>
            重量(kg):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="border"
            />
          </label>
        </div>

        <div>
          <label>
            回数:
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              className="border"
            />
          </label>
        </div>

        <div>
          <label>
            日付:
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border"
            />
          </label>
        </div>


        <div>
          <label>
            メモ:
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="border"
            />
          </label>
        </div>

        <button type="submit" className="border">更新</button>
        
      </form>
    </div>
  );
}
