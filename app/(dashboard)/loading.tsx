
export default function DashboardLoading() {
  return (
    <div
      className="flex min-h-72 items-center justify-center"
      role="status"
    >
      <div className="text-center">
        <div className="mx-auto size-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />

        <p className="mt-4 text-sm text-slate-500">
          Loading Stockroom...
        </p>
      </div>
    </div>
  );
}
