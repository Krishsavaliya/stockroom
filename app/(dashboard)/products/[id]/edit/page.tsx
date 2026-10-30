
import Link from "next/link";
import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import { getProductById } from "@/lib/services/products";

import { PageHeader } from "@/components/layout/page-header";
import { ProductEditForm } from "@/components/products/product-edit-form";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const userId = await requireUser();

  const { id } = await params;

  const product = await getProductById(userId, id);

  if (!product || !product.isActive) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <PageHeader
        title="Edit Product"
        description={`Update ${product.name} and its product information.`}
      />

      <div className="rounded-xl border bg-white p-5 shadow-sm sm:p-8">
        <ProductEditForm product={product} />
      </div>

      <Link
        href={`/products/${product.id}`}
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← Back to Product Details
      </Link>

    </div>
  );
}
