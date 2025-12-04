// components/DeleteButton.tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  id: string; // 削除したいログのID
};

export function DeleteButton({ id }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition(); //削除ボタンを押した後に画面が更新されるまで少し時間がある。その間、ボタンを「削除中...」にし、連打されないようにブロックする
  const router = useRouter(); //　画面遷移・リロードを操作するための Nextjsの機能

  const handleDelete = async () => {
    // 確認ダイアログ
    const ok = window.confirm("このログを削除しますか？"); //ウィンドウ全体に confirm(確認ダイアログ)を出す関数　ブラウザ専用APIなので、useClientの書かれていないコンポーネントでは使えない。
    if (!ok) return;

    const res = await fetch("/api/logs", {
      method: "DELETE", // API Route は「メソッド名と同じ関数を書く」だけで動く
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify({ id }), // //削除したい idをサーバーに送っていく
    });

    if (!res.ok) {
      alert("削除に失敗しました");
      return;
    }

    //サーバーコンポーネント（Home）を再実行して、最新のログ一覧を取得しなおす。
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
      {/* isPending:「画面更新（再レンダー）の途中かどうか」を表すフラグ*/}
      {isPending ? "削除中..." : "削除"}
    </button>
  );
}

//router.refresh() による サーバーコンポーネントの描画中だけisPendingがtrue    新しいUIが描画し終わったらfalse
