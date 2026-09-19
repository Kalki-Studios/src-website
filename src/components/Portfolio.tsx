"use client";

"use client";

import { useState } from "react";

type Project = {
  title: string;
  tag: string;
  badge: string;
  accent: string;
  description: string;
  gradientFrom: string;
  gradientTo: string;
};

const PROJECTS: Project[] = [
  {
    title: "Smart Attendance System",
    tag: "IoT + Web",
    badge: "badge-iot",
    accent: "#D97706",
    description: "RFID-based attendance tracking with real-time dashboard for college departments.",
    gradientFrom: "#D97706",
    gradientTo: "#F59E0B",
  },
  {
    title: "Crop Disease Detector",
    tag: "ML / AI",
    badge: "badge-ml",
    accent: "#0891B2",
    description: "CNN-based leaf disease classification from mobile photos — 92% accuracy.",
    gradientFrom: "#0891B2",
    gradientTo: "#06B6D4",
  },
  {
    title: "College Event Portal",
    tag: "Web App",
    badge: "badge-web",
    accent: "#2563EB",
    description: "Full-stack event management — registration, scheduling, e-certificates.",
    gradientFrom: "#2563EB",
    gradientTo: "#3B82F6",
  },
  {
    title: "Student Fee Tracker",
    tag: "Desktop",
    badge: "badge-desktop",
    accent: "#059669",
    description: "Windows app for fee records, receipts, and overdue alerts.",
    gradientFrom: "#059669",
    gradientTo: "#10B981",
  },
  {
    title: "Traffic Flow Analyzer",
    tag: "ML / AI",
    badge: "badge-ml",
    accent: "#0891B2",
    description: "OpenCV vehicle counting and congestion detection from CCTV footage.",
    gradientFrom: "#0891B2",
    gradientTo: "#0284C7",
  },
  {
    title: "Pharmacy Inventory App",
    tag: "Mobile App",
    badge: "badge-app",
    accent: "#7C3AED",
    description: "Android stock management with expiry alerts and billing.",
    gradientFrom: "#7C3AED",
    gradientTo: "#8B5CF6",
  },
  {
    title: "Home Automation Controller",
    tag: "IoT",
    badge: "badge-iot",
    accent: "#D97706",
    description: "ESP8266 + mobile app for remote appliance control via voice and touch.",
    gradientFrom: "#D97706",
    gradientTo: "#EF4444",
  },
  {
    title: "Library Book Recommender",
    tag: "ML + Web",
    badge: "badge-ml",
    accent: "#0891B2",
    description: "Collaborative filtering recommendation system with a React frontend.",
    gradientFrom: "#0891B2",
    gradientTo: "#7C3AED",
  },
  {
    title: "Online Complaint Portal",
    tag: "Web App",
    badge: "badge-web",
    accent: "#2563EB",
    description: "Municipal complaint submission system with status tracking for civic issues.",
    gradientFrom: "#2563EB",
    gradientTo: "#059669",
  },
  {
    title: "Employee Leave Manager",
    tag: "Web App",
    badge: "badge-web",
    accent: "#2563EB",
    description: "HR leave request, approval, and balance tracking with email alerts.",
    gradientFrom: "#2563EB",
    gradientTo: "#6B7280",
  },
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div
      className="group rounded-sm overflow-hidden transition-all duration-150"
      style={{
        border: "1px solid var(--rule)",
        background: "var(--paper)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 16px 0 rgba(22,35,58,0.08)";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image placeholder — gradient fill */}
      <div
        className="h-28 w-full"
        style={{
          background: `linear-gradient(135deg, ${project.gradientFrom}22, ${project.gradientTo}44)`,
          borderBottom: "1px solid var(--rule)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          padding: "1rem 1.25rem",
        }}
      >
        <span
          className="text-xs font-semibold tracking-tight"
          style={{ color: project.accent, opacity: 0.8 }}
        >
          {project.title}
        </span>
      </div>

      {/* Card body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div
            className="text-sm font-semibold leading-snug"
            style={{ color: "var(--ink)", letterSpacing: "-0.01em" }}
          >
            {project.title}
          </div>
          <span
            className={`shrink-0 inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-sm ${project.badge}`}
          >
            {project.tag}
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "var(--mute)" }}>
          {project.description}
        </p>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? PROJECTS : PROJECTS.slice(0, 6);

  return (
    <section
      id="work"
      className="relative py-20"
      style={{ borderBottom: "1px solid var(--rule)" }}
    >
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div
              className="text-xs font-medium tracking-widest uppercase mb-4 flex items-center gap-2"
              style={{ color: "var(--mute)" }}
            >
              <span className="inline-block w-6 h-px" style={{ background: "var(--rule)" }} />
              Previous work
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold"
              style={{ letterSpacing: "-0.02em", maxWidth: "22ch" }}
            >
              Projects we&apos;ve built
            </h2>
          </div>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>

        {showAll && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(false)}
              className="text-sm transition-colors duration-150"
              style={{ color: "var(--mute)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--ink)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--mute)")}
            >
              Show less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
