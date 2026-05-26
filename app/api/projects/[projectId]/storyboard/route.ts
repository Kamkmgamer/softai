import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { approveStoryboard, getProjectBundle, saveStoryboard } from "@/lib/store";
import { storyboardPatchSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { projectId } = await params;
    const bundle = await getProjectBundle(user.id, projectId);

    if (!bundle) {
      return apiError(new Error("Project not found."), 404);
    }

    const input = await readJson(request, storyboardPatchSchema);
    await saveStoryboard(user.id, projectId, input);
    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { projectId } = await params;
    const storyboard = await approveStoryboard(user.id, projectId);

    if (!storyboard) {
      return apiError(new Error("Storyboard not found."), 404);
    }

    return apiSuccess({ storyboard });
  } catch (error) {
    return apiError(error);
  }
}
