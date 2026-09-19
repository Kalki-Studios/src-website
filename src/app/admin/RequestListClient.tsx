"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDaysLeft, getUrgency, CATEGORY_LABELS, STATUS_LABELS, BUDGET_LABELS } from "@/lib/utils/helpers";
import { toggleStar, deleteRequest } from "./actions";

type RequestData = any; // We can type this strictly later if needed

export function RequestListClient({ initialRequests }: { initialRequests: RequestData[] }) {
  const [requests, setRequests] = useState<RequestData[]>(initialRequests);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDeletingId(id);
  };

  const confirmDelete = async () => {
    if (!deletingId) return;
    const id = deletingId;
    setDeletingId(null);
    
    // Optimistic update
    setRequests(prev => prev.filter(r => r.id !== id));
    await deleteRequest(id);
  };

  const counts = {
    new: requests.filter(r => r.status === "new").length,
    reviewing: requests.filter(r => r.status === "reviewing").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    in_progress: requests.filter(r => r.status === "in_progress").length,
    completed: requests.filter(r => r.status === "completed").length,
    rejected: requests.filter(r => r.status === "rejected").length,
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
          onClick={() => setFilterStatus("in_progress")}
          className={filterStatus === "in_progress" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
        >
          In Progress {counts.in_progress}
        </button>
        <span>·</span>
        <button 
          onClick={() => setFilterStatus("completed")}
          className={filterStatus === "completed" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
        >
          Completed {counts.completed}
        </button>
        <span>·</span>
        <button 
          onClick={() => setFilterStatus("rejected")}
          className={filterStatus === "rejected" ? "text-[var(--ink)]" : "hover:text-[var(--ink)]"}
        >
          Rejected {counts.rejected}
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
                  className="text-xl leading-none focus:outline-none hidden sm:block mt-1"
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

                <div className="flex flex-col items-end shrink-0 gap-4 mt-1">
                  <div className="font-mono text-xs font-bold text-[var(--mute)]">{req.refCode}</div>
                  <button 
                    onClick={(e) => handleDeleteClick(req.id, e)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 max-w-sm w-full rounded shadow-xl">
            <h3 className="text-lg font-bold text-[var(--ink)] mb-2">Delete Request?</h3>
            <p className="text-sm text-[var(--mute)] mb-6">
              Are you sure you want to delete this request? This action cannot be undone and will delete any attached files.
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-sm font-semibold border rounded hover:bg-gray-50"
                style={{ borderColor: "var(--rule)", color: "var(--ink)" }}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
