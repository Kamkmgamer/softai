import { CreativeAppForm } from "@/components/creative-app-form";
import { getDictionary } from "@/lib/dictionaries";
import { getRequestLocale } from "@/lib/server-locale";

export default async function WhiteboardAnimationPage() {
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const appDict = dictionary.apps["whiteboard-animation"];

  return (
    <div className="min-h-full bg-bg lg:h-full lg:min-h-0 lg:overflow-hidden">
      <CreativeAppForm
        app="whiteboard-animation"
        title={appDict.title}
        description={appDict.description}
        placeholder={appDict.placeholder}
        presets={appDict.presets}
      />
    </div>
  );
}
