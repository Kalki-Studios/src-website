import { getProducts, getCategories } from "./actions";
import { StoreAdminClient } from "./StoreAdminClient";

export const dynamic = "force-dynamic";

export default async function AdminStorePage() {
  const [allProducts, allCategories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return (
    <StoreAdminClient
      initialProducts={allProducts}
      initialCategories={allCategories}
    />
  );
}
