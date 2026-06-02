import { CreativeAppForm } from "@/components/creative-app-form";
import { getDictionary } from "@/lib/dictionaries";
import { getRequestLocale } from "@/lib/server-locale";

export default async function TextToImagePage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const appDict = dictionary.apps["text-to-image"];

  return (
    <div className="h-full min-h-0 overflow-hidden bg-bg">
      <CreativeAppForm
        app="text-to-image"
        title={appDict.title}
        description={appDict.description}
        placeholder={appDict.placeholder}
        presets={appDict.presets}
      />
    </div>
  );
}
