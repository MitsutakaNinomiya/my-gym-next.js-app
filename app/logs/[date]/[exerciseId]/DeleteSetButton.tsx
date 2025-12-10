// app/logs/[date]/[exerciseId]/DeleteSetButton.tsx

"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteSetButtonProps = {
  id: string; // 消したいログ行の id
};

export function DeleteSetButton({ id }: DeleteSetButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("このセットを削除しますか？")) return;

    setIsDeleting(true);

    const { error } = await supabase
    .from("logs")
    .delete()
    .eq("id", id);

    if (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました");
      setIsDeleting(false);
      return;
    }

    // 画面を最新の状態に更新
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-xs border rounded-md text-white hover:text-red-300 bg-red-500rounded-md bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50  ml-3 px-4 py-2"
    >
      {isDeleting ? "削除中..." : "削除"}
    </button>
  );
}
