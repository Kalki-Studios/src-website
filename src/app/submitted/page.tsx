import Link from "next/link";
import { CopyButton } from "./CopyButton";

export const metadata = {
  title: "Request Submitted — SRC e-solutions",
};

export default async function SubmittedPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code: rawCode } = await searchParams;
  const code = rawCode || "SRC-XXXX";

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center pt-24 px-6">
      <div className="max-w-md w-full bg-white border p-8 space-y-6" style={{ borderColor: "var(--rule)" }}>
        
        <div className="flex items-center gap-3 text-[var(--go)] font-bold text-xl">
          <span>✓</span>
          <span>Request submitted</span>
        </div>

        <div className="space-y-2 pt-4">
          <p className="text-sm font-semibold text-[var(--ink)]">Your reference code:</p>
          <div className="flex justify-between items-center border p-4 bg-gray-50" style={{ borderColor: "var(--rule)" }}>
            <span className="font-mono text-xl tracking-widest font-bold text-[var(--ink)]">{code}</span>
            <CopyButton text={code} />
          </div>
        </div>

        <div className="pt-6 border-t space-y-4" style={{ borderColor: "var(--rule)" }}>
          <p className="text-sm font-bold text-[var(--ink)]">What happens next:</p>
          <ol className="text-sm text-[var(--mute)] space-y-3 list-decimal list-outside ml-4">
            <li>We review your request (usually within 2–3 working days).</li>
            <li>If we can take it up, we'll contact you on the number provided.</li>
            <li>If you don't hear from us, it means we're fully booked or it wasn't the right fit.</li>
          </ol>
        </div>

        <div className="pt-6 border-t" style={{ borderColor: "var(--rule)" }}>
          <p className="text-sm font-bold text-red-600 bg-red-50 p-3 rounded mb-4 border border-red-100">
            NOTE: Keep this reference code for future requirements. It is strictly required to check your request status.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link 
              href={`/status?code=${code}`}
              className="px-4 py-2 bg-[var(--ink)] text-white text-sm font-semibold text-center transition-opacity hover:opacity-90"
            >
              Check status →
            </Link>
            <Link 
              href="/submit"
              className="px-4 py-2 border text-[var(--ink)] text-sm font-semibold text-center transition-colors hover:bg-gray-50"
              style={{ borderColor: "var(--rule)" }}
            >
              Submit another request
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
