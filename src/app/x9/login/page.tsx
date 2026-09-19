import { LoginForm } from "./LoginForm";

export const metadata = {
  title: "Admin Login — SRC e-solutions",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[var(--ink)] tracking-tight">SRC <span className="font-normal">e-solutions</span></h1>
          <p className="text-sm text-[var(--mute)] mt-1">Admin Dashboard</p>
        </div>
        
        <div className="bg-white border p-8 shadow-sm" style={{ borderColor: "var(--rule)" }}>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
