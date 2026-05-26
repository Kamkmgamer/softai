import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { createAbuseReport } from "@/lib/store";
import { abuseReportSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    const input = await readJson(request, abuseReportSchema);
    const report = await createAbuseReport(user.id, {
      projectId: input.projectId ?? null,
      outputId: input.outputId ?? null,
      reason: input.reason,
      details: input.details,
    });
    return apiSuccess({ report }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
