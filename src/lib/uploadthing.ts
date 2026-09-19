import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  // Accepts 1 file only — max 1MB
  projectFiles: f({
    pdf:   { maxFileSize: "1MB", maxFileCount: 1 },
    blob:  { maxFileSize: "1MB", maxFileCount: 1 },
    image: { maxFileSize: "1MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      // Public upload — no auth required (students submit without accounts)
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // File metadata is returned to the client after upload
      return { key: file.key, url: file.ufsUrl, name: file.name, size: file.size };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
