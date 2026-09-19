import { db } from "@/lib/db";
import { requests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/utils/helpers";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Check Status — SRC e-solutions",
};

export default async function StatusPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const resolvedParams = await params;
  const code = resolvedParams.code.toUpperCase();
  
  if (!code.startsWith("SRC-")) {
    return notFound();
  }

  const [req] = await db.select({
    refCode: requests.refCode,
    title: requests.title,
    category: requests.category,
    status: requests.status,
  }).from(requests).where(eq(requests.refCode, code)).limit(1);

  if (!req) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center pt-24 px-6">
        <div className="max-w-md w-full bg-white border p-8 space-y-6 text-center" style={{ borderColor: "var(--rule)" }}>
          <h1 className="text-xl font-bold text-[var(--ink)]">Request Not Found</h1>
          <p className="text-sm text-[var(--mute)]">
            We couldn't find a project request with the code <span className="font-mono text-[var(--ink)] font-bold">{code}</span>.
          </p>
          <div className="pt-4">
            <Link 
              href="/submit"
              className="px-6 py-2 bg-[var(--ink)] text-white text-sm font-semibold transition-opacity hover:opacity-90 inline-block"
            >
              Submit a new request
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statusLabel = STATUS_LABELS[req.status || "new"] || "Unknown";
  const categoryLabel = CATEGORY_LABELS[req.category || "unsure"] || "Unknown";

  let statusColor = "var(--ink)";
  if (req.status === "accepted") statusColor = "var(--go)";
  if (req.status === "rejected") statusColor = "var(--mute)";
  if (req.status === "new") statusColor = "var(--ink)";

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center pt-24 px-6">
      <div className="max-w-md w-full bg-white border p-8 space-y-6" style={{ borderColor: "var(--rule)" }}>
        
        <div className="flex justify-between items-start">
          <div>
            <div className="text-xs font-semibold text-[var(--mute)] mb-1">REFERENCE CODE</div>
            <div className="font-mono text-xl tracking-wider font-bold text-[var(--ink)]">{req.refCode}</div>
          </div>
          <div 
            className="px-3 py-1 text-sm font-bold border rounded-sm" 
            style={{ borderColor: statusColor, color: statusColor, background: `color-mix(in srgb, ${statusColor} 10%, transparent)` }}
          >
            {statusLabel}
          </div>
        </div>

        <div className="pt-6 border-t space-y-4" style={{ borderColor: "var(--rule)" }}>
          <div>
            <div className="text-xs font-semibold text-[var(--mute)] mb-1">PROJECT TITLE</div>
            <div className="text-base font-bold text-[var(--ink)]">{req.title}</div>
          </div>
          
          <div>
            <div className="text-xs font-semibold text-[var(--mute)] mb-1">CATEGORY</div>
            <div className="text-sm text-[var(--ink)]">{categoryLabel}</div>
          </div>
        </div>

        <div className="pt-6 border-t" style={{ borderColor: "var(--rule)" }}>
          <p className="text-xs text-[var(--mute)] mb-4">
            If you need to make changes to your request, please submit a new one and mention this reference code in the description.
          </p>
          <div className="flex">
            <Link 
              href="/"
              className="px-6 py-2 border text-[var(--ink)] text-sm font-semibold text-center transition-colors hover:bg-gray-50 w-full"
              style={{ borderColor: "var(--rule)" }}
            >
              Back to Home
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
