// app/logs/[date]/[exerciseId]/AddSetForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { spawn } from "child_process";
import { Span } from "next/dist/trace";

// Props（プロップス）型：親から渡してもらう値の説明書 ★2〜3
type AddSetFormProps = {
  date: string;          // どの日付のログか
  exerciseId: string;    // どの種目のログか
  nextSetIndex: number;  // 何セット目として登録するか（例: 1, 2, 3...）
  totalVolume: number;
};

export function AddSetForm({ date, exerciseId, nextSetIndex , totalVolume}: AddSetFormProps) {
  const router = useRouter(); 

  // 入力中の値を持っておく state（ステート = 状態）
  const [weight, setWeight] = useState(""); // 重さ
  const [reps, setReps] = useState("");     // 回数
  const [memo, setMemo] = useState("");     // メモ

  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中フラグ
  const [errorMessage, setErrorMessage] = useState("");    // エラー表示用

  // フォーム送信時の処理 
  const handleSubmit = async (e: React.FormEvent) => { //クライアントサーバーなので コンポーネント内の関数にasync
     e.preventDefault(); // 画面のリロードを防ぐ　　　 formのonSubmitで必要　
  console.log("DEBUG AddSetForm props:", { date, exerciseId, nextSetIndex }); // デバッグ用
    // 入力チェック（必要最低限）
    if (!weight || !reps) { //重さまたは回数が空欄の場合
      setErrorMessage("重さと回数は必須です。"); 
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const weightValue = Number(weight);
    const repsValue = Number(reps);

    // Supabase に1行追加する 　クライアントサーバーなのでsupabaseにデータを送ることしかできない
    const { error } = await supabase //追加後のデータを使わないので、{ data, error } ではなく　{ error } だけ受け取る
    .from("logs")
    .insert({
      date,                 // URLからもらった日付
      exercise_id: exerciseId, // URLからもらった種目ID
      set_index: nextSetIndex, // URLからもらった次のセット番号
      weight: weightValue,  //左辺がlogsテーブルのカラム名、右辺が上で定義した変数
      reps: repsValue, 
      memo: memo || null, //空文字列の場合はnullとして保存
    });
 
    if (error) { //追加に失敗したときは、errorに情報が入る
      console.error(error);
      setErrorMessage("保存に失敗しました。");
      setIsSubmitting(false);
      return;
    }


    

    // 入力をリセット
    setWeight("");
    setReps("");
    setMemo("");

    // サーバー側のデータを取り直す（画面を最新にする）
    router.refresh();     
    setIsSubmitting(false);     
  };

  
  

  

  

  return (

    //formの中の各inputをすべてhandleSubmitでまとめて処理する
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">  
      <h2 className="text-sm font-semibold">-------------------------------------------------------------------------</h2>

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
      

      

      {errorMessage && ( //setErrorMessageがtrueの場合に表示
        <p className="text-xs text-red-400">{errorMessage}</p>
      )}

    <div className="flex item-center gap-3">
       <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md mr-5 bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
       >
        {isSubmitting ? "保存中..." : `${nextSetIndex}セット目を保存`}
       </button>

       {/* <span className="rounded-md  text-xs border-emerald-500/40 bg-emerald-900/30 px-4 py-2 font-semibold text-emerald-200">
        TotalVolume : {totalVolume !== 0 ? totalVolume : null}  これの書き方だと totalVolumeが０のとき [totalVolume:"" ] と表示される　*/} 
      {totalVolume !== 0 &&  
        <span className="rounded-md  text-xs border-emerald-500/40 bg-emerald-900/30 px-4 py-2 font-semibold text-emerald-200">
          TotalVolume: {totalVolume}
        </span>}

    </div>  
    
      
        
      
    </form>
  );
}
