// app/logs/edit/page.tsx
import { Suspense } from "react";
import { EditLogClient } from "./EditLogClient"; // ← さっき作るファイル

export default function EditLogPage() {
  return (
    <Suspense fallback={<div>読み込み中...</div>}>
      <EditLogClient />
    </Suspense>
  );
}
