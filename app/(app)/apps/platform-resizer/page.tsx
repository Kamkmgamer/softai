import { CreativeAppForm } from "@/components/creative-app-form";
import { getDictionary } from "@/lib/dictionaries";
import { getRequestLocale } from "@/lib/server-locale";

export default async function PlatformResizerPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const appDict = dictionary.apps["platform-resizer"];

  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="platform-resizer"
        title={appDict.title}
        description={appDict.description}
        placeholder={appDict.placeholder}
        presets={appDict.presets}
        requiresUpload="image"
      />
    </div>
  );
}
