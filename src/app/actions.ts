"use server";

import { db } from "@/lib/db";
import { requests, attachments } from "@/lib/db/schema";
import { generateRefCode } from "@/lib/utils/helpers";

export type SubmitResult =
  | { success: true; refCode: string }
  | { success: false; error: string };

export async function submitProjectRequest(formData: any): Promise<SubmitResult> {
  try {
    const refCode = generateRefCode();

    const [newRequest] = await db.insert(requests).values({
      refCode,
      studentName: formData.studentName,
      college: formData.college,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email,
      category: formData.category,
      title: formData.title,
      description: formData.description,
      deliverable: formData.deliverable,
      techNotes: formData.techNotes || null,
      branchAnswers: formData.branchAnswers || {},
      deadline: formData.deadline,
      budgetBand: formData.budgetBand,
      extraNotes: formData.extraNotes || null,
    }).returning({ id: requests.id });

    if (formData.files && formData.files.length > 0) {
      await db.insert(attachments).values(
        formData.files.map((file: any) => ({
          requestId: newRequest.id,
          storageKey: file.key ?? file.url,  // UploadThing key or fallback to URL
          fileUrl: file.url,
          fileName: file.name,
          sizeBytes: file.size,
        }))
      );
    }

    return { success: true, refCode };
  } catch (error: any) {
    console.error("Submission failed:", error);
    return { success: false, error: error.message || "Failed to submit request" };
  }
}
