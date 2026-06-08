import { SignIn } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { getEnv } from "@/lib/env";
import { isLocale, localizePath } from "@/lib/i18n";

export default async function LocalizedSignInPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const env = getEnv();

  if (!env.clerkPublishableKey || !env.clerkSecretKey) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-lg rounded-4xl border border-border bg-white/80 p-8 text-center">
          <h1 className="text-3xl font-semibold">Demo mode is enabled</h1>
          <p className="mt-4 text-text-secondary">
            Add Clerk environment variables to enable hosted sign-in. Until
            then, the app uses a demo session automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <SignIn
        routing="path"
        path={localizePath("/sign-in", lang)}
        signUpUrl={localizePath("/sign-up", lang)}
        forceRedirectUrl={localizePath("/dashboard", lang)}
      />
    </div>
  );
}
