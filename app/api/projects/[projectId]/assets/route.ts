import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { addBrandAsset, getProjectBundle } from "@/lib/store";
import { brandAssetSchema } from "@/lib/validators";

export async function POST(
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

    const input = await readJson(request, brandAssetSchema);
    const asset = await addBrandAsset(user.id, projectId, input);
    return apiSuccess({ asset }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
