import { db, withRetry } from "@/lib/db";
import { products, productCategories } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import { StoreClient } from "./StoreClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Store — SRC e-solutions",
  description: "Buy electronic components, microcontrollers, sensors, modules and more from SRC e-solutions.",
};

export default async function StorePage() {
  const [allProducts, allCategories] = await Promise.all([
    withRetry(() => db.select().from(products).orderBy(asc(products.name))),
    withRetry(() => db.select().from(productCategories).orderBy(asc(productCategories.name))),
  ]);

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <Navbar />
      <StoreClient products={allProducts} categories={allCategories} />
      <Footer />
    </div>
  );
}

