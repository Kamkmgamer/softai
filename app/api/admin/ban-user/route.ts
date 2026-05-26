import { apiError, apiSuccess, readJson, requireAdminUser } from "@/lib/api";
import { banUser, createAdminAction } from "@/lib/store";
import { adminBanSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminUser();
    const input = await readJson(request, adminBanSchema);
    const user = await banUser(input.targetUserId);

    if (!user) {
      return apiError(new Error("Target user not found."), 404);
    }

    const action = await createAdminAction(admin.id, {
      targetUserId: input.targetUserId,
      action: "ban_user",
      details: input.details,
    });

    return apiSuccess({ action });
  } catch (error) {
    return apiError(error);
  }
}
