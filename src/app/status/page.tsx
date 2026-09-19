"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function StatusForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const codeParam = searchParams.get("code");
    if (codeParam) {
      setCode(codeParam);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedCode = code.trim().toUpperCase();
    
    if (!formattedCode) {
      setError("Please enter a reference code.");
      return;
    }
    
    if (!formattedCode.startsWith("SRC-")) {
      setError("Reference code must start with 'SRC-'.");
      return;
    }

    router.push(`/status/${formattedCode}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <label htmlFor="code" className="block text-sm font-semibold text-[var(--ink)]">
          Reference Code
        </label>
        <input
          id="code"
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError("");
          }}
          placeholder="e.g. SRC-XXXX"
          className="w-full border p-3 text-lg font-mono tracking-widest focus:outline-none focus:ring-1 focus:ring-[var(--ink)] uppercase placeholder:text-gray-300"
          style={{ borderColor: "var(--rule)" }}
          maxLength={8}
        />
        {error && (
          <p className="text-red-500 text-xs font-semibold">{error}</p>
        )}
      </div>

      <button 
        type="submit"
        className="w-full py-3 bg-[var(--ink)] text-white text-sm font-semibold transition-opacity hover:opacity-90"
      >
        Check Status →
      </button>
    </form>
  );
}

export default function StatusIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center pt-32 px-6">
      <div className="max-w-md w-full bg-white border p-8 space-y-6" style={{ borderColor: "var(--rule)" }}>
        
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[var(--ink)]">Check Request Status</h1>
          <p className="text-sm text-[var(--mute)]">
            Enter your 8-character reference code to track the progress of your project request.
          </p>
        </div>

        <Suspense fallback={<div className="pt-4 text-center text-sm text-[var(--mute)]">Loading form...</div>}>
          <StatusForm />
        </Suspense>
        
      </div>
    </div>
  );
}
