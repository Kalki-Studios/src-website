"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "./login/actions";
import { SettingsModal } from "@/components/SettingsModal";

export function AdminLayoutClient({ children, storageWidget }: { children: React.ReactNode, storageWidget?: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/x9/login") {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await adminLogout();
    router.push("/x9/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white border-b sticky top-0 z-10" style={{ borderColor: "var(--rule)" }}>
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/x9" className="font-bold text-[var(--ink)] tracking-tight text-lg">
            SRC <span className="font-normal">Dashboard</span>
          </Link>
          <div className="flex items-center">
            <SettingsModal />
            {storageWidget}
            <button 
              onClick={handleLogout}
              className="text-sm font-semibold text-[var(--mute)] hover:text-[var(--ink)] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
