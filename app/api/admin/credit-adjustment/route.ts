import { apiError, apiSuccess, readJson, requireAdminUser } from "@/lib/api";
import { addCreditEvent, createAdminAction } from "@/lib/store";
import { adminCreditAdjustmentSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const admin = await requireAdminUser();
    const input = await readJson(request, adminCreditAdjustmentSchema);
    const ledgerEvent = await addCreditEvent(input.targetUserId, {
      reason: "admin_adjustment",
      amount: input.amount,
      note: input.details,
    });
    const action = await createAdminAction(admin.id, {
      targetUserId: input.targetUserId,
      action: "credit_adjustment",
      details: `${input.details} | amount:${input.amount}`,
    });
    return apiSuccess({ ledgerEvent, action });
  } catch (error) {
    return apiError(error);
  }
}
