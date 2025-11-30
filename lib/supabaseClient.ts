//Supabaseと繋がるための電話機を1つ作って、アプリのどこでも使えるようにしておくファイル

// createClient = Supabaseクライアント（DBと通信する道具）を作る関数
import { createClient } from "@supabase/supabase-js";




const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ブラウザ用の Supabase クライアント
export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// supabasePW: #Dc_Arkd/V7pksz

