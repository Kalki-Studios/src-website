"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="text-xs font-semibold px-3 py-1.5 border transition-colors"
      style={{ 
        borderColor: "var(--rule)", 
        background: copied ? "var(--ink)" : "white",
        color: copied ? "white" : "var(--ink)"
      }}
    >
      {copied ? "Copied" : "Copy code"}
    </button>
  );
}
