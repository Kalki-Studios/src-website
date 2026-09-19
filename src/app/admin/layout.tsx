import { AdminLayoutClient } from "./AdminLayoutClient";

export const metadata = {
  title: "Admin Dashboard — SRC e-solutions",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
