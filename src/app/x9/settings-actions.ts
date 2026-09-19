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

export async function saveAllSettings({ 
  newPassword, 
  isUnderConstruction, 
  autoDeleteTimer,
  whatsappTemplate
}: { 
  newPassword?: string, 
  isUnderConstruction: boolean, 
  autoDeleteTimer: number,
  whatsappTemplate?: string
}) {
  const currentSettings = await getSettings();
  
  const updates: any = {
    isUnderConstruction,
    autoDeleteTimer
  };
  
  if (whatsappTemplate) {
    updates.whatsappTemplate = whatsappTemplate;
  }
  
  if (newPassword) {
    updates.adminPassword = newPassword;
  }
  
  await db.update(settings)
    .set(updates)
    .where(eq(settings.id, currentSettings.id));
    
  // Revalidate routes to immediately reflect changes
  revalidatePath("/", "layout");
  revalidatePath("/x9");
}
