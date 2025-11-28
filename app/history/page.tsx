// app/history/page.tsx
"use client";
// "use client": このファイルはクライアントコンポーネント（ブラウザ側）で動く宣言

import { useEffect, useState } from "react";
import type { Log } from "../App"; // App.tsxでexportしたLog型を再利用

// 日付表示用のヘルパー関数
const formatDisplayDate = (isoDate: string) => {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  return `${y}/${Number(m)}/${Number(d)}`;
};

export default function HistoryPage() {
  const [logs, setLogs] = useState<Log[]>([]);

  // 初回マウント時に localStorage からログを読み込む
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("logs");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Log[];
      if (Array.isArray(parsed)) {
        setLogs(parsed);
      }
    } catch {
      // 壊れたデータが入っててもアプリが落ちないように何もしない
    }
  }, []);

  // 日付ごとにグループ化
  const logsByDate = logs.reduce<Record<string, Log[]>>((acc, log) => {
    if (!acc[log.date]) acc[log.date] = [];
    acc[log.date].push(log);
    return acc;
  }, {});

  // 日付を新しい順にソート
  const sortedDates = Object.keys(logsByDate).sort().reverse();

  return (
    
    <div className="flex justify-center">
      <div className="w-full max-w-3xl my-4 sm:my-8 space-y-6 px-4">
        <h1 className="text-2xl font-bold mb-2">トレーニング履歴</h1>
        <p className="text-sm text-slate-300 mb-4">
          これまでに記録したセットを、日付ごとに一覧表示します。
        </p>

        {sortedDates.length === 0 && (
          <p className="text-sm text-slate-400">
            まだ記録がありません。トップページから記録を追加してみてください。
          </p>
        )}

        {sortedDates.map((date) => (
          <section
            key={date}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-2"
          >
            <h2 className="text-lg font-semibold text-slate-100">
              {formatDisplayDate(date)} の記録
            </h2>

            <ul className="space-y-1 text-sm text-slate-100">
              {logsByDate[date].map((log, index) => (
                <li
                  key={log.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 border-b border-slate-800/60 pb-1 last:border-b-0"
                >
                  <div>
                    <span className="font-semibold">
                      {log.part} {log.exercise}
                    </span>
                    <span className="ml-2">
                      {log.weight}kg × {log.reps}回
                    </span>
                  </div>

                  <div className="text-xs text-slate-400">
                    セット {index + 1}
                    {log.memo && (
                      <span className="ml-2 text-slate-300">
                        メモ: {log.memo}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
