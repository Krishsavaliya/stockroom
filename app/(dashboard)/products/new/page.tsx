
import Link from "next/link";

import { requireUser } from "@/lib/auth/require-user";
import { PageHeader } from "@/components/layout/page-header";
import { ProductForm } from "@/components/products/product-form";

export default async function NewProductPage() {
  await requireUser();

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <PageHeader
        title="Add Product"
        description="Add a new product to your inventory."
      />

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <ProductForm />
      </div>

      <Link
        href="/products"
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← Back to Products
      </Link>

    </div>
  );
}
