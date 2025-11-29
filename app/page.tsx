"use client"
//↑が無いと useState/useEffectが使えない
//"client" = クライアント（ブラウザ側）で動くコンポーネントにする宣言

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Page() {
  useEffect(() => {
    const testSupabase = async () => {
      const { data, error } = await supabase.from("logs").select("*");

      if (error) {
        console.error("❌ Supabaseエラー:", error);
      } else {
        console.log("✅ Supabase接続成功！ data:", data);
      }
    };

    testSupabase();
  }, []);

  return (
    <main className="p-4 text-white">
      <h1>Supabase接続テスト中…</h1>
    </main>
  );
}




// import App from "./App";    


// export default function Page() { 
//     return <App />;
  
// }