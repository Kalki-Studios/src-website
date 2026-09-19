"use client";

import { useState } from "react";
import { adminLogin } from "./actions";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await adminLogin(formData);

    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 text-sm">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--ink)]">Admin Email</label>
        <input 
          type="email" 
          name="email" 
          required 
          className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
          style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-[var(--ink)]">Password</label>
        <input 
          type="password" 
          name="password" 
          required 
          className="w-full p-3 border outline-none focus:border-[var(--ink)] transition-colors"
          style={{ borderColor: "var(--rule)", background: "var(--paper)" }}
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 bg-[var(--ink)] text-white font-bold transition-opacity hover:opacity-90 disabled:opacity-50 mt-4"
      >
        {loading ? "Authenticating..." : "Login to Dashboard"}
      </button>
    </form>
  );
}
