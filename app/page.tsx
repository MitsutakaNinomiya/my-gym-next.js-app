// app/page.tsx
import { supabase } from "@/lib/supabaseClient";
import CalendarClient from "./CalendarClient";

export default async function Page() {
  const { data, error } = await supabase.from("logs").select("date");
  if (error) {
    return <div className="p-6">取得エラー</div>;
  }

  const markedDates = (data ?? []).map((row) => String(row.date).slice(0, 10));

  return (
    <main className="min-h-screen bg-gray-950 text-gray-50 p-6 md:p-10">
      <h1 className="text-2xl font-bold mb-4">筋トレLog App</h1>
      <div className="mx-auto max-w-md">
  <CalendarClient markedDates={markedDates} />
</div>
    </main>
  );
}
