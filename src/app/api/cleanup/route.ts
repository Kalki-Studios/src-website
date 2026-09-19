import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requests, attachments as attachmentsTable } from "@/lib/db/schema";
import { and, eq, lt, inArray } from "drizzle-orm";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function GET(request: Request) {
  // Simple security check — must pass the secret header
  const secret = request.headers.get("x-cleanup-secret");
  if (secret !== process.env.CLEANUP_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get global settings for the timer
  const { settings } = await import("@/lib/db/schema");
  let [currentSettings] = await db.select().from(settings).limit(1);
  const timerMinutes = currentSettings?.autoDeleteTimer ?? 2880;

  // Delete rejected projects older than the configured timer
  const threshold = new Date();
  threshold.setMinutes(threshold.getMinutes() - timerMinutes);

  const requestsToDelete = await db
    .select({ id: requests.id })
    .from(requests)
    .where(
      and(
        eq(requests.status, "rejected"),
        lt(requests.rejectedAt, threshold)
      )
    );

  if (requestsToDelete.length === 0) {
    return NextResponse.json({ deleted: 0 });
  }

  const requestIds = requestsToDelete.map(r => r.id);

  // Find associated attachments to delete from UploadThing
  const filesToDelete = await db
    .select({ storageKey: attachmentsTable.storageKey })
    .from(attachmentsTable)
    .where(inArray(attachmentsTable.requestId, requestIds));

  const storageKeys = filesToDelete.map(f => f.storageKey);

  if (storageKeys.length > 0) {
    try {
      await utapi.deleteFiles(storageKeys);
    } catch (e) {
      console.error("Failed to delete files from UploadThing", e);
    }
  }

  const deleted = await db
    .delete(requests)
    .where(inArray(requests.id, requestIds))
    .returning({ id: requests.id });

  return NextResponse.json({ deleted: deleted.length });
}
