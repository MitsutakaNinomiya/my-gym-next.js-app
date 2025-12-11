// app/calendar/page.tsx

import Link from "next/link";

// 1日分の日付情報の型
type DayCell = {
  dateStr: string;  // "2025-12-11" みたいな文字
  day: number;      // 日にち（1〜31）
  isToday: boolean; // 今日かどうか
};

// カレンダーページ本体
export default function CalendarPage() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0:1月, 11:12月

  // 月初（1日）
  const firstDay = new Date(year, month, 1);
  // 月末の日付（28〜31）
  const lastDay = new Date(year, month + 1, 0);

  // 月初の曜日（0:日〜6:土）
  const startWeekday = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const days: (DayCell | null)[] = [];

  // 1週目の「前の月の空白」部分
  for (let i = 0; i < startWeekday; i++) {
    days.push(null);
  }

  // 今月の日付を埋める
  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month, d);

    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const dateStr = `${yyyy}-${mm}-${dd}`;

    const isToday =
      d === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear();

    days.push({
      dateStr,
      day: d,
      isToday,
    });
  }

  // 7日ごとに配列を切る（週ごとに分ける）
  const weeks: (DayCell | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      <header className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          {year}年 {month + 1}月 カレンダー
        </h1>
        <p className="text-xs text-gray-400">
          日付をタップすると、その日の種目選択画面へ移動します。
        </p>
      </header>

      <section className="bg-gray-900/70 rounded-xl border border-gray-800 p-4">
        {/* 曜日ヘッダー */}
        <div className="grid grid-cols-7 text-center text-xs text-gray-400 mb-2">
          <div>日</div>
          <div>月</div>
          <div>火</div>
          <div>水</div>
          <div>木</div>
          <div>金</div>
          <div>土</div>
        </div>

        {/* 日付マス */}
        <div className="space-y-1">
          {weeks.map((week, wIndex) => (
            <div key={wIndex} className="grid grid-cols-7 gap-1">
              {week.map((cell, cIndex) => {
                if (!cell) {
                  // 前月や次月の空白
                  return (
                    <div
                      key={cIndex}
                      className="h-10 rounded-md bg-transparent"
                    />
                  );
                }

                const baseClass =
                  "h-10 flex items-center justify-center rounded-md text-sm border";
                const todayClass = cell.isToday
                  ? "bg-emerald-600 text-white border-emerald-400 font-bold"
                  : "bg-gray-800/80 text-gray-100 border-gray-700 hover:border-emerald-500";

                return (
                  <Link
                    key={cIndex}
                    href={`/logs/${cell.dateStr}/select`}
                    className={`${baseClass} ${todayClass}`}
                  >
                    {cell.day}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <div className="mt-4">
        <Link href="/" className="text-xs text-gray-300 underline">
          ホームに戻る
        </Link>
      </div>
    </main>
  );
}
