import { AdminLayoutClient } from "./AdminLayoutClient";
import { UTApi } from "uploadthing/server";
import { Suspense } from "react";

export const metadata = {
  title: "Admin Dashboard — SRC e-solutions",
};

async function StorageWidget() {
  const utapi = new UTApi();
  let percent = 0;
  
  try {
    const usage = await utapi.getUsageInfo();
    const LIMIT_1_8_GB = 1.8 * 1024 * 1024 * 1024;
    percent = Math.min(100, Math.round((usage.totalBytes / LIMIT_1_8_GB) * 100));
  } catch (e) {
    console.error("Failed to fetch uploadthing usage:", e);
  }

  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;
  const color = percent > 90 ? "#ef4444" : percent > 75 ? "#f59e0b" : "#22c55e";

  return (
    <div className="flex items-center gap-1.5 mr-6 bg-gray-50 px-2 py-1 rounded-full border border-gray-100 shadow-sm" title={`UploadThing Storage: ${percent}% of 1.8GB safe limit used`}>
      <svg width="20" height="20" viewBox="0 0 20 20" className="transform -rotate-90">
        <circle
          cx="10"
          cy="10"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="2.5"
          fill="none"
        />
        <circle
          cx="10"
          cy="10"
          r={radius}
          stroke={color}
          strokeWidth="2.5"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <span className="text-[10px] font-bold text-gray-500 tracking-wider">
        {percent}%
      </span>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutClient 
      storageWidget={
        <Suspense fallback={<div className="w-5 h-5 rounded-full bg-gray-200 animate-pulse mr-6"></div>}>
          <StorageWidget />
        </Suspense>
      }
    >
      {children}
    </AdminLayoutClient>
  );
}
