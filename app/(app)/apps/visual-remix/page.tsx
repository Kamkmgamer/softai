import { CreativeAppForm } from "@/components/creative-app-form";
import { getDictionary } from "@/lib/dictionaries";
import { getRequestLocale } from "@/lib/server-locale";

export default async function VisualRemixPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const appDict = dictionary.apps["visual-remix"];

  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="visual-remix"
        title={appDict.title}
        description={appDict.description}
        placeholder={appDict.placeholder}
        presets={appDict.presets}
        requiresUpload="image"
      />
    </div>
  );
}
