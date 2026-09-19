"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
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

const CATEGORIES = [
  { id: "web", label: "Website / Web app", examples: ["E-commerce store with admin panel", "College event management portal", "Portfolio website"] },
  { id: "app", label: "Mobile app", examples: ["Attendance tracker using Flutter", "Food delivery app with maps", "Expense tracker app"] },
  { id: "ml", label: "ML / AI", examples: ["Fake news detection model", "Stock price prediction using LSTM", "Facial recognition system"] },
  { id: "iot", label: "IoT / Hardware", examples: ["Water level monitoring using ultrasonic sensor", "Smart helmet with accident detection", "Soil moisture based irrigation system"] },
  { id: "software", label: "Desktop or other software", examples: ["Library management system in Java", "Billing software for retail", "Data visualization dashboard"] },
  { id: "unsure", label: "Not sure yet", examples: ["I have a general idea but need technical help", "Need to discuss feasibility first", "A unique idea spanning multiple fields"] },
];

export default function HeroStepOne() {
  const router = useRouter();
  const prefersReduced = usePrefersReducedMotion();
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedCategoryData = CATEGORIES.find(c => c.id === selectedCat);

  // Rotate placeholders
  useEffect(() => {
    if (!selectedCategoryData || isFocused) return;
    
    const interval = setInterval(() => {
      setExampleIndex(prev => (prev + 1) % selectedCategoryData.examples.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [selectedCategoryData, isFocused]);

  // Focus input automatically after animation
  useEffect(() => {
    if (selectedCat && !prefersReduced) {
      setTimeout(() => inputRef.current?.focus(), 600);
    } else if (selectedCat && prefersReduced) {
      inputRef.current?.focus();
    }
  }, [selectedCat, prefersReduced]);

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCat) return;
    
    const params = new URLSearchParams();
    params.set("category", selectedCat);
    if (title.trim()) params.set("title", title.trim());
    
    router.push(`/submit?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-12">
      {/* Grid texture background */}
      <div className="absolute inset-0 grid-texture-faint pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-6 w-full mt-12 mb-16">
        
        {/* Headlines */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--ink)] tracking-tight mb-4 max-w-2xl leading-[1.1]">
            Tell us your project idea.<br />Get a working project built.
          </h1>
          <p className="text-lg text-[var(--mute)] max-w-xl leading-relaxed">
            Fill one form with your idea, deadline and budget. We read every request and reply to the ones we can take.
          </p>
        </div>

        {/* The Interactive Form */}
        <div className="bg-white border p-6 sm:p-8 shadow-sm" style={{ borderColor: "var(--rule)" }}>
          <h2 className="text-xl font-bold text-[var(--ink)] mb-6">
            What kind of project do you need?
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence initial={false}>
              {CATEGORIES.map(cat => {
                const isSelected = selectedCat === cat.id;
                const isHidden = selectedCat !== null && !isSelected;

                if (isHidden) return null;

                return (
                  <motion.button
                    key={cat.id}
                    layout={!prefersReduced}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: prefersReduced ? 0 : 0.2 }}
                    onClick={() => setSelectedCat(isSelected ? null : cat.id)}
                    className={`text-left p-4 border transition-colors ${
                      isSelected 
                        ? "bg-[var(--ink)] text-white" 
                        : "bg-white text-[var(--ink)] hover:bg-gray-50"
                    }`}
                    style={{ borderColor: isSelected ? "var(--ink)" : "var(--rule)" }}
                  >
                    <span className="font-semibold text-sm block">
                      {cat.label}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {selectedCat && (
              <motion.div
                initial={{ opacity: 0, y: 15, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 15, height: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.3, delay: prefersReduced ? 0 : 0.2 }}
                className="overflow-hidden mt-6"
              >
                <form onSubmit={handleContinue} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[var(--ink)] block">
                      In one line, what is it?
                    </label>
                    <input
                      ref={inputRef}
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder={selectedCategoryData?.examples[exampleIndex] || ""}
                      className="w-full p-4 border outline-none focus:border-[var(--ink)] transition-colors text-sm sm:text-base bg-gray-50"
                      style={{ borderColor: "var(--rule)" }}
                      required
                    />
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <button 
                      type="submit"
                      className="px-8 py-3 bg-[var(--go)] text-white font-bold text-sm sm:text-base transition-opacity hover:opacity-90 w-full sm:w-auto"
                    >
                      Continue →
                    </button>
                    <span className="text-xs font-semibold text-[var(--mute)] uppercase tracking-wider text-center sm:text-left">
                      4 short steps. About 3 minutes.
                    </span>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
