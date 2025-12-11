import Link from "next/link";

// 日付を "2025-12-07" みたいな文字列にする関数
// format = 形式・形を整える という意味
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// カレンダー用にマス目(日付)を作る関数
// build = 組み立てる / cells = マス
function buildCalendarCells(year: number, month: number): (Date | null)[] {
  const monthIndex = month - 1; // Date の月は 0始まりなので -1 して使う
  const firstDay = new Date(year, monthIndex, 1); // その月の1日
  const firstWeekday = firstDay.getDay(); // 曜日(0=日, 1=月, ... 6=土)
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate(); // その月の日数

  const cells: (Date | null)[] = [];

  // ① 1日が始まるまでの「空白マス(null)」を入れる
  for (let i = 0; i < firstWeekday; i++) {
    cells.push(null);
  }

  // ② 1日〜月末までの日付を入れる
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(new Date(year, monthIndex, day));
  }

  // ③ 最後の行が7の倍数になるように、余ったところを空白で埋める
  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

export default function CalendarPage() {
  // 今日
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  // カレンダーマスを作る
  const cells = buildCalendarCells(year, month);
  const weekLabels = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-4">
        {year}年 {month}月 のカレンダー
      </h1>

      <p className="text-sm text-gray-400 mb-4">
        日付をタップすると、その日のログページ（/logs/YYYY-MM-DD）へ移動します。
      </p>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-gray-400">
        {weekLabels.map((label) => (
          <div key={label}>{label}</div>
        ))}
      </div>

      {/* 日付マス（7列グリッド） */}
      <div className="grid grid-cols-7 gap-2 text-sm">
        {cells.map((date, index) => {
          if (!date) {
            // 空白マス
            return (
              <div
                key={index}
                className="h-12 rounded-md border border-gray-800 bg-gray-900/40"
              />
            );
          }

          const dateStr = formatDate(date); // "2025-12-07"
          const isToday =
            formatDate(date) === formatDate(today); // 今日かどうか判定用

          return (
            <Link
              key={index}
              href={`/logs/${dateStr}`}
              className={[
                "h-12 rounded-md border flex items-center justify-center",
                "transition-colors",
                isToday
                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                  : "border-gray-700 bg-gray-900/70 hover:bg-gray-800",
              ].join(" ")}
            >
              {date.getDate()}
            </Link>
          );
        })}
      </div>
    </main>
  );
}
