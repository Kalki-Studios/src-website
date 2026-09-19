"use server";

import { db } from "@/lib/db";
import { requests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function toggleStar(id: string, starred: boolean) {
  await db.update(requests)
    .set({ starred })
    .where(eq(requests.id, id));
  
  revalidatePath("/admin");
}

export async function updateStatus(id: string, status: string) {
  await db.update(requests)
    .set({ status })
    .where(eq(requests.id, id));
  
  revalidatePath("/admin");
  revalidatePath(`/admin/${id}`);
}

export async function updateAdminNotes(id: string, notes: string) {
  await db.update(requests)
    .set({ adminNotes: notes })
    .where(eq(requests.id, id));
  
  revalidatePath(`/admin/${id}`);
}
