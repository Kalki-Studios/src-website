"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";

export function MobileStoreButton() {
  const [showNote, setShowNote] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show the note shortly after page load
    const showTimer = setTimeout(() => {
      setShowNote(true);
    }, 500);

    // Hide the note after 3 seconds of being visible
    const hideTimer = setTimeout(() => {
      setShowNote(false);
    }, 3500); // 500ms + 3000ms

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (pathname?.startsWith("/store") || pathname?.startsWith("/x9")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col items-end gap-3 pointer-events-none">
      
      {/* Tooltip Note */}
      <div 
        className={`relative bg-white text-[var(--ink)] p-3 rounded-lg shadow-xl border border-gray-100 max-w-[250px] text-right transition-all duration-1000 ease-out origin-bottom-right pointer-events-auto
          ${showNote ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'}`}
      >
        <p className="text-xs font-bold leading-tight">
          DIY store of Src e-Solutions, Order to build it!
        </p>
      </div>

      {/* Floating Button */}
      <Link 
        href="/store"
        className="w-14 h-14 bg-[var(--ink)] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-transform pointer-events-auto relative"
      >
        {/* Pulsing ring effect */}
        <div className="absolute inset-0 bg-[var(--ink)] rounded-full animate-ping opacity-30"></div>
        <ShoppingCart size={24} className="relative z-10" />
      </Link>
    </div>
  );
}
