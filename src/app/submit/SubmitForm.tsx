"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { submitProjectRequest } from "../actions";
import { UploadDropzone } from "@/components/ui/uploadthing";

const CATEGORIES = [
  { id: "web", label: "Website / Web App", icon: "</>" },
  { id: "app", label: "Mobile App", icon: "📱" },
  { id: "ml", label: "ML / AI", icon: "🧠" },
  { id: "iot", label: "IoT / Hardware", icon: "🔌" },
  { id: "software", label: "Desktop Software", icon: "🖥️" },
  { id: "unsure", label: "Not Sure Yet", icon: "?" },
];

const BUDGET_BANDS = [
  { id: "under-1500", label: "Under ₹1,500" },
  { id: "1500-3000", label: "₹1,500 – ₹3,000" },
  { id: "3000-6000", label: "₹3,000 – ₹6,000" },
  { id: "6000-10000", label: "₹6,000 – ₹10,000" },
  { id: "10000-plus", label: "₹10,000+" },
  { id: "not-sure", label: "Not sure yet" },
];

const DELIVERABLES = [
  { id: "prototype", label: "Working prototype" },
  { id: "complete", label: "Complete project" },
  { id: "modify", label: "Fix / modify an existing project" },
  { id: "demo", label: "Only a demo for review/viva" },
  { id: "unsure", label: "Not sure" },
];

export function SubmitForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    category: "",
    title: "",
    description: "",
    deliverable: "",
    techNotes: "",
    deadline: "",
    budgetBand: "",
    files: [] as any[],
    studentName: "",
    college: "",
    phone: "",
    whatsapp: "",
    email: "",
    extraNotes: "",
    branchAnswers: {} as Record<string, string>,
  });

  const [usePhoneForWhatsApp, setUsePhoneForWhatsApp] = useState(true);

  // Initialize from URL params if present
  useEffect(() => {
    const queryCategory = searchParams?.get("category");
    const queryTitle = searchParams?.get("title");
    
    if (queryCategory) {
      setFormData(prev => ({ 
        ...prev, 
        category: queryCategory,
        ...(queryTitle && { title: queryTitle })
      }));
      setStep(2);
    }
  }, [searchParams]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("src_form_draft");
    if (saved) {
      try {
        setFormData(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {}
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("src_form_draft", JSON.stringify(formData));
  }, [formData]);

  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const updateBranch = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      branchAnswers: { ...prev.branchAnswers, [key]: value }
    }));
  };

  const handleCategorySelect = (id: string) => {
    updateForm("category", id);
    setStep(2);
  };

  const validateStep2 = () => formData.title && formData.description && formData.deliverable;
  const validateStep3 = () => formData.deadline && formData.budgetBand;
  const validateStep4 = () => formData.studentName && formData.college && formData.phone && formData.email;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    const result = await submitProjectRequest({
      ...formData,
      whatsapp: usePhoneForWhatsApp ? formData.phone : formData.whatsapp,
    });
    if (result.success) {
      localStorage.removeItem("src_form_draft");
      router.push(`/submitted?code=${result.refCode}`);
    } else {
      setError(result.error);
      setIsSubmitting(false);
    }
  };

  // Completeness Meter Logic
  const wordCount = formData.description.trim().split(/\s+/).filter(w => w.length > 0).length;
  const hasFile = formData.files.length > 0;
  const hasBranchAnswers = Object.keys(formData.branchAnswers).length > 0;
  
  let completenessMessage = "Add a few more lines so he can understand your idea";
  let completenessColor = "var(--flag)";
  if (wordCount >= 80 && hasFile && (hasBranchAnswers || formData.category === 'unsure')) {
    completenessMessage = "Very clear — he probably won't need to call you";
    completenessColor = "var(--go)";
  } else if (wordCount >= 30 || hasFile) {
    completenessMessage = "Good — this explains the basic idea";
    completenessColor = "var(--ink)";
  }

  return (
    <div className="w-full relative overflow-hidden pb-20">
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className="h-1 flex-1 transition-all duration-300"
            style={{ background: s <= step ? "var(--ink)" : "var(--rule)" }}
          />
        ))}
      </div>

      <div className="text-sm font-semibold mb-8 text-[var(--mute)]">Step {step} of 4</div>

      {error && (
        <div className="mb-6 p-4 rounded bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      {/* STEP 1: Category */}
      {step === 1 && (
        <div className="animate-in slide-in-from-right-4 fade-in duration-200">
          <h2 className="text-2xl font-bold mb-6 text-[var(--ink)]">What kind of project is this?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="flex items-center gap-4 p-6 text-left border hover:border-[var(--ink)] transition-colors duration-150 bg-white"
                style={{ borderColor: formData.category === cat.id ? "var(--ink)" : "var(--rule)" }}
              >
                <div className="text-2xl font-mono opacity-80">{cat.icon}</div>
                <div className="font-semibold text-[var(--ink)]">{cat.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Project Details */}
      {step === 2 && (
        <div className="animate-in slide-in-from-right-4 fade-in duration-200 space-y-8">
          <h2 className="text-2xl font-bold text-[var(--ink)]">About the Project</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--ink)]">Project Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => updateForm("title", e.target.value)}
              placeholder="e.g. Smart Attendance System"
              className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
              style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--ink)]">Describe your project *</label>
            <textarea
              value={formData.description}
              onChange={(e) => updateForm("description", e.target.value)}
              placeholder="e.g. A face recognition system for our college lab that automatically marks attendance when a student enters the room. The system should store records and let the HOD download reports."
              rows={5}
              className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
              style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
            />
            <div className="flex justify-between items-center text-xs mt-1">
              <span style={{ color: completenessColor }}>{completenessMessage}</span>
              <span className="text-[var(--mute)]">{wordCount} words</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--ink)]">What do you need from us? *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DELIVERABLES.map((del) => (
                <button
                  key={del.id}
                  onClick={() => updateForm("deliverable", del.id)}
                  className="p-3 text-left border text-sm transition-colors"
                  style={{
                    borderColor: formData.deliverable === del.id ? "var(--ink)" : "var(--rule)",
                    background: formData.deliverable === del.id ? "var(--ink)" : "var(--paper)",
                    color: formData.deliverable === del.id ? "white" : "var(--ink)",
                  }}
                >
                  {del.label}
                </button>
              ))}
            </div>
          </div>

          {/* Branch Questions */}
          {formData.category === "web" && (
            <div className="space-y-6 pt-4 border-t border-[var(--rule)]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">Do you have a reference website or design?</label>
                <div className="flex gap-3">
                  {["Yes", "No", "I'll share one"].map((opt) => (
                    <button key={opt} onClick={() => updateBranch("hasDesign", opt)} className={`px-4 py-2 border text-sm ${formData.branchAnswers["hasDesign"] === opt ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--rule)] bg-white text-[var(--ink)]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">Does it need a login system or admin panel?</label>
                <div className="flex gap-3">
                  {["Yes", "No", "Not sure"].map((opt) => (
                    <button key={opt} onClick={() => updateBranch("needsLogin", opt)} className={`px-4 py-2 border text-sm ${formData.branchAnswers["needsLogin"] === opt ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--rule)] bg-white text-[var(--ink)]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {formData.category === "app" && (
            <div className="space-y-6 pt-4 border-t border-[var(--rule)]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">Which platform?</label>
                <div className="flex gap-3">
                  {["Android", "iOS", "Both"].map((opt) => (
                    <button key={opt} onClick={() => updateBranch("platform", opt)} className={`px-4 py-2 border text-sm ${formData.branchAnswers["platform"] === opt ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--rule)] bg-white text-[var(--ink)]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">Does it need a backend or database?</label>
                <div className="flex gap-3">
                  {["Yes", "No", "Not sure"].map((opt) => (
                    <button key={opt} onClick={() => updateBranch("needsBackend", opt)} className={`px-4 py-2 border text-sm ${formData.branchAnswers["needsBackend"] === opt ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--rule)] bg-white text-[var(--ink)]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {formData.category === "ml" && (
            <div className="space-y-6 pt-4 border-t border-[var(--rule)]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">Do you already have a dataset?</label>
                <div className="flex gap-3">
                  {["Yes", "No", "Partially"].map((opt) => (
                    <button key={opt} onClick={() => updateBranch("hasDataset", opt)} className={`px-4 py-2 border text-sm ${formData.branchAnswers["hasDataset"] === opt ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--rule)] bg-white text-[var(--ink)]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">Does it need a UI?</label>
                <div className="flex flex-wrap gap-3">
                  {["Needs a UI", "Notebook/demo is fine", "Not sure"].map((opt) => (
                    <button key={opt} onClick={() => updateBranch("needsUi", opt)} className={`px-4 py-2 border text-sm ${formData.branchAnswers["needsUi"] === opt ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--rule)] bg-white text-[var(--ink)]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {formData.category === "iot" && (
            <div className="space-y-6 pt-4 border-t border-[var(--rule)]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">Who arranges the components — you or us?</label>
                <div className="flex flex-wrap gap-3">
                  {["I will arrange", "You arrange (add to cost)", "Not sure"].map((opt) => (
                    <button key={opt} onClick={() => updateBranch("hardwareSource", opt)} className={`px-4 py-2 border text-sm ${formData.branchAnswers["hardwareSource"] === opt ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--rule)] bg-white text-[var(--ink)]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">Which hardware do you already have? (optional)</label>
                <input
                  type="text"
                  value={formData.branchAnswers["existingHardware"] || ""}
                  onChange={(e) => updateBranch("existingHardware", e.target.value)}
                  placeholder="e.g. Arduino Uno, DHT11 sensor"
                  className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
                  style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
                />
              </div>
            </div>
          )}

          {formData.category === "software" && (
            <div className="space-y-6 pt-4 border-t border-[var(--rule)]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">What platform must it run on?</label>
                <div className="flex flex-wrap gap-3">
                  {["Windows", "Mac", "Linux", "Any"].map((opt) => (
                    <button key={opt} onClick={() => updateBranch("platform", opt)} className={`px-4 py-2 border text-sm ${formData.branchAnswers["platform"] === opt ? 'border-[var(--ink)] bg-[var(--ink)] text-white' : 'border-[var(--rule)] bg-white text-[var(--ink)]'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <button onClick={() => setStep(1)} className="px-6 py-3 border border-[var(--rule)] hover:bg-gray-50 text-[var(--ink)] font-semibold transition-colors">
              ← Back
            </button>
            <button 
              onClick={() => setStep(3)} 
              disabled={!validateStep2()}
              className="px-6 py-3 bg-[var(--ink)] text-white font-semibold disabled:opacity-50 transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Timeline, Budget, Files */}
      {step === 3 && (
        <div className="animate-in slide-in-from-right-4 fade-in duration-200 space-y-8">
          <h2 className="text-2xl font-bold text-[var(--ink)]">Logistics</h2>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--ink)]">Submission deadline *</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => updateForm("deadline", e.target.value)}
              className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
              style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--ink)]">Budget range *</label>
            <select
              value={formData.budgetBand}
              onChange={(e) => updateForm("budgetBand", e.target.value)}
              className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors appearance-none"
              style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
            >
              <option value="" disabled>Select a range</option>
              {BUDGET_BANDS.map(band => (
                <option key={band.id} value={band.id}>{band.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--ink)]">Attach files (optional)</label>
            <p className="text-sm text-[var(--mute)] mb-2">Most colleges give a project synopsis or problem statement — attach it here if you have one. (Max 3 files, 1MB each. PDF/DOC/PNG/JPG).</p>
            
            <div className="border border-dashed p-6 flex flex-col items-center justify-center bg-gray-50" style={{ borderColor: "var(--rule)" }}>
              <UploadDropzone
                endpoint="projectFiles"
                content={{
                  allowedContent: "PDF, DOC, Images (Max 1MB)",
                }}
                onClientUploadComplete={(res) => {
                  if (res) {
                    const uploadedFiles = res.map(f => ({ url: f.url, name: f.name, size: f.size }));
                    updateForm("files", [...formData.files, ...uploadedFiles]);
                  }
                }}
                onUploadError={(error: Error) => {
                  alert(`Upload error: ${error.message}`);
                }}
                className="w-full ut-label:text-[var(--ink)] ut-button:bg-[var(--ink)] ut-button:ut-readying:bg-[var(--ink)]/50"
              />
            </div>

            {formData.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.files.map((f, i) => (
                  <div key={i} className="flex justify-between items-center p-3 border bg-white text-sm" style={{ borderColor: "var(--rule)" }}>
                    <span className="truncate max-w-[80%] font-mono">{f.name}</span>
                    <button 
                      onClick={() => updateForm("files", formData.files.filter((_, idx) => idx !== i))}
                      className="text-red-500 font-bold px-2 hover:bg-red-50 rounded"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-6">
            <button onClick={() => setStep(2)} className="px-6 py-3 border border-[var(--rule)] hover:bg-gray-50 text-[var(--ink)] font-semibold transition-colors">
              ← Back
            </button>
            <button 
              onClick={() => setStep(4)} 
              disabled={!validateStep3()}
              className="px-6 py-3 bg-[var(--ink)] text-white font-semibold disabled:opacity-50 transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Contact */}
      {step === 4 && (
        <div className="animate-in slide-in-from-right-4 fade-in duration-200 space-y-8">
          <h2 className="text-2xl font-bold text-[var(--ink)]">How to reach you</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--ink)]">Your name *</label>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => updateForm("studentName", e.target.value)}
                className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
                style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--ink)]">College / University *</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => updateForm("college", e.target.value)}
                className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
                style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[var(--ink)]">Phone number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => updateForm("phone", e.target.value)}
                className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
                style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
              />
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="wa-check"
                  checked={usePhoneForWhatsApp}
                  onChange={(e) => setUsePhoneForWhatsApp(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="wa-check" className="text-sm text-[var(--ink)] cursor-pointer">Same as phone number for WhatsApp</label>
              </div>
            </div>

            {!usePhoneForWhatsApp && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--ink)]">WhatsApp number *</label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => updateForm("whatsapp", e.target.value)}
                  className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
                  style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-[var(--ink)]">Email address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateForm("email", e.target.value)}
              className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
              style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
            />
          </div>

          <div className="space-y-2 pt-4">
            <label className="text-sm font-semibold text-[var(--ink)]">Anything else you want to add (optional)</label>
            <textarea
              value={formData.extraNotes}
              onChange={(e) => updateForm("extraNotes", e.target.value)}
              rows={3}
              className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
              style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
            />
          </div>

          <div className="flex justify-between pt-6 border-t border-[var(--rule)]">
            <button onClick={() => setStep(3)} className="px-6 py-3 border border-[var(--rule)] hover:bg-gray-50 text-[var(--ink)] font-semibold transition-colors">
              ← Back
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={!validateStep4() || isSubmitting}
              className="px-8 py-3 bg-[var(--ink)] text-white font-bold disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Sending..." : "Send project request"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
