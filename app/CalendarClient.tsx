// app/CalendarClient.tsx
"use client";

import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

type Props = {
  markedDates: string[]; // ["2025-12-11", ...]
};

function toYmd(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function CalendarClient({ markedDates }: Props) {
  const router = useRouter();

  // Set＝「名簿」 / has＝「名簿にいる？」（高速判定）
  const markedSet = useMemo(() => new Set(markedDates), [markedDates]);

  return (
    <Calendar
      locale="ja-JP"
      // onClickDay＝「日付をクリックしたら」
      onClickDay={(dateObj) => {
        const dateStr = toYmd(dateObj);
        console.log("clicked:", dateObj, "=>", dateStr);
        router.push(`/logs/${dateStr}`);
      }}
      // tileContent＝「各日付マスの中に追加表示」
      tileContent={({ date, view }) => {
        if (view !== "month") return null; // 月表示だけ
        const dateStr = toYmd(date);
        const hasLog = markedSet.has(dateStr);
        return hasLog ? <div className="text-[10px] mt-0.5">●</div> : null;
      }}
    />
  );
}
