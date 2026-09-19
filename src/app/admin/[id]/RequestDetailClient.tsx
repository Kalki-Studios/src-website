"use client";

import React, { useState } from "react";
import { updateStatus, updateAdminNotes } from "../actions";
import { formatDaysLeft, CATEGORY_LABELS, BUDGET_LABELS } from "@/lib/utils/helpers";

export function RequestDetailClient({ request, attachments }: { request: any, attachments: any[] }) {
  const [status, setStatus] = useState(request.status);
  const [notes, setNotes] = useState(request.adminNotes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus); // Optimistic UI
    await updateStatus(request.id, newStatus);
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await updateAdminNotes(request.id, notes);
    setSavingNotes(false);
  };

  const handleCopyDetails = () => {
    const text = `Request: ${request.refCode}\nTitle: ${request.title}\nStudent: ${request.studentName} (${request.college})\nPhone: ${request.phone}\nDeadline: ${new Date(request.deadline).toLocaleDateString()}\nBudget: ${BUDGET_LABELS[request.budgetBand]}\n\nDescription:\n${request.description}`;
    navigator.clipboard.writeText(text);
    alert("Details copied to clipboard!");
  };

  const whatsappMessage = `Hi ${request.studentName.split(" ")[0]}, this is regarding your project request ${request.refCode} (${request.title}). I can take this up. Let's discuss the details.`;
  const whatsappUrl = `https://wa.me/${request.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-mono font-bold text-lg text-[var(--ink)] tracking-wider mb-1">{request.refCode}</div>
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--ink)]">{request.title}</h1>
          <div className="text-sm text-[var(--mute)] mt-1">
            {CATEGORY_LABELS[request.category]} · Submitted {new Date(request.createdAt).toLocaleDateString("en-GB")}
          </div>
        </div>
        
        <select 
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          className="p-2 text-sm font-bold border rounded outline-none appearance-none"
          style={{ 
            borderColor: "var(--rule)", 
            color: status === "accepted" ? "var(--go)" : "var(--ink)",
            background: "var(--paper)"
          }}
        >
          <option value="new">New ▾</option>
          <option value="reviewing">Reviewing ▾</option>
          <option value="accepted">Accepted ▾</option>
          <option value="rejected">Rejected ▾</option>
          <option value="not_taking">Not Taking ▾</option>
        </select>
      </div>

      <hr className="my-6 border-[var(--rule)]" />

      {/* STUDENT SECTION */}
      <section>
        <h2 className="text-xs font-bold text-[var(--mute)] tracking-wider mb-4">STUDENT</h2>
        <div className="text-sm text-[var(--ink)] space-y-1">
          <div className="font-bold">{request.studentName}</div>
          <div>{request.college}</div>
          <div className="pt-2 flex flex-col sm:flex-row gap-2 sm:gap-6">
            <a href={`tel:${request.phone}`} className="hover:underline">📞 {request.phone}</a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-[var(--go)]">💬 {request.whatsapp}</a>
            <a href={`mailto:${request.email}`} className="hover:underline">✉ {request.email}</a>
          </div>
        </div>
      </section>

      <hr className="my-6 border-[var(--rule)]" />

      {/* PROJECT SUMMARY */}
      <section>
        <h2 className="text-xs font-bold text-[var(--mute)] tracking-wider mb-4">PROJECT SUMMARY</h2>
        <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 text-sm">
          <div className="text-[var(--mute)]">Category</div>
          <div className="text-[var(--ink)] font-semibold">{CATEGORY_LABELS[request.category]}</div>
          
          <div className="text-[var(--mute)] mt-2 sm:mt-0">Needs</div>
          <div className="text-[var(--ink)] font-semibold">{request.deliverable}</div>
          
          <div className="text-[var(--mute)] mt-2 sm:mt-0">Deadline</div>
          <div className="text-[var(--ink)] font-semibold tabular-nums">{new Date(request.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {formatDaysLeft(request.deadline)}</div>
          
          <div className="text-[var(--mute)] mt-2 sm:mt-0">Budget</div>
          <div className="text-[var(--ink)] font-semibold">{BUDGET_LABELS[request.budgetBand]}</div>
          
          {request.techNotes && (
            <>
              <div className="text-[var(--mute)] mt-2 sm:mt-0">Technologies</div>
              <div className="text-[var(--ink)] font-semibold">{request.techNotes}</div>
            </>
          )}
        </div>
      </section>

      {Object.keys(request.branchAnswers || {}).length > 0 && (
        <>
          <h2 className="text-xs font-bold text-[var(--mute)] tracking-wider mt-8 mb-4">BRANCH ANSWERS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-2 text-sm">
            {Object.entries(request.branchAnswers).map(([k, v]) => (
              <React.Fragment key={k}>
                <div className="text-[var(--mute)] break-words">{k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                <div className="text-[var(--ink)] font-semibold">{v as string}</div>
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      <hr className="my-6 border-[var(--rule)]" />

      {/* DESCRIPTION */}
      <section>
        <h2 className="text-xs font-bold text-[var(--mute)] tracking-wider mb-4">DESCRIPTION</h2>
        <p className="text-sm text-[var(--ink)] leading-relaxed whitespace-pre-wrap max-w-3xl">
          {request.description}
        </p>
      </section>

      {request.extraNotes && (
        <>
          <hr className="my-6 border-[var(--rule)]" />
          <section>
            <h2 className="text-xs font-bold text-[var(--mute)] tracking-wider mb-4">ADDITIONAL NOTES</h2>
            <p className="text-sm text-[var(--ink)] leading-relaxed whitespace-pre-wrap max-w-3xl">
              {request.extraNotes}
            </p>
          </section>
        </>
      )}

      {attachments.length > 0 && (
        <>
          <hr className="my-6 border-[var(--rule)]" />
          <section>
            <h2 className="text-xs font-bold text-[var(--mute)] tracking-wider mb-4">ATTACHMENTS</h2>
            <div className="space-y-2">
              {attachments.map(att => (
                <div key={att.id} className="flex justify-between items-center p-3 border bg-gray-50 text-sm max-w-2xl" style={{ borderColor: "var(--rule)" }}>
                  <span className="truncate max-w-[70%] font-mono text-[var(--ink)]">{att.fileName}</span>
                  <div className="flex gap-4">
                    <span className="text-[var(--mute)] tabular-nums font-mono">{Math.round(att.sizeBytes / 1024)} KB</span>
                    <a href={att.storagePath} target="_blank" rel="noopener noreferrer" className="font-semibold text-[var(--ink)] hover:underline">Download</a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <hr className="my-6 border-[var(--rule)]" />

      {/* PRIVATE NOTES */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xs font-bold text-[var(--mute)] tracking-wider">YOUR NOTES</h2>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-[var(--mute)] rounded-sm">private</span>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g. Quoted 5k, waiting for reply"
          rows={3}
          className="w-full max-w-2xl p-3 border outline-none focus:border-[var(--ink)] transition-colors text-sm"
          style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
        />
        <div className="mt-2">
          <button 
            onClick={handleSaveNotes}
            disabled={savingNotes}
            className="text-xs font-semibold px-4 py-2 border transition-colors hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: "var(--rule)", color: "var(--ink)" }}
          >
            {savingNotes ? "Saving..." : "Save notes"}
          </button>
        </div>
      </section>

      {/* FIXED BOTTOM ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3">
          <a 
            href={whatsappUrl}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 py-3 bg-[var(--go)] text-white text-center font-bold text-sm sm:text-base hover:opacity-90 transition-opacity"
          >
            💬 Message on WhatsApp
          </a>
          <button 
            onClick={handleCopyDetails}
            className="sm:w-auto py-3 px-6 border bg-white font-semibold text-sm hover:bg-gray-50 transition-colors"
            style={{ borderColor: "var(--rule)", color: "var(--ink)" }}
          >
            📋 Copy details
          </button>
        </div>
      </div>

    </>
  );
}
