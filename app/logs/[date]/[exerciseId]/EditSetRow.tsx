"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { DeleteSetButton } from "./DeleteSetButton";

type EditSetRowProps = {
  id: string;
  setIndex: number;
  defaultWeight: number;
  defaultReps: number;
  defaultMemo: string | null;
};

export function EditSetRow({
  id,
  setIndex,
  defaultWeight,
  defaultReps,
  defaultMemo,
}: EditSetRowProps) {
  const router = useRouter();

  // 👇 最初は「表示モード」からスタート
  const [isEditing, setIsEditing] = useState(false);

  const [weight, setWeight] = useState(String(defaultWeight));
  const [reps, setReps] = useState(String(defaultReps));
  const [memo, setMemo] = useState(defaultMemo ?? "");

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    if (!weight || !reps) {
      setErrorMessage("重さと回数は必須です。");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");

    const weightValue = Number(weight);
    const repsValue = Number(reps);

    const { error } = await supabase
      .from("logs")
      .update({
        weight: weightValue,
        reps: repsValue,
        memo: memo || null,
      })
      .eq("id", id);

    if (error) {
      console.error("更新エラー:", error);
      setErrorMessage("更新に失敗しました。");
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setIsEditing(false); // ← 保存したら表示モードに戻す
    router.refresh();
  };

  // 🟢 表示モード
  if (!isEditing) {
    return (
      <li className="rounded-lg border border-gray-800 bg-gray-900/70 px-4 py-2 flex items-center justify-between gap-3">
        <div>
          <div>
            セット {setIndex}: {defaultWeight}kg × {defaultReps}回
          </div>
          {defaultMemo && (
            <div className="text-xs text-gray-300 mt-1">
              メモ: {defaultMemo}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs text-emerald-400 hover:text-emerald-300"
          >
            編集
          </button>
          <DeleteSetButton id={id} />
        </div>
      </li>
    );
  }

  // 🟡 編集モード
  return (
    <li className="rounded-lg border border-emerald-600 bg-gray-900/80 px-4 py-3 space-y-2">
      <div className="text-xs text-gray-400 mb-1">セット {setIndex} を編集</div>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <input
          className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <span>kg ×</span>

        <input
          className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1"
          type="number"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
        />
        <span>回</span>

        <input
          className="flex-1 min-w-[120px] bg-gray-800 border border-gray-700 rounded px-2 py-1"
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="メモ"
        />
      </div>

      {errorMessage && (
        <p className="text-xs text-red-400">{errorMessage}</p>
      )}

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={handleSave} 
          disabled={isSaving} 
          className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
        > 
          {isSaving ? "保存中..." : "保存"} 
        </button> 
        <button 
          type="button" 
          onClick={() => {
            // キャンセルしたら元に戻して表示モードへ
            setWeight(String(defaultWeight));
            setReps(String(defaultReps));
            setMemo(defaultMemo ?? "");
            setIsEditing(false);
            setErrorMessage("");
          }}
          className="rounded-md border border-gray-600 px-3 py-1 text-xs text-gray-200"
        >
          キャンセル
        </button>
      </div>
    </li>
  );
}
