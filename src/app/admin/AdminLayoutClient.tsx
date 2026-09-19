"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "./login/actions";

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await adminLogout();
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b sticky top-0 z-10" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-bold text-[var(--ink)] tracking-tight text-lg">
            SRC <span className="font-normal">Dashboard</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="text-sm font-semibold text-[var(--mute)] hover:text-[var(--ink)] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
