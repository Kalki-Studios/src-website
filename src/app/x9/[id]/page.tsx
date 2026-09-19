import { db } from "@/lib/db";
import { requests, attachments } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDaysLeft, CATEGORY_LABELS, BUDGET_LABELS } from "@/lib/utils/helpers";
import { RequestDetailClient } from "./RequestDetailClient";
import { getSettings } from "../settings-actions";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const reqId = resolvedParams.id;
  
  const reqs = await db.select().from(requests).where(eq(requests.id, reqId)).limit(1);
  if (reqs.length === 0) {
    return notFound();
  }
  
  const req = reqs[0];

  if (req.status === "new") {
    await db.update(requests).set({ status: "reviewing" }).where(eq(requests.id, req.id));
    req.status = "reviewing";
  }

  const reqAttachments = await db.select().from(attachments).where(eq(attachments.requestId, reqId)).orderBy(desc(attachments.createdAt));

  const currentSettings = await getSettings();

  return (
    <div className="min-h-screen bg-[var(--canvas)] pb-32">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pt-8">
        <Link href="/x9" className="inline-flex items-center text-sm font-bold text-[var(--mute)] hover:text-[var(--ink)] mb-8 transition-colors">
          <span className="mr-2 text-lg leading-none">←</span> Back to Dashboard
        </Link>
        
        <div className="bg-white border p-6 sm:p-10 shadow-sm relative overflow-hidden" style={{ borderColor: "var(--rule)" }}>
          <RequestDetailClient request={req} attachments={reqAttachments} whatsappTemplate={currentSettings.whatsappTemplate} />
        </div>
      </div>
    </div>
  );
}
