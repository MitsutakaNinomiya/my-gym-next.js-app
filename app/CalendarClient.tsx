//これがあると、このファイルは ブラウザで動く（クリックや状態管理も使用できるようになる、逆にこれが無いとできない）  カレンダーのブラウザ側  
"use client";  //ユーザー操作（クリック）と画面遷移を扱うため、Client Component として実装


import { Calendar } from "react-calendar";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import "react-calendar/dist/Calendar.css";

type MarkedDatesProps = {
  markedDates: string[]; // ["2025-12-11", "2025-12-15", ...] 
};

 
//　今度はreactCalendarから来る Date型の日付を "YYYY-MM-DD" 文字列に変換する関数　親と子で日付の形式を合わせないと比較できないので。
function toYmd(date: Date) {  //Date型：TSでは標準型定義　グローバルに定義されてるのでimportなしでどこでも使える
  const yyyy = date.getFullYear(); //なんでStringじゃないの？→　最終的にテンプレートリテラルで文字列になるのと、padStartを使う必要がないから。
  const mm = String(date.getMonth() + 1).padStart(2, "0"); //getMonth()+1で0始まりの月を1-12に直し、padStart(2,"0")は 全体を2桁にしたいので、足りない分を左側に "0" で埋める １２月の場合は埋める必要が無いのでそのまま"12"が返る。
  const dd = String(date.getDate()).padStart(2, "0"); ////padStartを使うために、Stringに変換しているだけ　結局テンプレートリテラルで文字列化できる
  return `${yyyy}-${mm}-${dd}`;
} //テンプレートリテラルで"YYYY-MM-DD"形式の文字列を返す




export default function CalendarClient({ markedDates }: MarkedDatesProps) {
  const router = useRouter();

  // useMemo=同じ材料なら同じ結果を再利用する markedDatesが変わらない限り、Setを作り直さなくていいよって意味
  // () => new Set(markedDates)は、markedDatesからSetを作る計算を行う関数を渡している。 [markedDates]は依存配列で、markedDatesが変わった時だけ再計算する指定。
  const markedSet = useMemo(() => new Set(markedDates), [markedDates]); //Set＝「重複なしの名簿」 / has＝「名簿にいる？」（高速判定）
  console.log("DEBUG markedDates:", markedSet);
  return (
    <Calendar 
      locale="ja-JP"
      onClickDay={(e) => {
        // console.log( "クリック", e); //e = Thu Dec 18 2025 00:00:00 GMT+0900 (日本標準時) のようなDateオブジェクトが来る
        const clickedDateStr = toYmd(e); //カレンダーから来るDateは、内部表現がいろいろ(時刻やタイムゾーンが混ざる)為、それを必ず"YYYY-MM-DD"に統一する。統一しているから、クリック用URLも作れるし、Set.has で一致判定もできる
        router.push(`/logs/${clickedDateStr}`); // 次の階層[date] へ ルーティング
      }}

      // tileContent＝「各日付マスの中に追加表示」
      tileContent={({ date, view }) => {  // date=2025-12-18T15:00:00.000Z のようなDateオブジェクト、view="month"|"year"|"decade"|"century"のどれか
        if (view !== "month" ) return null; // 日付にボッチを付けたいので　month表示で実行
        const tileDateStr = toYmd(date); //整形

        const hasLog = markedSet.has(tileDateStr); //markedSetにtileDateStrがあるかどうかを高速判定 
        return hasLog ? <div className="text-[10px] mt-0.5">●</div> : null; //ある場合は●を返す、無い場合は何も返さない
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