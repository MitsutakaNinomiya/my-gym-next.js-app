// app/logs/[date]/select/page.tsx

import Link from "next/link";

// 種目リスト
const EXERCISES: Exercise[] = [
  { id: "bench_press", name: "ベンチプレス" },
  { id: "squat", name: "スクワット" },
  { id: "deadlift", name: "デッドリフト" },
  { id: "lat_pull_down", name: "ラットプルダウン" },
];

// 種目の型（何となくでもOK）
type Exercise = {
  id: string;      // "bench_press" など
  name: string;    // 日本語名
};

// propsの型定義
type SelectExercisePageProps = {
  
  params: Promise<{
    date: string;
  }>;
};

//  関数を async にしてawait で中身を取り出す
export default async function SelectExercisePage(
  props: SelectExercisePageProps  
) {
    const { date } = await props.params; // URLパラメータから日付を取得

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
      <div className="mt-6">
        <Link
          href={`/logs/${date}`}
          className="inline-flex items-center gap-1.5
                  rounded-md
                  border border-emerald-500/40
                  bg-emerald-900/30 px-3 py-1.5
                  text-xs font-medium text-emerald-200
                  hover:bg-emerald-800/40
                  active:scale-95
                  transition"
        >
          {date} のログ一覧に戻る
        </Link>
      </div>
    </main>
  );
}
