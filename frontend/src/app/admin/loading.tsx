export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sm:px-8 shadow-sm">
        <div className="h-7 w-48 bg-slate-200 rounded animate-pulse" />
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8 animate-pulse">
        {/* KPI Summary Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm h-28 space-y-3">
              <div className="h-4 w-28 bg-slate-200 rounded" />
              <div className="h-7 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="h-10 w-full bg-slate-100 rounded-xl" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-slate-50 rounded-xl border border-slate-100 w-full" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
