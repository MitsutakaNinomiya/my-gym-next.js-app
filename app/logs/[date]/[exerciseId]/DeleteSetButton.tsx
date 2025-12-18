// app/logs/[date]/[exerciseId]/DeleteSetButton.tsx

"use client";

import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteSetButtonProps = {
  id: string; 
};

// export defaultが必要なのは page.tsx layout.tsx など　next.jsが特別扱いするファイルのみ。その他のコンポーネントはnamed exportでOK
  export function  DeleteSetButton({ id }: DeleteSetButtonProps) {  //クライアントコンポーネント本体をasyncにするのは不可。　
    const router = useRouter(); 
    const [isDeleting, setIsDeleting] = useState(false);  // 削除：削除中... の状態管理

    const handleDelete = async () => {    //コンポーネント内の関数をasyncにするのはOK
      if (!confirm("このセットを削除しますか？")) return;  //確認ダイアログでキャンセル押されたら終了、OKなら削除処理へ。

      setIsDeleting(true);

      //supabaseの中には { data, error } が返ってくるが、今回はdataは不要なので取り出していない
      const { error } = await supabase
      .from("logs")
      .delete()
      .eq("id", id);

      //errorに値が入っていれば削除失敗
      if (error) {  
      console.error(error);
      alert("削除に失敗しました。");
      setIsDeleting(false);
      }

      //errorに値が入っていない場合には削除成功なので画面更新
      router.refresh(); 
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="ml-3 rounded-md bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500 disabled:opacity-50"
    >
      {isDeleting ? "削除中..." : "削除"}
    </button>
  );
}
