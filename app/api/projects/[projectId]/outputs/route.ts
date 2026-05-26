import { apiError, apiSuccess, requireAppUser } from "@/lib/api";
import { getProjectBundle } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { projectId } = await params;
    const bundle = await getProjectBundle(user.id, projectId);

    if (!bundle) {
      return apiError(new Error("Project not found."), 404);
    }

    return apiSuccess({ outputs: bundle.outputs });
  } catch (error) {
    return apiError(error);
  }
}
