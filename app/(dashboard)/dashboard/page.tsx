
import { requireUser } from "@/lib/auth/require-user";
import { PageHeader } from "@/components/layout/page-header";

const summaryCards = [
  {
    title: "Total Products",
    value: "—",
    description: "Products in your inventory",
  },
  {
    title: "Low Stock",
    value: "—",
    description: "Products needing attention",
  },
  {
    title: "Inventory Value",
    value: "—",
    description: "Current purchase value",
  },
  {
    title: "Stock Movements",
    value: "—",
    description: "Recorded inventory changes",
  },
];

export default async function DashboardPage() {
  await requireUser();

  return (
    <div className="space-y-8">

      <PageHeader
        title="Dashboard"
        description="Overview of your inventory and business activity."
      />

      {/* Summary Cards */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-500">
              {card.title}
            </p>

            <p className="mt-3 text-3xl font-bold text-slate-900">
              {card.value}
            </p>

            <p className="mt-2 text-xs text-slate-400">
              {card.description}
            </p>
          </div>
        ))}
      </section>

      {/* Dashboard Content */}
      <section className="grid gap-4 xl:grid-cols-2">

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            Low Stock Products
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Products requiring restocking will appear here.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Your latest stock movements will appear here.
          </p>
        </div>

      </section>

    </div>
  );
}
