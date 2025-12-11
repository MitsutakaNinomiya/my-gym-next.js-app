// app/logs/page.tsx
import { redirect } from "next/navigation";

export default function LogsRoot() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  redirect(`/logs/${yyyy}-${mm}-${dd}`);
}
