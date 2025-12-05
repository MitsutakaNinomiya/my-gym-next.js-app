"use client"

import { useState } from "react";

type SetRow = { 
    weight: string;
    reps: string;
    memo: string;
}; 

export default function ExercisePage() {

    //初期画面状態
    const [sets, setSets] = useState<SetRow[]>([
        {weight: "", reps: "", memo: ""},
        {weight: "", reps: "", memo: ""},
        {weight: "", reps: "", memo: ""},
        {weight: "", reps: "", memo: ""},
    ]);

    //重量が変わった時の処理
    const handleChangeWeight = (index: number, value: string) => {
        setSets((prev) => {
            const copy = [...prev];
            copy[index] = { ...copy[index], weight: value }; // copy[index] はどの要素のcopyを書き換えたいのか
            return copy;
        });
    };

    //回数が変わった時の処理
    const handleChangeReps = (index: number, value: string) => {  // index0
        setSets((prev) => {
            const copy = [...prev]; //copy[0] =[{index0 value11} {index1 value8}]    ...prev=[{index0 value10} {index1 value8}]
            copy[index] = { ...copy[index], reps: value}
            return copy;
        });
    }; 

    const handleChangeMemo = (index: number, value: string) => {
        setSets((prev) => {
            const copy = [...prev];
            copy[index] = {...copy[index], memo: value}
            return copy
        });
    };

    const handleSave = () => {
         // sets（4セット分の配列）から、weight と reps が両方入っている行だけを抽出
        const filledSets = sets.filter(
            (set) => set.weight !== "" && set.reps !== ""
        );
        console.log("保存するセット", filledSets);
        alert("とりあえず保存ボタン押した！")
    }



    return(
        <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
            <h1 className="text-2xl font-bold mb-4">ベンチプレス記録</h1>

            {/* Last Record ダミー表示 */}
            <section>
                <h2 className="text-lg font-semibold mb-2">Last Record</h2>
                    <p>
                        2025/11/20 100kg x 10 / 100kg x 8 / 90kg x 10 / 80kg x 12
                    </p>
            </section>

            {/* 今回のセット入力 */}
            <section>
                <h2 className="">今日の記録</h2>

                {sets.map((set, index) => (
                    <div
                    key={index}
                    className="flex flex-wrap items-center gap-2 text-sm"
                    >
                        <span className="w-4">{index + 1}.</span>

                        <input
                            className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1"
                            value={set.weight}
                            onChange={(e) => handleChangeWeight(index, e.target.value)}
                            placeholder="重量"
                        />
                        <span>kg x</span>

                        <input className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1" 
                            value={set.reps}
                            onChange={(e) => handleChangeReps(index, e.target.value)}
                            placeholder="回数"
                        />
                        <span>rep</span>

                          <input
                            className="flex-1 min-w-[120px] bg-gray-800 border border-gray-700 rounded px-2 py-1"
                            value={set.memo}
                            onChange={(e) => handleChangeMemo(index, e.target.value)}
                            placeholder="メモ"
                            />
                    </div>
                ))}
            </section>

            <div className="mt-6">
                <button
                onClick={handleSave}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
                >
                保存（ダミー）
                </button>
            </div>

            

        </main>
    )
}
