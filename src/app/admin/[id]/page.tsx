import { db } from "@/lib/db";
import { requests, attachments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDaysLeft, CATEGORY_LABELS, BUDGET_LABELS } from "@/lib/utils/helpers";
import { RequestDetailClient } from "./RequestDetailClient";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const [req] = await db.select().from(requests).where(eq(requests.id, resolvedParams.id)).limit(1);

  if (!req) {
    return notFound();
  }

  if (req.status === "new") {
    await db.update(requests).set({ status: "reviewing" }).where(eq(requests.id, req.id));
    req.status = "reviewing";
  }

  const reqAttachments = await db.select().from(attachments).where(eq(attachments.requestId, req.id));

  return (
    <div className="bg-white border pb-24" style={{ borderColor: "var(--rule)" }}>
      <div className="p-4 sm:p-6 border-b" style={{ borderColor: "var(--rule)" }}>
        <Link href="/admin" className="text-sm font-semibold text-[var(--mute)] hover:text-[var(--ink)] mb-4 inline-block">
          ← Back
        </Link>
        <RequestDetailClient request={req} attachments={reqAttachments} />
      </div>
    </div>
  );
}
