import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { getProjectBundle, saveAvatar } from "@/lib/store";
import { avatarSchema } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  try {
    const user = await requireAppUser();
    const { projectId } = await params;
    const bundle = getProjectBundle(user.id, projectId);

    if (!bundle) {
      return apiError(new Error("Project not found."), 404);
    }

    const input = await readJson(request, avatarSchema);
    const avatar = saveAvatar(user.id, projectId, input);
    return apiSuccess({ avatar }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
