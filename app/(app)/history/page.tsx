import { redirect } from "next/navigation";
import { getAppSession } from "@/lib/auth";
import { getDictionary } from "@/lib/dictionaries";
import { localizePath } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/server-locale";
import { getGenerationHistory } from "@/lib/store";
import { PageHeader } from "@/components/ui";
import { HistoryPageClient } from "@/components/history/history-page-client";

export default async function HistoryPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const session = await getAppSession();
  if (!session) redirect(localizePath("/sign-in", locale));

  const { items, nextCursor } = await getGenerationHistory(session.userId);

  return (
    <div className="thin-scrollbar h-full overflow-y-auto px-4 py-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader
          title={dictionary.history.title}
          description={dictionary.history.description}
          backButton
        />
        <HistoryPageClient
          initialItems={items}
          initialCursor={nextCursor}
          locale={locale}
        />
      </div>
    </div>
  );
}
