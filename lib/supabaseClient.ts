import { createClient } from "@supabase/supabase-js";

//Supabaseと繋がるための電話機を1つ作って、アプリのどこでも使えるようにしておくファイル

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


export const supabase = createClient(supabaseUrl, supabaseAnonKey);


// supabasePW: #Dc_Arkd/V7pksz