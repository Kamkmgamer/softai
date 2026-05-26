import { apiError, apiSuccess } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return apiSuccess({
      received: true,
      provider: "openrouter",
      payload,
      note: "Map async video completions back into generation_jobs and outputs when webhook delivery is enabled.",
    });
  } catch (error) {
    return apiError(error);
  }
}
