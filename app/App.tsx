"use client"; 
// "use client" : このファイルのコンポーネントは
// クライアント（ブラウザ）側で動かすよ、という宣言

import { useState } from "react";
// useState : 状態（state）を持つためのReactの関数

import { DateSection } from "./DateSection";
import { PreviousLogsSection } from "./PreviousLogsSection"; 
import { InputSection } from "./InputSection";
import { LogList } from "./LogList";

// ------------ 型定義（TypeScriptの型） ------------

// トレーニングログの型
export type Log = {
  id: string;
  part: string;
  exercise: string;
  weight: number;
  reps: number;
  date: string;
  text: string;
  memo: string;
};


// ------------ 定数 ------------


// 部位ごとの種目リスト
const EXERCISES_BY_PART: Record<string, string[]> = {
  胸: ["ベンチプレス", "ダンベルフライ", "スミスベンチプレス"],
  背中: ["ラットプルダウン", "ベントオーバーローイング", "デッドリフト"],
  肩: ["サイドレイズ", "ショルダープレス", "ケーブルサイドレイズ"],
  脚: ["スクワット","レッグプレス", "レッグカール"],
  腕: ["ライイングエクステンション", "ダンベルカール", "ケーブルプレスダウン"],
};


// ランダムなIDを生成する関数
const createId = () => { 
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID(); // UUIDを生成
  }
  // UUID非対応環境向けのフォールバック
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};


// ------------ メインコンポーネント ------------

export default function App() {
  // 入力欄の状態管理
  const [part, setPart] = useState(""); //部位
  const [exercise, setExercise] = useState(""); //種目
  const [weight, setWeight] = useState(""); //重量
  const [reps, setReps] = useState(""); //回数
  const [memo, setMemo] = useState(""); //メモ

  // 選択中の日付（初期値：今日）
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10)
  );

  // Log型の配列として定義（初期値を localStorage から読み込む）
  const [logs, setLogs] = useState<Log[]>(() => {
    // SSR（サーバー側実行）のときは window / localStorage が無いのでガード
    if (typeof window === "undefined") {
      return [];
    }

    const saved = window.localStorage.getItem("logs");
    if (!saved) return [];

    try {
      const parsed = JSON.parse(saved) as Log[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      // 壊れたデータが入っていてもアプリが落ちないように
      return [];
    }
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editWeight, setEditWeight] = useState(""); 
  const [editReps, setEditReps] = useState("");
  const [editMemo, setEditMemo] = useState("");


  // ログを追加する関数
  const addLog = () => {
    const p = part.trim();
    const e = exercise.trim();
    const w = weight.trim();
    const r = reps.trim();
    const m = memo.trim();

    // どれか一つでも空文字なら何もしない 
    if (!p || !e || !w || !r) return;   // mは無くても良いので条件に含めない

    // 表示用のテキスト
    const t = `${p} ${e} ${w}kg x ${r}回 ${m}`; 

    const newLog: Log = {
      id: createId(), 
      part: p,
      exercise: e, 
      weight: Number(w), 
      reps: Number(r), 
      date: selectedDate,
      text: t,
      memo: m,
    };

    // logs配列に追加しつつ、localStorageにも保存
    setLogs((prevLogs) => {  
      const newLogs = [...prevLogs, newLog];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("logs", JSON.stringify(newLogs));
      }
      return newLogs;
    });

    // 入力欄クリア（部位・種目は前回のまま残す）
    setWeight("");
    setReps("");
    setMemo("");
  };


  // 編集を開始する関数
  const startEdit = (log: Log) => {
    setEditingId(log.id);
    setEditWeight(String(log.weight));
    setEditReps(String(log.reps)); 
    setEditMemo(String(log.memo)); 
  };


  // 編集内容を保存する関数
  const updateLog = () => {
    if (!editingId) return;

    const w = editWeight.trim(); 
    const r = editReps.trim();
    const m = editMemo.trim();

    if (!w || !r) return;

    const weightNum = Number(w);
    const repsNum = Number(r);

    if (Number.isNaN(weightNum) || Number.isNaN(repsNum)) {  
      alert("重量と回数には有効な数字を入力してください");
      return;
    }

    setLogs((prevLogs) => { 
      const newLogs = prevLogs.map((log) => {
        if (log.id !== editingId) return log;

        const updateText = `${log.part} ${log.exercise} ${weightNum}kg x ${repsNum}回 ${m}`;
        return {
          ...log,
          weight: weightNum, 
          reps: repsNum,   
          memo: m,
          text: updateText, 
        };
      });

      if (typeof window !== "undefined") {
        window.localStorage.setItem("logs", JSON.stringify(newLogs));
      }

      return newLogs;
    });

    setEditingId(null);
    setEditWeight("");
    setEditReps("");
    setEditMemo("");
  };


  // 指定したlogを削除する関数
  const handleDelete = (id: string) => {  
    setLogs((prevLogs) => {
      const newLogs = prevLogs.filter((log) => log.id !== id);

      if (typeof window !== "undefined") {
        window.localStorage.setItem("logs", JSON.stringify(newLogs));
      }

      return newLogs; 
    });
  };


  // "YYYY-MM-DD" → "YYYY/M/D" に変換して表示用にする
  const formatDisplayDate = (isoDate: string) => {
    if (!isoDate) return "";

    const [y, m, d] = isoDate.split("-");
    return `${y}/${Number(m)}/${Number(d)}`;
  };


  // 選択中の日付のログだけ抽出
  const filteredLogs = logs.filter((log) => log.date === selectedDate);


  // 選択中の「部位＋種目」の前回1日分
  const previousLogsForSelection: Log[] = (() => { 
    if (!part || !exercise) return [];

    const sameExerciseOldLogs = logs.filter(
      (log) =>
        log.part === part &&
        log.exercise === exercise &&
        log.date < selectedDate
    );

    if (sameExerciseOldLogs.length === 0) return [];

    let latestDate = sameExerciseOldLogs[0].date; 
    for (const log of sameExerciseOldLogs) {
      if (log.date > latestDate) {
        latestDate = log.date;
      }
    }

    return sameExerciseOldLogs.filter((log) => log.date === latestDate);
  })();


  // ------------ 画面表示 ------------

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-3xl my-4 sm:my-0 space-y-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">

        {/* 日付セクション */}
        <DateSection
          selectedDate={selectedDate}
          displayDate={formatDisplayDate(selectedDate)}
          onChangeDate={setSelectedDate}
        />

        {/* 入力セクション */}
        <InputSection
          part={part}
          setPart={setPart}
          exercise={exercise}
          setExercise={setExercise}
          weight={weight}
          setWeight={setWeight}
          reps={reps}
          setReps={setReps}
          memo={memo}
          setMemo={setMemo}
          exercisesByPart={EXERCISES_BY_PART}
          onAddLog={addLog}
        />

        {/* 前回記録の表示 */}
        {part && exercise && previousLogsForSelection.length > 0 && (
          <PreviousLogsSection
            part={part}
            exercise={exercise}
            latestDate={formatDisplayDate(previousLogsForSelection[0].date)}
            previousLogs={previousLogsForSelection}
          />
        )}

        <h2 className="text-lg font-semibold text-slate-100 mb-2">
          {formatDisplayDate(selectedDate)} の記録
        </h2>

        {/* ログ一覧 */}
        <LogList
          logs={filteredLogs}
          editingId={editingId}
          editWeight={editWeight}
          editReps={editReps}
          editMemo={editMemo}
          onChangeEditWeight={setEditWeight}
          onChangeEditReps={setEditReps}
          onChangeEditMemo={setEditMemo}
          onUpdateLog={updateLog}
          onCancelEdit={() => {
            setEditingId(null);
            setEditWeight("");
            setEditReps("");
            setEditMemo("");
          }}
          onStartEdit={startEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
