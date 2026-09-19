"use client";

import Link from "next/link";

export default function CTABand() {
  return (
    <section
      className="py-20"
      style={{ background: "var(--ink)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-xl">
          <h2
            className="text-2xl md:text-3xl font-bold mb-4 text-white"
            style={{ letterSpacing: "-0.02em" }}
          >
            Got a project idea?
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.55)" }}>
            Submit your requirement once. We review every request personally and only reach out
            if we can take it up — no automated responses, no generic replies.
          </p>
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-150"
            style={{
              background: "var(--paper)",
              color: "var(--ink)",
              borderRadius: "var(--radius)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.9")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Submit your project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
