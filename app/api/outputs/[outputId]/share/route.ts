import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { createShareToken } from "@/lib/store";
import { getEnv } from "@/lib/env";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ outputId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { outputId } = await params;
    const body = await request.json().catch(() => ({}));
    const expiresInDays = typeof body.expiresInDays === "number" ? body.expiresInDays : null;

    let expiresAt: Date | null = null;
    if (expiresInDays && expiresInDays > 0) {
      expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
    }

    const tokenRecord = await createShareToken(user.id, outputId, expiresAt);
    if (!tokenRecord) {
      return apiError(new Error("Output not found."), 404);
    }

    const env = getEnv();
    const shareUrl = `${env.appUrl}/share/${tokenRecord.token}`;

    return apiSuccess({ token: tokenRecord.token, shareUrl, expiresAt: tokenRecord.expiresAt }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
