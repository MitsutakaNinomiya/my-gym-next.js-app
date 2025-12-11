// app/logs/[date]/[exerciseId]/AddSetForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Props（プロップス）型：親から渡してもらう値の説明書 ★2〜3
type AddSetFormProps = {
  date: string;          // どの日付のログか
  exerciseId: string;    // どの種目のログか
  nextSetIndex: number;  // 何セット目として登録するか（例: 1, 2, 3...）
};

export function AddSetForm({ date, exerciseId, nextSetIndex }: AddSetFormProps) {
  const router = useRouter(); // ページの再読み込み用（router = ルーター、道案内役）★2

  // 入力中の値を持っておく state（ステート = 状態）★4
  const [weight, setWeight] = useState(""); // 重さ
  const [reps, setReps] = useState("");     // 回数
  const [memo, setMemo] = useState("");     // メモ

  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中フラグ
  const [errorMessage, setErrorMessage] = useState("");    // エラー表示用

  // フォーム送信時の処理 ★4
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 画面のリロードを防ぐ（HTMLフォームのデフォ動作を止める）
  console.log("DEBUG AddSetForm props:", { date, exerciseId, nextSetIndex });
    // 入力チェック（必要最低限）
    if (!weight || !reps) {
      setErrorMessage("重さと回数は必須です。");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const weightValue = Number(weight);
    const repsValue = Number(reps);

    // Supabase に1行追加する ★5
    const { error } = await supabase.from("logs").insert({
      date,                 // URLからもらった日付
      exercise_id: exerciseId, // URLからもらった種目ID
      set_index: nextSetIndex, // 何セット目か
      weight: weightValue,
      reps: repsValue,
      memo: memo || null,
    });
 
    if (error) {
      console.error(error);
      setErrorMessage("保存に失敗しました。");
      setIsSubmitting(false);
      return;
    }

    // 入力をリセット
    setWeight("");
    setReps("");
    setMemo("");

    // サーバー側のデータを取り直す（画面を最新にする）★3
    router.refresh();
    setIsSubmitting(false);
  };

  return (

    
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <h2 className="text-sm font-semibold">セットを追加</h2>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">
            重さ (kg)
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs text-gray-400 mb-1">
            回数
          </label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">
          メモ（任意）
        </label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          className="w-full rounded-md bg-gray-900 border border-gray-700 px-3 py-2 text-sm"
        />
      </div>
      

      

      {errorMessage && (
        <p className="text-xs text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
      >
        {isSubmitting ? "保存中..." : `${nextSetIndex}セット目を保存`}
      </button>
    </form>
  );
}
