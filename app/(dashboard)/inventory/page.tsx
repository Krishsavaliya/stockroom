
import { requireUser } from "@/lib/auth/require-user";
import { PageHeader } from "@/components/layout/page-header";

export default async function InventoryPage() {
  await requireUser();

  return (
    <div className="space-y-8">

      <PageHeader
        title="Inventory"
        description="Track stock levels, adjustments and movement history."
      />

      <div className="flex min-h-72 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-8">

        <div className="max-w-sm text-center">
          <h2 className="font-semibold text-slate-900">
            Inventory management
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Stock adjustments and movement history will be implemented in Phase 9.
          </p>
        </div>

      </div>

    </div>
  );
}
