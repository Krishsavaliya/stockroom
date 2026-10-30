
import { requireUser } from "@/lib/auth/require-user";
import { PageHeader } from "@/components/layout/page-header";
import { ProductsClient } from "@/components/products/products-client";

export default async function ProductsPage() {
  await requireUser();

  return (
    <div className="space-y-6">

      <PageHeader
        title="Products"
        description="Manage your products, SKUs, categories and pricing."
      />

      <ProductsClient />

    </div>
  );
}
