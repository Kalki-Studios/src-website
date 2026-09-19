"use server";

import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Ensures a settings row exists and returns it.
 */
export async function getSettings() {
  let [currentSettings] = await db.select().from(settings).limit(1);
  if (!currentSettings) {
    [currentSettings] = await db.insert(settings).values({
      adminPassword: process.env.ADMIN_PASSWORD!,
      isUnderConstruction: false,
    }).returning();
  }
  return currentSettings;
}

export async function updatePassword(newPassword: string) {
  const currentSettings = await getSettings();
  await db.update(settings)
    .set({ adminPassword: newPassword })
    .where(eq(settings.id, currentSettings.id));
}

export async function toggleUnderConstruction(isOn: boolean) {
  const currentSettings = await getSettings();
  await db.update(settings)
    .set({ isUnderConstruction: isOn })
    .where(eq(settings.id, currentSettings.id));
  
  // Revalidate public routes to immediately reflect changes
  revalidatePath("/", "layout");
}
