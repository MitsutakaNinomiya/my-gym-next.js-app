import { NextResponse } from "next/server";
// NextResponse = Next.jsのレスポンス（返り値）を作るためのクラス
// 「レスポンスをJSONで返す」みたいな時に使う

import { supabase } from "@/lib/supabaseClient";
// さっき作った supabaseクライアント（電話機）

export async function GET() {
  // GET = HTTPメソッドのGET
  // 「データを取得するとき」に使う種類のリクエスト

  const { data, error } = await supabase
    .from("logs") // from = 操作するテーブル名
    .select("*")  // select("*") = 全カラム取得
    .order("created_at", { ascending: false }); 
    // order = 並び替え。created_atの新しい順で取る

  if (error) {
    console.error("❌ Supabaseエラー（API側）:", error);
    return NextResponse.json(
      { message: "ログ取得に失敗しました" },
      { status: 500 }
    );
    // NextResponse.json(データ, { status }) = JSONとステータスコードを返す
  }

  return NextResponse.json(data);
}




// POST: ログを1件追加
export async function POST(request: Request) {
  // Request（リクエスト） = フロントから送られてきた情報が入っているオブジェクト
  const body = await request.json();
  // request.json() = JSON（ジェイソン）形式のリクエストボディをJSオブジェクトに変換する関数

  const { part, exercise, weight, reps, date, text, memo } = body;

  // かんたんバリデーション（必須チェック）
  if (!part || !exercise || !weight || !reps || !date) {
    return NextResponse.json(
      { message: "必須項目が足りません" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("logs")
    .insert([
      {
        part,
        exercise,
        weight,
        reps,
        date,
        text: text ?? "",
        memo: memo ?? "",
      },
    ])
    .select("*")
    .single();
  // .insert([...]) = 新しい行を追加する命令
  // .single() = 1件だけ返してほしい、という指定

  if (error) {
    console.error("❌ Supabaseエラー（POST側）:", error);
    return NextResponse.json(
      { message: "ログの保存に失敗しました" },
      { status: 500 }
    );
  }

  return NextResponse.json(data, { status: 201 }); // 201 = Created（作成成功）
}
