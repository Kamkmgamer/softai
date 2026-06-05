import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";

export default async function PaymentsPage() {
  const locale = await getRequestLocale();
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  redirect("/api/portal/polar");
}
