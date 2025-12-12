// app/logs/[date]/select/page.tsx

import Link from "next/link";

// 種目の型（何となくでもOK）
type Exercise = {
  id: string;      // "bench_press" など
  name: string;    // 日本語名
};

// ひとまず固定の種目リスト
const EXERCISES: Exercise[] = [
  { id: "bench_press", name: "ベンチプレス" },
  { id: "bulgarian_squat", name: "ブルガリアンスクワット" },
  { id: "lat_pull_down", name: "ラットプルダウン" },
  { id: "lying_extension", name: "ライイングエクステンション" },
  { id: "EZ_bar_curl", name: "EZバーカール" },
  { id: "deadlift", name: "デッドリフト" },

];

// propsの型定義
type SelectExercisePageProps = {
  // ⬅ ここを「Promise 付き」にする
  params: Promise<{
    date: string;
  }>;
};

// ⬅ 関数を async にして…
export default async function SelectExercisePage(
  props: SelectExercisePageProps
) {
  // ⬅ await で中身を取り出す
  const { date } = await props.params;

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
            href={`/logs/${date}/${ex.id}`}
            className="block rounded-lg border border-gray-800 bg-gray-900/70 px-4 py-3 text-sm hover:border-emerald-500"
          >
            {ex.name}
          </Link>
        ))}
      </section>

      {/* 戻るリンク */}
      <div>
        <Link
          href={`/logs/${date}`}
          className="text-xs text-gray-300 underline underline-offset-2  ml-10"
        >
          {date} のログ一覧に戻る
        </Link>
      </div>
    </main>
  );
}
