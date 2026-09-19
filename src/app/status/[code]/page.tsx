import { db } from "@/lib/db";
import { requests } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { CATEGORY_LABELS, STATUS_LABELS, BUDGET_LABELS } from "@/lib/utils/helpers";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Check Status — SRC e-solutions",
};

const STATUS_ICONS: Record<string, string> = {
  new: "○",
  reviewing: "◷",
  accepted: "✓",
  "in-progress": "◈",
  completed: "★",
  rejected: "✕",
};

const STATUS_MESSAGES: Record<string, { heading: string; body: string }> = {
  new: {
    heading: "Request received",
    body: "We have received your project request and it is in our queue. We typically review all requests within 2–3 working days.",
  },
  reviewing: {
    heading: "We are reviewing your request",
    body: "Our team is currently evaluating your project. We will contact you on the number you provided if we decide to take it up.",
  },
  accepted: {
    heading: "Request accepted!",
    body: "Great news — we have accepted your project request. Our team will get in touch with you shortly to discuss the next steps.",
  },
  "in-progress": {
    heading: "Project in progress",
    body: "Your project is actively being worked on by our team. We will keep you updated as we make progress.",
  },
  completed: {
    heading: "Project completed",
    body: "Your project has been completed and delivered. Thank you for working with SRC e-solutions!",
  },
  rejected: {
    heading: "Request not accepted",
    body: "We were unable to take up this project at this time — it may not have been the right fit or we may be fully booked. Feel free to submit a new request in the future.",
  },
};

const STATUS_COLORS: Record<string, string> = {
  new: "var(--ink)",
  reviewing: "#7C3AED",
  accepted: "var(--go)",
  "in-progress": "#0EA5E9",
  completed: "#059669",
  rejected: "var(--mute)",
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

  const [req] = await db
    .select({
      refCode: requests.refCode,
      title: requests.title,
      category: requests.category,
      status: requests.status,
      studentName: requests.studentName,
      college: requests.college,
      deadline: requests.deadline,
      budgetBand: requests.budgetBand,
      createdAt: requests.createdAt,
    })
    .from(requests)
    .where(eq(requests.refCode, code))
    .limit(1);

  if (!req) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center pt-24 px-6">
        {/* Grid background */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
            opacity: 0.4,
          }}
        />

        <div className="relative max-w-md w-full bg-white border p-10 space-y-6 text-center" style={{ borderColor: "var(--rule)" }}>
          <div className="text-4xl" style={{ color: "var(--mute)" }}>✕</div>
          <div>
            <h1 className="text-xl font-bold text-[var(--ink)] mb-2">Request Not Found</h1>
            <p className="text-sm text-[var(--mute)]">
              We could not find a project request with the code{" "}
              <span className="font-mono text-[var(--ink)] font-bold">{code}</span>.
              <br />
              Please double-check the code and try again.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
            <Link
              href="/status"
              className="px-6 py-2.5 bg-[var(--ink)] text-white text-sm font-semibold transition-opacity hover:opacity-90 inline-block"
            >
              Try again
            </Link>
            <Link
              href="/submit"
              className="px-6 py-2.5 border text-[var(--ink)] text-sm font-semibold text-center transition-colors hover:bg-gray-50"
              style={{ borderColor: "var(--rule)" }}
            >
              Submit a new request
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const status = req.status || "new";
  const statusLabel = STATUS_LABELS[status] || "Unknown";
  const categoryLabel = CATEGORY_LABELS[req.category || "unsure"] || "Unknown";
  const budgetLabel = BUDGET_LABELS[req.budgetBand || ""] || req.budgetBand;
  const statusColor = STATUS_COLORS[status] || "var(--ink)";
  const statusIcon = STATUS_ICONS[status] || "○";
  const statusMsg = STATUS_MESSAGES[status] || STATUS_MESSAGES.new;

  const submittedDate = new Date(req.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const deadlineDate = new Date(req.deadline).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center pt-20 pb-16 px-6">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          opacity: 0.4,
        }}
      />

      <div className="relative max-w-lg w-full space-y-4 pt-10">

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-[var(--mute)] mb-1 tracking-widest uppercase">Request Status</p>
          <h1 className="text-2xl font-bold text-[var(--ink)]">Track your project request</h1>
        </div>

        {/* Status Card */}
        <div className="bg-white border p-6 space-y-5" style={{ borderColor: "var(--rule)" }}>

          {/* Ref + Status badge row */}
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--mute)" }}>Reference Code</div>
              <div className="font-mono text-xl font-bold tracking-wider" style={{ color: "var(--ink)" }}>{req.refCode}</div>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold border"
              style={{
                borderColor: statusColor,
                color: statusColor,
                background: `color-mix(in srgb, ${statusColor} 8%, transparent)`,
              }}
            >
              <span>{statusIcon}</span>
              <span>{statusLabel}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: "var(--rule)" }} />

          {/* Status message */}
          <div className="py-1 space-y-1">
            <h2 className="text-base font-bold" style={{ color: statusColor }}>{statusMsg.heading}</h2>
            <p className="text-sm text-[var(--mute)] leading-relaxed">{statusMsg.body}</p>
          </div>

          {/* Divider */}
          <div className="border-t" style={{ borderColor: "var(--rule)" }} />

          {/* Request details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--mute)" }}>Project Title</div>
              <div className="font-semibold" style={{ color: "var(--ink)" }}>{req.title}</div>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--mute)" }}>Category</div>
              <div className="font-semibold" style={{ color: "var(--ink)" }}>{categoryLabel}</div>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--mute)" }}>Submitted On</div>
              <div className="font-semibold" style={{ color: "var(--ink)" }}>{submittedDate}</div>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--mute)" }}>Your Deadline</div>
              <div className="font-semibold" style={{ color: "var(--ink)" }}>{deadlineDate}</div>
            </div>
          </div>

        </div>

        {/* Progress tracker */}
        <div className="bg-white border p-6" style={{ borderColor: "var(--rule)" }}>
          <p className="text-xs font-semibold tracking-widest uppercase mb-5" style={{ color: "var(--mute)" }}>Progress</p>
          <div className="flex items-center gap-0">
            {(["new", "reviewing", "accepted", "in-progress", "completed"] as string[]).map((s, i, arr) => {
              const stages = ["new", "reviewing", "accepted", "in-progress", "completed"];
              const currentIdx = stages.indexOf(status);
              const thisIdx = stages.indexOf(s);
              const isDone = thisIdx <= currentIdx && status !== "rejected";
              const isActive = s === status && status !== "rejected";
              const stageLabels: Record<string, string> = {
                new: "Received",
                reviewing: "Reviewing",
                accepted: "Accepted",
                "in-progress": "In Progress",
                completed: "Done",
              };

              return (
                <div key={s} className="flex items-center" style={{ flex: i < arr.length - 1 ? "1" : "0" }}>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-7 h-7 flex items-center justify-center text-xs font-bold border-2 transition-colors"
                      style={{
                        borderColor: isDone ? statusColor : "var(--rule)",
                        background: isActive ? statusColor : isDone ? `color-mix(in srgb, ${statusColor} 15%, transparent)` : "white",
                        color: isActive ? "white" : isDone ? statusColor : "var(--mute)",
                        borderRadius: "50%",
                      }}
                    >
                      {isDone && !isActive ? "✓" : i + 1}
                    </div>
                    <div
                      className="text-xs mt-1.5 font-medium text-center"
                      style={{ color: isDone ? "var(--ink)" : "var(--mute)", fontSize: "0.65rem", width: "3.5rem" }}
                    >
                      {stageLabels[s]}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className="h-0.5 flex-1 mx-1 mb-5"
                      style={{
                        background: thisIdx < currentIdx && status !== "rejected"
                          ? statusColor
                          : "var(--rule)",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {status === "rejected" && (
            <p className="text-xs text-[var(--mute)] mt-4 text-center">This request was not accepted.</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/status"
            className="px-5 py-2.5 border text-sm font-semibold text-center transition-colors hover:bg-gray-50 flex-1"
            style={{ borderColor: "var(--rule)", color: "var(--ink)" }}
          >
            Check another request
          </Link>
          <Link
            href="/"
            className="px-5 py-2.5 bg-[var(--ink)] text-white text-sm font-semibold text-center transition-opacity hover:opacity-90 flex-1"
          >
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
