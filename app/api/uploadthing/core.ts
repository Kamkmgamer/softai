import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireAppUser } from "@/lib/api";

const f = createUploadthing();

export const uploadRouter = {
  brandAssetUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "8MB",
    },
  })
    .middleware(async () => {
      const user = await requireAppUser();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => ({
      userId: metadata.userId,
      url: file.ufsUrl,
      name: file.name,
    })),

  avatarUploader: f({
    image: {
      maxFileCount: 1,
      maxFileSize: "8MB",
    },
  })
    .middleware(async () => {
      const user = await requireAppUser();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => ({
      userId: metadata.userId,
      url: file.ufsUrl,
      name: file.name,
    })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
