"use client"; 
// クライアントコンポーネント宣言
// ブラウザで動く（useState / useRouter / onSubmit を使う）から必須 

import Link from "next/link";

import { useState } from "react"; 
// useState = 状態（フォームの入力値など）を持つためのReactの関数（フック）

import { useRouter } from "next/navigation";
// useRouter = 画面遷移用のフック（別ページに移動したり、画面を更新するやつ）


const PART_OPTIONS = ["胸", "背中", "肩", "脚", "腕"];
// 部位の候補リスト。セレクトボックスに使う


export default function NewLogPage() {
  const router = useRouter(); // 画面遷移に使う 

  // 🟦 フォームの入力値を管理する state（状態）
  const [part, setPart] = useState("");         // 部位
  const [exercise, setExercise] = useState(""); // 種目
  const [weight, setWeight] = useState("");     // 重量
  const [reps, setReps] = useState("");         // 回数
  const [date, setDate] = useState("");         // 日付
  const [memo, setMemo] = useState("");         // メモ
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中フラグ
// isSubmitting フォーム中かどうか？を表すスイッチ　　初期値はフォーム中で無いので、falseになる。

  // フォーム送信時の処理 handleSubmit（ハンドル＝処理する、Submit＝送信）
  const handleSubmit = async(e: React.FormEvent)=> {
    e.preventDefault();
    // preventDefault = デフォルト動作（ページリロード）を止める 

    // かんたん必須チェック（バリデーション）
    if (!part || !exercise || !date) {
      alert("部位・種目・日付は必須です");
      return;
    }

    setIsSubmitting(true); // 送信開始前に true にする

    const res = await fetch("/api/logs", {
      method: "POST", // POST = 新規作成用のHTTPメソッド
      headers: {
        "Content-Type": "application/json", // JSON形式で送ります、の宣言
      },
      body: JSON.stringify({
        part,
        exercise,
        weight,
        reps,
        date,
        memo,
        // text は今回フォーム無しなので送らない（API側で text ?? "" になってるからOK）
      }),
    });

    setIsSubmitting(false); //送信終了後に false に戻す

    if (!res.ok) {
      // res.ok = レスポンスが200番台なら true（成功）、それ以外は false（失敗）★4
      alert("保存に失敗しました");
      return;
    }

    // 保存成功したらトップページに戻る
    router.push("/");   // "/" に遷移する ★4
    router.refresh();   // ページを再取得して最新ログを表示 ★3
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-6">記録しよう！</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">

        {/* 部位 */}
        <div>
          <label className="block text-sm mb-1">部位 *</label>
          <select
            value={part}
            onChange={(e) => setPart(e.target.value)}
            className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
          >
            <option value="">選択してください</option>
            {PART_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* 種目 */}
        <div>
          <label className="block text-sm mb-1">種目 *</label>
          <input
            type="text"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
            placeholder="ベンチプレス など"
          />
        </div>

        {/* 重量 */}
        <div>
          <label className="block text-sm mb-1">重量 (kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
            placeholder="100"
          />
        </div>

        {/* 回数 */}
        <div>
          <label className="block text-sm mb-1">回数</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
            placeholder="8"
          />
        </div>

        {/* 日付 */}
        <div>
          <label className="block text-sm mb-1">日付 *</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
          />
        </div>

        {/* メモ */}
        <div>
          <label className="block text-sm mb-1">メモ</label>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
            rows={3}
          />
        </div>

        {/* 送信ボタン */}
        <button
          type="submit"
          disabled={isSubmitting} //isSubmittingがtrueの場合は無効かさせる。二重で送信されるのを防ぐ。
          className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-60"
        >
          {isSubmitting ? "保存中..." : "保存する"}
        </button>
        {/*isSubmitting=falseは送信前なので保存するを表示させたい。 isSubmitting=trueは送信中ということなので保存中...*/}

        <Link
          href="/"
          className="inline-block rounded-md bg-red-600 px-4 py-2 ml-3 text-sm font-semibold text-white hover:bg-red-800"
        >
          戻る
        </Link>
      </form>
    </main>
  );
}
