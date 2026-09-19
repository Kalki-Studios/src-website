import { Suspense } from "react";
import { SubmitForm } from "./SubmitForm";

export const metadata = {
  title: "Submit a Project Request — SRC e-solutions",
};

export default function SubmitPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <Suspense fallback={<div className="p-8 text-center text-sm">Loading form...</div>}>
          <SubmitForm />
        </Suspense>
      </div>
    </div>
  );
}
