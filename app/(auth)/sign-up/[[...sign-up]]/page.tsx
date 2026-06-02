import { SignUp } from "@clerk/nextjs";
import { getEnv } from "@/lib/env";
import { getDictionary } from "@/lib/dictionaries";
import { getRequestLocale } from "@/lib/server-locale";

export default async function SignUpPage() {
  const env = getEnv();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const auth = dictionary.auth;

  if (!env.clerkPublishableKey || !env.clerkSecretKey) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-lg rounded-[2rem] border border-border bg-white/80 p-8 text-center">
          <h1 className="text-3xl font-semibold">{auth.demoModeHeading}</h1>
          <p className="mt-4 text-muted">
            {auth.demoModeDescriptionSignUp}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <SignUp />
    </div>
  );
}
