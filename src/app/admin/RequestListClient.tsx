"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDaysLeft, getUrgency, CATEGORY_LABELS, STATUS_LABELS, BUDGET_LABELS } from "@/lib/utils/helpers";
import { toggleStar } from "./actions";

type RequestData = any; // We can type this strictly later if needed

export function RequestListClient({ initialRequests }: { initialRequests: RequestData[] }) {
  const [requests, setRequests] = useState<RequestData[]>(initialRequests);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = requests.filter(req => {
    if (filterStatus !== "all" && req.status !== filterStatus) return false;
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches = 
        req.studentName.toLowerCase().includes(q) ||
        req.college.toLowerCase().includes(q) ||
        req.title.toLowerCase().includes(q) ||
        req.refCode.toLowerCase().includes(q);
      if (!matches) return false;
    }
    
    return true;
  });

  const handleToggleStar = async (id: string, currentState: boolean) => {
    // Optimistic update
    setRequests(prev => prev.map(r => r.id === id ? { ...r, starred: !currentState } : r));
    await toggleStar(id, !currentState);
  };

  const counts = {
    new: requests.filter(r => r.status === "new").length,
    reviewing: requests.filter(r => r.status === "reviewing").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    all: requests.length,
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Filters */}
      <div className="flex flex-wrap gap-4 text-sm font-semibold text-[var(--mute)]">
        <button 
          onClick={() => setFilterStatus("new")}
          className={filterStatus === "new" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
        >
          New {counts.new}
        </button>
        <span>·</span>
        <button 
          onClick={() => setFilterStatus("reviewing")}
          className={filterStatus === "reviewing" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
        >
          Reviewing {counts.reviewing}
        </button>
        <span>·</span>
        <button 
          onClick={() => setFilterStatus("accepted")}
          className={filterStatus === "accepted" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
        >
          Accepted {counts.accepted}
        </button>
        <span>·</span>
        <button 
          onClick={() => setFilterStatus("all")}
          className={filterStatus === "all" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
        >
          All {counts.all}
        </button>
      </div>

      <div className="flex gap-4">
        <input 
          type="text" 
          placeholder="Search name, college, title..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:max-w-md p-2 border text-sm outline-none focus:border-[var(--ink)] transition-colors bg-white"
          style={{ borderColor: "var(--rule)" }}
        />
      </div>

      <div className="bg-white border divide-y" style={{ borderColor: "var(--rule)" }}>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-[var(--mute)] text-sm">
            No requests found.
          </div>
        ) : (
          filtered.map(req => {
            const urgency = getUrgency(req.deadline);
            const daysLeft = formatDaysLeft(req.deadline);
            let urgencyColor = "var(--ink)";
            if (urgency === "overdue" || urgency === "critical") urgencyColor = "var(--flag)";
            if (urgency === "comfortable") urgencyColor = "var(--mute)";

            return (
              <div key={req.id} className="p-4 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 transition-colors">
                
                <button 
                  onClick={() => handleToggleStar(req.id, req.starred)}
                  className="text-xl leading-none focus:outline-none hidden sm:block"
                  style={{ color: req.starred ? "#EAB308" : "var(--rule)" }}
                >
                  {req.starred ? "★" : "☆"}
                </button>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-xs font-semibold text-[var(--mute)]">
                      <span className="sm:hidden mr-2" onClick={() => handleToggleStar(req.id, req.starred)} style={{ color: req.starred ? "#EAB308" : "var(--rule)" }}>{req.starred ? "★" : "☆"}</span>
                      {req.studentName} · {req.college}
                    </div>
                    <div className="text-xs font-mono font-bold text-[var(--mute)]">
                      {req.refCode}
                    </div>
                  </div>
                  
                  <Link href={`/admin/${req.id}`} className="block">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-[var(--ink)] text-base">{req.title}</span>
                      <span className="text-xs border px-1.5 py-0.5" style={{ borderColor: "var(--rule)", color: "var(--mute)" }}>
                        {CATEGORY_LABELS[req.category] || req.category}
                      </span>
                      <span className="text-xs border px-1.5 py-0.5" style={{ borderColor: "var(--rule)", color: "var(--ink)", background: "color-mix(in srgb, var(--rule) 20%, transparent)" }}>
                        {STATUS_LABELS[req.status] || req.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm font-semibold tabular-nums">
                      <span style={{ color: urgencyColor }}>
                        {new Date(req.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} · {daysLeft}
                      </span>
                      <span className="text-[var(--mute)]">
                        {BUDGET_LABELS[req.budgetBand] || req.budgetBand}
                      </span>
                    </div>
                  </Link>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
