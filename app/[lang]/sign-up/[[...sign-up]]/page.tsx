import { SignUp } from "@clerk/nextjs";
import { notFound } from "next/navigation";
import { getEnv } from "@/lib/env";
import { isLocale, localizePath } from "@/lib/i18n";

export default async function LocalizedSignUpPage({
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
        <div className="max-w-lg rounded-[2rem] border border-border bg-white/80 p-8 text-center">
          <h1 className="text-3xl font-semibold">Demo mode is enabled</h1>
          <p className="mt-4 text-text-secondary">
            Add Clerk environment variables to enable hosted sign-up. Until then, the app uses a demo session automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <SignUp
        routing="path"
        path={localizePath("/sign-up", lang)}
        signInUrl={localizePath("/sign-in", lang)}
        forceRedirectUrl={localizePath("/dashboard", lang)}
      />
    </div>
  );
}
