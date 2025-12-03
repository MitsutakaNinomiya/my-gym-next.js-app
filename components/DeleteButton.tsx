// components/DeleteButton.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  id: string; // 削除したいログのID
};

export function DeleteButton({ id }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    // 確認ダイアログ
    const ok = window.confirm("このログを削除しますか？");
    if (!ok) return;

    const res = await fetch("/api/logs", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }), // サーバーに id を送る
    });

    if (!res.ok) {
      alert("削除に失敗しました");
      return;
    }

    // 画面をリフレッシュして一覧を最新にする
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="rounded-md bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 disabled:opacity-60"
    >
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}
