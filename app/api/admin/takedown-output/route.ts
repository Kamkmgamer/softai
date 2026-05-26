import { apiError, apiSuccess, readJson, requireAdminUser } from "@/lib/api";
import { createAdminAction, takedownOutput } from "@/lib/store";
import { adminOutputSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminUser();
    const input = await readJson(request, adminOutputSchema);
    const output = await takedownOutput(input.outputId);

    if (!output) {
      return apiError(new Error("Output not found."), 404);
    }

    const action = await createAdminAction(admin.id, {
      targetUserId: input.targetUserId,
      action: "takedown_output",
      details: `${input.details} | output:${input.outputId}`,
    });
    return apiSuccess({ action, output });
  } catch (error) {
    return apiError(error);
  }
}
