"use server";

import { db } from "@/lib/db";
import { requests, attachments } from "@/lib/db/schema";
import { generateRefCode } from "@/lib/utils/helpers";
import { or, eq, gte, and } from "drizzle-orm";
import nodemailer from "nodemailer";

export type SubmitResult =
  | { success: true; refCode: string }
  | { success: false; error: string };

export async function submitProjectRequest(formData: any): Promise<SubmitResult> {
  try {
    // ── 4-month cooldown check ──────────────────────────────────────
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

    const existing = await db
      .select({ id: requests.id, createdAt: requests.createdAt })
      .from(requests)
      .where(
        and(
          or(
            eq(requests.phone, formData.phone),
            eq(requests.email, formData.email.toLowerCase())
          ),
          gte(requests.createdAt, fourMonthsAgo)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      const submittedAt = new Date(existing[0].createdAt);
      const canResubmitAt = new Date(submittedAt);
      canResubmitAt.setMonth(canResubmitAt.getMonth() + 4);
      const canResubmitStr = canResubmitAt.toLocaleDateString("en-GB", {
        day: "numeric", month: "long", year: "numeric"
      });
      return {
        success: false,
        error: `You have already submitted a project request recently. You can submit again after ${canResubmitStr}.`,
      };
    }
    // ───────────────────────────────────────────────────────────────

    const refCode = generateRefCode();

    const [newRequest] = await db.insert(requests).values({
      refCode,
      studentName: formData.studentName,
      college: formData.college,
      phone: formData.phone,
      whatsapp: formData.whatsapp || formData.phone,
      email: formData.email.toLowerCase(),
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
          storageKey: file.key ?? file.url,
          fileUrl: file.url,
          fileName: file.name,
          sizeBytes: file.size,
        }))
      );
    }

    // ── Send Email Notification ─────────────────────────────────────────
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_APP_PASSWORD,
          },
        });

        const mailOptions = {
          from: `SRC Notifier <${process.env.EMAIL_USER}>`,
          to: process.env.EMAIL_USER, // Send notification to himself
          subject: `🚨 New Request: ${refCode} - ${formData.title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #111827;">New Project Request Submitted!</h2>
              <p><strong>Ref Code:</strong> ${refCode}</p>
              <p><strong>Student:</strong> ${formData.studentName} (${formData.college})</p>
              <p><strong>Phone / WhatsApp:</strong> ${formData.phone} / ${formData.whatsapp || formData.phone}</p>
              <p><strong>Email:</strong> ${formData.email}</p>
              <p><strong>Category:</strong> ${formData.category}</p>
              <p><strong>Title:</strong> ${formData.title}</p>
              <p><strong>Deadline:</strong> ${new Date(formData.deadline).toLocaleDateString("en-GB")}</p>
              <p><strong>Budget:</strong> ${formData.budgetBand}</p>
              <br/>
              <p><strong>Description:</strong></p>
              <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                <p style="margin: 0; white-space: pre-wrap;">${formData.description}</p>
              </div>
              <br/>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/x9" style="display: inline-block; padding: 12px 24px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">View on Dashboard</a>
            </div>
          `,
        };

        // Fire and forget so we don't delay the response to the user
        transporter.sendMail(mailOptions).catch(err => {
          console.error("Failed to send email notification:", err);
        });
      } catch (emailErr) {
        console.error("Failed to setup email transporter:", emailErr);
      }
    }
    // ──────────────────────────────────────────────────────────────────

    return { success: true, refCode };
  } catch (error: any) {
    console.error("Submission failed:", error);
    console.error("Error Code:", error.code);
    console.error("Error Detail:", error.detail);
    console.error("Error Message:", error.message);
    return { success: false, error: error.message || "Failed to submit request" };
  }
}
