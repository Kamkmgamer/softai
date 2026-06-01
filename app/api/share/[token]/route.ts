import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { getShareOutputByToken } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    await requireAppUser();
    const { token } = await params;
    const result = await getShareOutputByToken(token);

    if (!result) {
      return apiError(new Error("Share link not found or expired."), 404);
    }

    return apiSuccess({
      output: {
        id: result.output.id,
        type: result.output.type,
        title: result.output.title,
        createdAt: result.output.createdAt,
      },
      projectTitle: result.projectTitle,
      projectKind: result.projectKind,
    });
  } catch (error) {
    return apiError(error);
  }
}
