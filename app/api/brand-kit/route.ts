import { z } from "zod";
import { apiError, apiSuccess, readJson, requireAppUser } from "@/lib/api";
import { deleteBrandKit, getBrandKits, upsertBrandKit } from "@/lib/brand-kit";

const brandKitInputSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).max(100),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().max(7).nullable().optional(),
  secondaryColor: z.string().max(7).nullable().optional(),
  fonts: z
    .object({
      heading: z.string().optional(),
      body: z.string().optional(),
    })
    .nullable()
    .optional(),
  toneOfVoice: z.string().max(50).nullable().optional(),
});

const deleteSchema = z.object({ id: z.string().uuid() });

export async function GET() {
  try {
    const user = await requireAppUser();
    const kits = await getBrandKits(user.id);
    return apiSuccess({ kits });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAppUser();
    const input = await readJson(request, brandKitInputSchema);
    const kit = await upsertBrandKit(user.id, input);
    return apiSuccess({ kit }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireAppUser();
    const { id } = await readJson(request, deleteSchema);
    await deleteBrandKit(user.id, id);
    return apiSuccess({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
