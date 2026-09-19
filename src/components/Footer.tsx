"use client";

export default function Footer() {
  return (
    <footer
      className="py-10"
      style={{ background: "var(--ink)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Wordmark */}
        <div className="flex items-baseline gap-1 select-none">
          <span
            className="text-base tracking-tight font-bold text-white"
            style={{ letterSpacing: "-0.03em" }}
          >
            SRC
          </span>
          <span
            className="text-sm font-normal"
            style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "-0.01em" }}
          >
            e-solutions
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          <div
            className="text-xs flex items-center gap-1.5 cursor-default"
            style={{ color: "rgba(255,255,255,0.45)" }}
          >
            {/* Location icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Location
          </div>
        </div>

        {/* Copyright */}
        <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
          © 2026 SRC e-solutions
        </span>
      </div>
    </footer>
  );
}
