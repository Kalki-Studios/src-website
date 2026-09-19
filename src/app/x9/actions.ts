"use server";

import { db } from "@/lib/db";
import { requests, attachments } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function toggleStar(id: string, starred: boolean) {
  await db.update(requests)
    .set({ starred })
    .where(eq(requests.id, id));
  
  revalidatePath("/x9");
}

export async function updateStatus(id: string, status: string) {
  await db.update(requests)
    .set({ 
      status,
      rejectedAt: status === "rejected" ? new Date() : null,
    })
    .where(eq(requests.id, id));
  
  revalidatePath("/x9");
  revalidatePath(`/x9/${id}`);
}

export async function updateAdminNotes(id: string, notes: string) {
  await db.update(requests)
    .set({ adminNotes: notes })
    .where(eq(requests.id, id));
  
  revalidatePath(`/x9/${id}`);
}

export async function deleteRequest(id: string) {
  const filesToDelete = await db
    .select({ storageKey: attachments.storageKey })
    .from(attachments)
    .where(eq(attachments.requestId, id));

  if (filesToDelete.length > 0) {
    try {
      await utapi.deleteFiles(filesToDelete.map(f => f.storageKey));
    } catch (e) {
      console.error("Failed to delete files from UploadThing", e);
    }
  }

  await db.delete(requests).where(eq(requests.id, id));
  revalidatePath("/x9");
}

export async function deleteAllRejectedRequests() {
  const rejectedRequests = await db
    .select({ id: requests.id })
    .from(requests)
    .where(eq(requests.status, "rejected"));

  if (rejectedRequests.length === 0) return;

  const rejectedIds = rejectedRequests.map(r => r.id);

  const filesToDelete = await db
    .select({ storageKey: attachments.storageKey })
    .from(attachments)
    .where(inArray(attachments.requestId, rejectedIds));

  if (filesToDelete.length > 0) {
    try {
      await utapi.deleteFiles(filesToDelete.map(f => f.storageKey));
    } catch (e) {
      console.error("Failed to bulk delete files from UploadThing", e);
    }
  }

  await db.delete(requests).where(eq(requests.status, "rejected"));
  revalidatePath("/x9");
}

export async function deleteAllCompletedRequests() {
  const completedRequests = await db
    .select({ id: requests.id })
    .from(requests)
    .where(eq(requests.status, "completed"));

  if (completedRequests.length === 0) return;

  const completedIds = completedRequests.map(r => r.id);

  const filesToDelete = await db
    .select({ storageKey: attachments.storageKey })
    .from(attachments)
    .where(inArray(attachments.requestId, completedIds));

  if (filesToDelete.length > 0) {
    try {
      await utapi.deleteFiles(filesToDelete.map(f => f.storageKey));
    } catch (e) {
      console.error("Failed to bulk delete files from UploadThing", e);
    }
  }

  await db.delete(requests).where(eq(requests.status, "completed"));
  revalidatePath("/x9");
}
