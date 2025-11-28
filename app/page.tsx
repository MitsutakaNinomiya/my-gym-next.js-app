"use client"
//↑が無いと useState/useEffectが使えない
//"client" = クライアント（ブラウザ側）で動くコンポーネントにする宣言

import App from "./App";    


export default function Page() { 
    return <App />;
  
}