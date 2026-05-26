import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { createProject } from "@/lib/store";
import { createProjectSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    const input = await readJson(request, createProjectSchema);
    const project = createProject(user.id, input);
    return apiSuccess({ project }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
