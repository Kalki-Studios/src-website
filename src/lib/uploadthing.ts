import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  // Accepts PDF, Word docs, and images — max 3 files, 10MB each
  projectFiles: f({
    pdf:   { maxFileSize: "8MB", maxFileCount: 3 },
    "application/msword":                              { maxFileSize: "8MB", maxFileCount: 3 },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB", maxFileCount: 3 },
    image: { maxFileSize: "8MB", maxFileCount: 3 },
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
