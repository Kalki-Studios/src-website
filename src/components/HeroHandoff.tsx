"use client";

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ── Reduced-motion hook ── */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/* ── Demo data ── */
const DEMO = {
  type: "ML / AI",
  title: "Smart Attendance System",
  description:
    "Face recognition-based attendance for college labs — auto-marks students present when they enter the room.",
  deadline: "12 Nov 2026",
  budget: "₹3,000 – ₹6,000",
  name: "Ravi Kumar",
  college: "JNTU Hyderabad",
  phone: "+91 98765 43210",
  refCode: "SRC-7K2M",
  daysLeft: "54 days left",
};

/* ── Field stagger timings (ms) ── */
const FIELDS: { label: string; value: string; delay: number }[] = [
  { label: "Category",    value: DEMO.type,        delay: 300 },
  { label: "Title",       value: DEMO.title,        delay: 600 },
  { label: "Description", value: DEMO.description,  delay: 900 },
  { label: "Deadline",    value: DEMO.deadline,      delay: 1400 },
  { label: "Budget",      value: DEMO.budget,        delay: 1700 },
  { label: "Name",        value: `${DEMO.name} · ${DEMO.college}`, delay: 2000 },
];

/* ── Sub-components ── */
function FormField({ label, value, visible }: { label: string; value: string; visible: boolean }) {
  return (
    <div className="mb-3 min-h-[44px]">
      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: "var(--mute)" }}>
        {label}
      </div>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="text-sm font-medium leading-snug"
            style={{ color: "var(--ink)" }}
          >
            {value}
          </motion.div>
        )}
      </AnimatePresence>
      {!visible && <div className="h-[18px] w-3/4 rounded" style={{ background: "var(--rule)" }} />}
    </div>
  );
}

function CategoryBadge({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-sm badge-ml"
      style={{ borderRadius: "3px" }}
    >
      {label}
    </span>
  );
}

function StatusBadge({ animate }: { animate: boolean }) {
  return (
    <motion.span
      className="inline-flex items-center text-[11px] font-semibold px-2 py-0.5"
      style={{
        background: "color-mix(in srgb, #2563EB 12%, transparent)",
        color: "#2563EB",
        border: "1px solid color-mix(in srgb, #2563EB 30%, transparent)",
        borderRadius: "3px",
      }}
      animate={
        animate
          ? { opacity: [1, 0.2, 1], scale: [1, 1.08, 1] }
          : {}
      }
      transition={{ duration: 0.18, ease: "easeOut" }}
    >
      New
    </motion.span>
  );
}

/* ── Main component ── */
export default function HeroHandoff() {
  const reducedMotion = usePrefersReducedMotion();
  const [phase, setPhase] = useState<"idle" | "filling" | "sending" | "landed" | "done">(
    reducedMotion ? "done" : "idle"
  );
  const [visibleFields, setVisibleFields] = useState<number>(reducedMotion ? FIELDS.length : 0);
  const [chipPulse, setChipPulse] = useState(false);
  const timeouts = useRef<NodeJS.Timeout[]>([]);

  const clearAll = () => timeouts.current.forEach(clearTimeout);

  const runSequence = () => {
    if (reducedMotion) return;
    clearAll();
    setPhase("filling");
    setVisibleFields(0);
    setChipPulse(false);

    // Stagger fields
    FIELDS.forEach((f, i) => {
      const t = setTimeout(() => setVisibleFields(i + 1), f.delay);
      timeouts.current.push(t);
    });

    // Trigger send after last field
    const sendDelay = FIELDS[FIELDS.length - 1].delay + 600;
    timeouts.current.push(setTimeout(() => setPhase("sending"), sendDelay));
    timeouts.current.push(setTimeout(() => setPhase("landed"), sendDelay + 600));
    timeouts.current.push(
      setTimeout(() => {
        setChipPulse(true);
        setTimeout(() => setChipPulse(false), 200);
      }, sendDelay + 650)
    );
    timeouts.current.push(setTimeout(() => setPhase("done"), sendDelay + 900));
  };

  useEffect(() => {
    // Auto-start after 800ms on mount
    const t = setTimeout(runSequence, 800);
    timeouts.current.push(t);
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSending = phase === "sending";
  const hasLanded = phase === "landed" || phase === "done";
  const showAll = reducedMotion || hasLanded;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20">
      {/* Grid texture background */}
      <div className="absolute inset-0 grid-texture-faint pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 w-full">

        {/* Top label */}
        <div
          className="text-xs font-medium tracking-widest uppercase mb-8 flex items-center gap-2"
          style={{ color: "var(--mute)" }}
        >
          <span className="inline-block w-6 h-px" style={{ background: "var(--rule)" }} />
          How it works
        </div>

        {/* Heading — left aligned, never centered */}
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
          style={{ letterSpacing: "-0.03em", maxWidth: "16ch" }}
        >
          Turn your project idea into a working prototype.
        </h1>
        <p className="text-base mb-12 prose-width" style={{ color: "var(--mute)" }}>
          Submit your requirement once. We review every request personally and only reach out
          to students whose projects we can take up.
        </p>

        {/* ── The Handoff Split View ─────────────────────────────── */}
        <div className="relative flex flex-col md:flex-row gap-0 md:gap-0 mb-10">

          {/* Left — Student form card */}
          <motion.div
            className="flex-1 relative"
            animate={
              !reducedMotion && isSending
                ? { x: "calc(50% + 1px)", opacity: 0, scale: 0.97 }
                : { x: 0, opacity: 1, scale: 1 }
            }
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Panel label */}
            <div className="text-[11px] uppercase tracking-widest mb-3 font-medium" style={{ color: "var(--mute)" }}>
              Student submits
            </div>

            <div
              className="rounded-sm p-5"
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper)",
                boxShadow: "0 1px 3px 0 rgba(22,35,58,0.06)",
              }}
            >
              {/* Form card header */}
              <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid var(--rule)" }}>
                <span className="text-xs font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
                  Project Request
                </span>
                <span className="text-[10px]" style={{ color: "var(--mute)" }}>srcesolutions.com/submit</span>
              </div>

              {/* Fields */}
              {FIELDS.map((f, i) => (
                <FormField
                  key={f.label}
                  label={f.label}
                  value={f.value}
                  visible={reducedMotion || visibleFields > i}
                />
              ))}

              {/* Send button */}
              <motion.button
                className="mt-4 w-full py-2.5 text-sm font-medium text-center transition-all"
                style={{
                  background: "var(--ink)",
                  color: "var(--paper)",
                  borderRadius: "var(--radius)",
                  opacity: reducedMotion || visibleFields >= FIELDS.length ? 1 : 0.4,
                }}
                animate={
                  !reducedMotion && phase === "filling" && visibleFields >= FIELDS.length
                    ? { scale: [1, 1.02, 1] }
                    : isSending
                    ? { opacity: 0.6 }
                    : {}
                }
                transition={{ duration: 0.3, repeat: 2, repeatType: "reverse" }}
              >
                {isSending ? "Sending…" : "Send project request"}
              </motion.button>
            </div>
          </motion.div>

          {/* Center divider — desktop only */}
          <div className="hidden md:flex flex-col items-center justify-center px-6 relative z-10">
            <div className="h-full w-px absolute" style={{ background: "var(--rule)" }} />
            <div
              className="relative z-10 px-2 py-1 text-[10px] font-semibold tracking-widest uppercase text-center"
              style={{
                background: "var(--paper)",
                color: "var(--mute)",
                border: "1px solid var(--rule)",
                writingMode: "vertical-rl",
                borderRadius: "2px",
                letterSpacing: "0.12em",
              }}
            >
              SRC e-solutions
            </div>
          </div>

          {/* Mobile divider */}
          <div className="flex md:hidden items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: "var(--rule)" }} />
            <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: "var(--mute)" }}>
              → Received by SRC e-solutions
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--rule)" }} />
          </div>

          {/* Right — Dashboard card */}
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-widest mb-3 font-medium" style={{ color: "var(--mute)" }}>
              Arrives in dashboard
            </div>

            <div
              className="rounded-sm overflow-hidden"
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper)",
                opacity: reducedMotion || hasLanded ? 1 : 0.35,
                transition: "opacity 0.3s ease",
              }}
            >
              {/* Dashboard header row */}
              <div
                className="px-4 py-2.5 flex items-center gap-2 text-[11px] font-medium"
                style={{ borderBottom: "1px solid var(--rule)", background: "#FAFBFD", color: "var(--mute)" }}
              >
                <span className="flex-1">Student</span>
                <span className="w-32 hidden sm:block">Project</span>
                <span className="w-20 text-right hidden sm:block">Deadline</span>
                <span className="w-16 text-right">Status</span>
              </div>

              {/* The landing row */}
              <motion.div
                className="px-4 py-3 flex items-start gap-2"
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={hasLanded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {/* Student info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "var(--ink)" }}>
                    {DEMO.name}
                  </div>
                  <div className="text-xs truncate" style={{ color: "var(--mute)" }}>
                    {DEMO.college}
                  </div>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 items-center">
                    <CategoryBadge label={DEMO.type} />
                    <span className="text-xs font-medium" style={{ color: "var(--ink)" }}>
                      {DEMO.title}
                    </span>
                  </div>
                </div>

                {/* Deadline */}
                <div className="hidden sm:block w-20 text-right">
                  <div className="text-xs font-medium tabular" style={{ color: "var(--ink)" }}>
                    {DEMO.deadline}
                  </div>
                  <div className="text-[11px]" style={{ color: "var(--mute)" }}>
                    {DEMO.daysLeft}
                  </div>
                </div>

                {/* Status + ref */}
                <div className="w-16 flex flex-col items-end gap-1">
                  <StatusBadge animate={chipPulse} />
                  <span
                    className="mono text-[10px]"
                    style={{ color: "var(--mute)" }}
                  >
                    {DEMO.refCode}
                  </span>
                </div>
              </motion.div>

              {/* Blurred ghost rows beneath */}
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="px-4 py-3 flex items-center gap-2"
                  style={{
                    borderTop: "1px solid var(--rule)",
                    opacity: 0.35 - i * 0.1,
                    filter: "blur(1.5px)",
                  }}
                >
                  <div className="flex-1">
                    <div className="h-3 w-24 rounded mb-1" style={{ background: "var(--rule)" }} />
                    <div className="h-2.5 w-16 rounded" style={{ background: "var(--rule)" }} />
                  </div>
                  <div className="h-5 w-10 rounded-sm" style={{ background: "var(--rule)" }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Supporting line + CTA */}
        <p className="text-sm mb-6" style={{ color: "var(--mute)" }}>
          Students submit. You review. You choose which ones to take.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-all duration-150"
            style={{
              background: "var(--ink)",
              color: "var(--paper)",
              borderRadius: "var(--radius)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
          >
            Submit your project
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M2.5 7h9M7.5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* Replay button */}
          {!reducedMotion && phase === "done" && (
            <button
              onClick={runSequence}
              className="text-xs flex items-center gap-1.5 transition-colors duration-150"
              style={{ color: "var(--mute)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--mute)")}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M1.5 6A4.5 4.5 0 1 0 6 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M1.5 2.5v3h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Replay
            </button>
          )}
        </div>
      </div>

      {/* Bottom rule */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--rule)" }} />
    </section>
  );
}
