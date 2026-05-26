import { apiError, apiSuccess } from "@/lib/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    return apiSuccess({
      received: true,
      provider: "polar",
      payload,
      note: "Persist webhook reconciliation into subscriptions and credit grants when Polar credentials are configured.",
    });
  } catch (error) {
    return apiError(error);
  }
}
