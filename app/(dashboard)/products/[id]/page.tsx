
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";

import { requireUser } from "@/lib/auth/require-user";
import { getProductById } from "@/lib/services/products";
import { PageHeader } from "@/components/layout/page-header";
import { ProductActions } from "@/components/products/product-actions";

interface ProductDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const userId = await requireUser();

  const { id } = await params;

  const product = await getProductById(userId, id);

  if (!product) {
    notFound();
  }

  const formatPrice = (value: string) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const lowStock = product.currentStock <= product.reorderLevel;

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Products
      </Link>

      <PageHeader
        title={product.name}
        description={`Product SKU: ${product.sku}`}
        actions={
          <>
            {product.isActive && (
              <Link
                href={`/products/${product.id}/edit`}
                className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                <Pencil size={16} />
                Edit Product
              </Link>
            )}

            <ProductActions
              productId={product.id}
              isActive={product.isActive}
            />
          </>
        }
      />

      {/* Stock Status */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            !product.isActive
              ? "bg-slate-100 text-slate-600"
              : lowStock
                ? "bg-amber-100 text-amber-700"
                : "bg-green-100 text-green-700"
          }`}
        >
          {!product.isActive
            ? "Inactive"
            : lowStock
              ? "Low Stock"
              : "In Stock"}
        </span>

        <span className="text-sm text-slate-500">
          Category: {product.category}
        </span>
      </div>

      {/* Product Information */}
      <div className="grid gap-5 md:grid-cols-2">

        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            Product Information
          </h2>

          <div className="mt-5 space-y-4">

            <DetailRow label="Product Name" value={product.name} />

            <DetailRow label="SKU" value={product.sku} />

            <DetailRow label="Category" value={product.category} />

            <DetailRow label="Unit" value={product.unit} />

            <DetailRow
              label="Created At"
              value={product.createdAt.toLocaleDateString("en-IN")}
            />

          </div>
        </section>

        <section className="rounded-xl border bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            Inventory Information
          </h2>

          <div className="mt-5 space-y-4">

            <DetailRow
              label="Current Stock"
              value={`${product.currentStock} ${product.unit}`}
            />

            <DetailRow
              label="Reorder Level"
              value={`${product.reorderLevel} ${product.unit}`}
            />

            <DetailRow
              label="Purchase Price"
              value={formatPrice(product.purchasePrice)}
            />

            <DetailRow
              label="Selling Price"
              value={formatPrice(product.sellingPrice)}
            />

            <DetailRow
              label="Last Updated"
              value={product.updatedAt.toLocaleDateString("en-IN")}
            />

          </div>
        </section>

      </div>

      {/* Inventory History Placeholder */}
      <section className="rounded-xl border bg-white p-6">
        <h2 className="font-semibold text-slate-900">
          Stock Movement History
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Product stock changes will appear here once inventory
          management is implemented in Step 9.
        </p>
      </section>

    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b pb-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}
