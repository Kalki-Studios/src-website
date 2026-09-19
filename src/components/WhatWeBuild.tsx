"use client";

const CATEGORIES = [
  {
    icon: "</>",
    label: "Website / Web App",
    description: "Frontend, backend, dashboards, portals",
    badge: "badge-web",
    accent: "#2563EB",
  },
  {
    icon: "📱",
    label: "Mobile App",
    description: "Android-first, or cross-platform",
    badge: "badge-app",
    accent: "#7C3AED",
  },
  {
    icon: "◈",
    label: "ML / AI",
    description: "Classification, detection, prediction, NLP",
    badge: "badge-ml",
    accent: "#0891B2",
  },
  {
    icon: "⌁",
    label: "IoT / Hardware",
    description: "Arduino, Raspberry Pi, sensors, automation",
    badge: "badge-iot",
    accent: "#D97706",
  },
  {
    icon: "▣",
    label: "Desktop Software",
    description: "Windows applications, tools, utilities",
    badge: "badge-desktop",
    accent: "#059669",
  },
  {
    icon: "?",
    label: "Other / Not Sure",
    description: "Describe it — we'll figure it out together",
    badge: "badge-other",
    accent: "#6B7280",
  },
];

export default function WhatWeBuild() {
  return (
    <section id="categories" className="relative py-20" style={{ borderBottom: "1px solid var(--rule)" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Section header */}
        <div className="mb-12">
          <div
            className="text-xs font-medium tracking-widest uppercase mb-4 flex items-center gap-2"
            style={{ color: "var(--mute)" }}
          >
            <span className="inline-block w-6 h-px" style={{ background: "var(--rule)" }} />
            What we build
          </div>
          <h2
            className="text-2xl md:text-3xl font-bold"
            style={{ letterSpacing: "-0.02em", maxWidth: "22ch" }}
          >
            Six types of projects. One place to submit.
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ border: "1px solid var(--rule)", borderRadius: "var(--radius)", overflow: "hidden" }}
        >
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="group p-6 transition-colors duration-150 cursor-default"
              style={{
                background: "var(--paper)",
                borderRight: "1px solid var(--rule)",
                borderBottom: "1px solid var(--rule)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#FAFBFD";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--paper)";
              }}
            >
              {/* Icon */}
              <div
                className="text-xl font-mono font-bold mb-4 w-10 h-10 flex items-center justify-center rounded-sm"
                style={{
                  background: `color-mix(in srgb, ${cat.accent} 10%, transparent)`,
                  color: cat.accent,
                  fontSize: "1.1rem",
                }}
              >
                {cat.icon}
              </div>

              {/* Label */}
              <div
                className="text-sm font-semibold mb-1.5"
                style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
              >
                {cat.label}
              </div>

              {/* Description */}
              <div className="text-sm leading-relaxed" style={{ color: "var(--mute)" }}>
                {cat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
