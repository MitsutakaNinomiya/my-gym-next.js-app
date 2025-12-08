

//要理解

import Link from "next/link";

// 種目の型（何となくでもOK）★3
type Exercise = {
  id: string;      // "bench_press" など
  name: string;    // 日本語名
};

// ひとまず固定の種目リスト ★2（ほぼコピペでOK）
const EXERCISES: Exercise[] = [
  { id: "bench_press", name: "ベンチプレス" },
  { id: "squat", name: "スクワット" },
  { id: "deadlift", name: "デッドリフト" },
  { id: "lat_pull_down", name: "ラットプルダウン" },
];

type SelectExercisePageProps = {
  params: {
    date: string; // /logs/[date]/select の [date] 部分 ★3
  };
};

export default function SelectExercisePage({ params }: SelectExercisePageProps) {
  const { date } = params; // URL から日付を受け取る ★3（さっきの復習）

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      {/* ヘッダー */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{date} の種目を選ぶ</h1>
        <p className="text-xs text-gray-400">
          この日に記録したい種目を選んでください。
        </p>
      </header>

      {/* 種目リスト */}
      <section className="space-y-2">
        {EXERCISES.map((ex) => (
          <Link
            key={ex.id}
            href={`/logs/${date}/${ex.id}`} // ← 次に作る「種目ごとの入力ページ」へ ★4
            className="block rounded-lg border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm hover:border-emerald-500"
          >
            {ex.name}
          </Link>
        ))}
      </section>

      {/* 戻るリンク（任意） */}
      <div className="mt-6">
        <Link
          href={`/logs/${date}`}
          className="text-xs text-gray-300 underline underline-offset-2"
        >
          {date} のログ一覧に戻る
        </Link>
      </div>
    </main>
  );
}
