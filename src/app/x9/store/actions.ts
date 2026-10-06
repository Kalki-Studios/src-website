"use server";

import { db, withRetry } from "@/lib/db";
import { products, productCategories } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ─── Category Actions ─────────────────────────────────────────────

export async function getCategories() {
  return withRetry(() => db.select().from(productCategories).orderBy(asc(productCategories.name)));
}

export async function addCategory(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return { error: "Category name is required" };
  try {
    await withRetry(() => db.insert(productCategories).values({ name: trimmed }));
    revalidatePath("/x9/store");
    revalidatePath("/store");
    return { success: true };
  } catch {
    return { error: "Category already exists" };
  }
}

export async function deleteCategory(id: string) {
  await withRetry(() => db.delete(productCategories).where(eq(productCategories.id, id)));
  revalidatePath("/x9/store");
  revalidatePath("/store");
}

// ─── Product Actions ──────────────────────────────────────────────

export async function getProducts() {
  return withRetry(() => db.select().from(products).orderBy(asc(products.name)));
}

export async function addProduct(data: {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
}) {
  if (data.category) {
    try {
      // Quietly try to insert the category so it appears in the categories tab
      await withRetry(() => db.insert(productCategories).values({ name: data.category.trim() }));
    } catch {
      // Ignore if it already exists (unique constraint violation)
    }
  }

  await withRetry(() => db.insert(products).values({
    name: data.name,
    description: data.description || null,
    price: Math.round(data.price * 100), // store in paise
    category: data.category || null,
    images: JSON.stringify(data.images) as any,
    inStock: data.inStock,
    featured: data.featured,
  }));
  revalidatePath("/x9/store");
  revalidatePath("/store");
}

export async function updateProduct(id: string, data: {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured: boolean;
}) {
  if (data.category) {
    try {
      await withRetry(() => db.insert(productCategories).values({ name: data.category.trim() }));
    } catch {
      // Ignore if it already exists
    }
  }

  await withRetry(() => db.update(products).set({
    name: data.name,
    description: data.description || null,
    price: Math.round(data.price * 100),
    category: data.category || null,
    images: JSON.stringify(data.images) as any,
    inStock: data.inStock,
    featured: data.featured,
    updatedAt: new Date(),
  }).where(eq(products.id, id)));
  revalidatePath("/x9/store");
  revalidatePath("/store");
}

export async function toggleProductStock(id: string, inStock: boolean) {
  await withRetry(() => db.update(products).set({ inStock, updatedAt: new Date() }).where(eq(products.id, id)));
  revalidatePath("/x9/store");
  revalidatePath("/store");
}

export async function deleteProduct(id: string) {
  try {
    await withRetry(() => db.delete(products).where(eq(products.id, id)));
  } catch (error: any) {
    // Re-throw with the actual underlying error message so it shows up on the screen
    throw new Error(`Delete failed: ${error.message || error.toString()}`);
  }
  revalidatePath("/x9/store");
  revalidatePath("/store");
}
