"use client";    
import { devIndicatorServerState } from "next/dist/server/dev/dev-indicator-server-state";
//nextjsPJ 　npm run devしてから  http://localhost:3000 に　playground/counter　加えるだけで開けるよ


import { useState } from "react"; // useState: 状態（state）を持つためのReactの関数

export default function Page() {
  const [count, setCount] = useState<number>(0);
  const [history, setHistory] = useState<string[]>([]);


  // +1ボタンが押されたとき
  const handleIncrement= () => {
    const plusCount = count + 1;
    setCount(plusCount);

    //履歴の末尾に plusCount追加
    setHistory((prev) => [...prev, plusCount]);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
        
        <h1 className="text-2xl font-bold text-center">カウンターアプリ</h1>

        <div className="text-center text-5xl font-extrabold">
          {count}
        </div>

        <div className="flex justify-center gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 active:bg-sky-700 transition"
            onClick={handleIncrement}
          >
            +1
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 active:bg-rose-700 transition"
            onClick={() => setCount(0)}
          >
            Reset
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-600 active:bg-sky-700 transition"
            onClick={() => setCount(count - 1)}
          >
            -1
          </button>
        </div>

      {/* 履歴表示 */}
      <div className="mt-4">
        <p className="text-sm text-slate-300 mb-1">履歴</p>
        {history.length === 0 ? (
          <p className="text-s tex-slate-500">まだ履歴はありません</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {history.map((value, index ) => (
              <li
                key={index}
                className="flex justify-between rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1"
              >
                <span>{index + 1} 回目</span>
                <span>{value}</span>

              </li>
            ))}
          </ul>

        )}
      </div>


      </div>
    </div>
  );
}


//   count: 現在の数値
//   setCount: count を更新するための関数
//   const [count, setCount] = useState<number>(0);

//   // history: 履歴を入れておく配列
//   // setHistory: history を更新するための関数
//   const [history, setHistory] = useState<number[]>([]);

//   // ① +1 ボタンが押されたときの処理（インクリメント: increment = 1増やす）
//   const handleIncrement = () => {
//     const next = count + 1;
//     setCount(next);
//     // いままでの履歴の末尾に next を追加
//     setHistory((prev) => [...prev, next]);
//   };

//   // ② -1 ボタンが押されたときの処理（デクリメント: decrement = 1減らす）
//   const handleDecrement = () => {
//     const next = count - 1;
//     setCount(next);
//     setHistory((prev) => [...prev, next]);
//   };

//   // ③ リセットボタンが押されたときの処理
//   const handleReset = () => {
//     setCount(0);
//     setHistory([]);
//   };

//   return (
//     <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
//       <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-6">
//         <h1 className="text-xl font-bold">練習：カウンター</h1>

//         {/* 現在のカウント表示 */}
//         <div className="text-center space-y-2">
//           <p className="text-sm text-slate-400">現在の値</p>
//           <p className="text-5xl font-bold">{count}</p>
//         </div>

//         {/* ボタンたち */}
//         <div className="flex items-center justify-center gap-3">
//           <button
//             onClick={handleDecrement} // onClick: クリックされた時に呼ばれるイベント
//             className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-600 active:bg-slate-500"
//           >
//             -1
//           </button>
//           <button
//             onClick={handleReset}
//             className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-semibold hover:bg-slate-500 active:bg-slate-400"
//           >
//             リセット
//           </button>
//           <button
//             onClick={handleIncrement}
//             className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold hover:bg-sky-400 active:bg-sky-300"
//           >
//             +1
//           </button>
//         </div>

//         {/* 履歴表示 */}
//         <div className="mt-4">
//           <p className="text-sm text-slate-300 mb-1">履歴</p>
//           {history.length === 0 ? (
//             <p className="text-xs text-slate-500">まだ履歴はありません。</p>
//           ) : (
//             <ul className="space-y-1 text-sm">
//               {history.map((value, index) => (
//                 // map: 配列の各要素を「別の形」に変換して、新しい配列を返すメソッド
//                 <li
//                   key={index}
//                   className="flex justify-between rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1"
//                 >
//                   <span>{index + 1} 回目</span>
//                   <span>{value}</span>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }













