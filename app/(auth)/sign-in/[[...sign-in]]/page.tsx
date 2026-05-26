import { SignIn } from "@clerk/nextjs";
import { getEnv } from "@/lib/env";

export default function SignInPage() {
  const env = getEnv();

  if (!env.clerkPublishableKey || !env.clerkSecretKey) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-lg rounded-[2rem] border border-border bg-white/80 p-8 text-center">
          <h1 className="text-3xl font-semibold">Demo mode is enabled</h1>
          <p className="mt-4 text-muted">
            Add Clerk environment variables to enable hosted sign-in. Until then, the app uses a demo session automatically.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <SignIn />
    </div>
  );
}
