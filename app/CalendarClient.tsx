//これがあると、このファイルは ブラウザで動く（クリックや状態管理も使用できるようになる、逆にこれが無いとできない）  カレンダーのブラウザ側  
"use client";  //ユーザー操作（クリック）と画面遷移を扱うため、Client Component として実装


import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

type Props = {
  markedDates: string[]; // ["2025-12-11", ...] 
};

 
//　Dateオブジェクトは時刻やタイムゾーンを含むため、日付単位で扱う場合、"YYYY-MM-DD"形式に変換する
function toYmd(date: Date) {  //Date型：TSでは標準型定義　グローバルに定義されてるのでimportなしでどこでも使える
  const yyyy = date.getFullYear(); //yyyyをStringに変換していない理由は、getFullYear()が４桁を返すうえにゼロ埋めが不要だから。
  const mm = String(date.getMonth() + 1).padStart(2, "0"); //getMonth()+1で0始まりの月を1-12に直し、padStart(2,"0")は 全体を2桁にしたいので、足りない分を左側に "0" で埋める １２月の場合は埋める必要が無いのでそのまま"12"が返る。
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}


// toYmd(e)のeが一つのdateとしてtoYmdの引数に渡して、toYmd内で整形され　その戻り値をdateStrとして受け取る。


export default function CalendarClient({ markedDates }: Props) {
  const router = useRouter();

  // useMemo=同じ材料なら同じ結果を再利用する markedDatesが変わらない限り、Setを作り直さなくていいよって意味
  // () => new Set(markedDates)は、markedDatesからSetを作る計算を行う関数を渡している。 [markedDates]は依存配列で、markedDatesが変わった時だけ再計算する指定。
  const markedSet = useMemo(() => new Set(markedDates), [markedDates]); //Set＝「重複なしの名簿」 / has＝「名簿にいる？」（高速判定）

  return (
    <Calendar
      locale="ja-JP"
      onClickDay={(e) => { 
        const clickedDateStr = toYmd(e); //カレンダーから来るDateは、内部表現がいろいろ(時刻やタイムゾーンが混ざる)為、それを必ず"YYYY-MM-DD"に統一する。統一しているから、クリック用URLも作れるし、Set.has で一致判定もできる
        router.push(`/logs/${clickedDateStr}`); // 次の階層[date] へ ルーティング
      }}

      // tileContent＝「各日付マスの中に追加表示」
      tileContent={({ date, view }) => {  // tileContent:react-calendarの決め打ちprops reactカレンダーライブラリには 日月年の画面表示があり、画面がmonthの場合は、処理（ボッチが）が実行されるようにする。
        if (view !== "month" ) return null; // 月表示だけで実行
        const tileDateStr = toYmd(date); //整形
        const hasLog = markedSet.has(tileDateStr); //Set(名簿)の中に tileDateStrが含まれているか確認して、あればtrue
        return hasLog ? <div className="text-[10px] mt-0.5">●</div> : null;
      }}
    />
  );
}
//useRouter
//router.push("/path") 指定したpathへ移動し、ブラウザの履歴に新しいページを１つ追加
//router.replace("/path") 指定したpathへ移動し、今表示している履歴を別のページに上書きする
//router.back() ブラウザ履歴の１つ前のページに戻る
//router.forward() ブラウザ履歴の 1つ先のページに進む
//router.refresh() ページをリロードせず、サーバーから最新データを取り直して画面を更新する仕組み



//データは親が管理して操作は子という構図