import { db } from "@/lib/db";
import { requests } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { RequestListClient } from "./RequestListClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const allRequests = await db.select().from(requests).orderBy(desc(requests.createdAt));

  return <RequestListClient initialRequests={allRequests} />;
}
