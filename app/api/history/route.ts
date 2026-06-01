import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { getGenerationHistory } from "@/lib/store";
import type { OutputType } from "@/lib/types";

const VALID_TYPES = new Set(["scene_image", "final_video", "thumbnail"]);

export async function GET(request: Request) {
  try {
    const user = await requireAppUser();
    const url = new URL(request.url);
    const typeParam = url.searchParams.get("type");
    const before = url.searchParams.get("before") ?? undefined;

    const type = typeParam && VALID_TYPES.has(typeParam) ? (typeParam as OutputType) : undefined;

    const result = await getGenerationHistory(user.id, { type, before });
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
