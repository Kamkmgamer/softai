import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { getBillingSummary } from "@/lib/store";

export async function GET() {
  try {
    const user = await requireAppUser();
    return apiSuccess({ billing: getBillingSummary(user.id) });
  } catch (error) {
    return apiError(error);
  }
}
