import { NextResponse } from "next/server";
// NextResponse = Next.jsのレスポンス（返り値）を作るためのクラス
// 「レスポンスをJSONで返す」みたいな時に使う

import { supabase } from "@/lib/supabaseClient";


export async function GET() {
  // GET = HTTPメソッドのGET
  // 「データを取得するとき」に使う種類のリクエスト

  const { data, error } = await supabase
    .from("logs") // from = 操作するテーブル名
    .select("*")  // select("*") = 全カラム取得
    .order("created_at", { ascending: false }); 
    // order = 並び替え。created_atの新い順で取る

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




// POST: 新規ログを1件追加
export async function POST(request: Request){
  // Request = フロント（ブラウザ）から送られてきた情報の入れ物
  const body = await request.json();
  // request.json() = JSON文字列 → JSオブジェクトに変換する関数

  const { part, exercise, weight, reps, date, text, memo } = body;

  //部位種目日付のどれか一つでも空であればreturn (必須チェック)
  if(!part|| !exercise || !date) {
    return NextResponse.json(
      { message: "部位・種目・日付は必須です"},
      { status: 400} // 400 = クライアント側のリクエストがおかしい。
    )
  }



//DB（Supabase側）は integer / numeric など number を待っている　なので Number() で数値変換してから渡す
 // weight, reps は「空文字 or undefined」のことが多いので number に揃えておく
  const weightNum =
    weight === undefined || weight === null || weight === ""
      ? null : Number(weight); //trueならnullを falseなら（値がちゃんと入っていれば）Numberに変換
 
  const repsNum = 
    reps === undefined || reps === null || weight === ""
      ? null
      : Number(reps);    

  const { data, error } = await supabase
    .from("logs")
    .insert([
      {
        part,
        exercise,
        weight: weightNum,
        reps: repsNum,
        date,
        text: text ?? "" ,
        memo: memo ?? "",
      }
    ])
    .select("*")
    .single();
  // insert([...]) = 行を追加する命令（配列の中に「1レコード分のオブジェクト」）
  // select("*")   = 今入れた行を取り出す
  // single()      = 「1件だけ返してね」と指定（配列ではなく1オブジェクトで返してくれる）

  if(error) { 
    console.log("✖ Supabaseエラー(POST側):", error)
    return NextResponse.json(
      {message: "ログの保存に失敗しました" },
      { status: 500 } //500 = サーバー側のエラー
    );
  }

  return NextResponse.json(data, { status: 201 });
}



//DELETEメソッド用のAPI関数
//API Route は「メソッド名と同じ関数を書く」だけで動く
export async function DELETE(request: Request) {

   //フロントから送られってきた、JSON文字列を、request.json()でJSオブジェクト{id:"xxx"}に変換し、その中から idだけを抜き取って変数idに入れている。 // id = "xxx"
  const { id } = await request.json(); // 送られてきた{id: "id"}から idだけを取り出す。今回は一つだけしかないのでわかりにくいけど

  if (!id) {
    return NextResponse.json(  //NextResponse: Next.jsが用意しているAPI Route専用の "レスポンスを返すためのクラス"
      { error: "id が指定されていません" },
      { status: 400 }
    );
  }

  const { error } = await supabase     //supabaseは成功・失敗どちらでも必ず {date, error}の形で返す
    .from("logs")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    return NextResponse.json(
      { error: "削除に失敗しました" },
      { status: 500 } //errorに中身が入っている(true)ということは削除できていないということ
    );
  }

  return NextResponse.json({ ok: true });
}


//date: null error: null  成功時
//date: null error: {xxx}  失敗時
//DELETEできていないということなので errorに値が入っていると失敗