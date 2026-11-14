export default function DashboardLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Top Header Card Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/90 px-6 py-5 sm:px-8 sm:py-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2.5">
          <div className="h-4 w-36 bg-slate-200 rounded-md" />
          <div className="h-7 w-64 bg-slate-200 rounded-lg" />
          <div className="h-3.5 w-48 bg-slate-100 rounded-md" />
        </div>
        <div className="h-10 w-48 bg-slate-200 rounded-xl" />
      </div>

      {/* Main Grid Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <div className="h-5 w-44 bg-slate-200 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 h-28 space-y-3">
                  <div className="h-4 w-28 bg-slate-200 rounded" />
                  <div className="h-6 w-16 bg-slate-200 rounded" />
                  <div className="h-2 w-full bg-slate-200 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-4">
            <div className="h-5 w-44 bg-slate-200 rounded-md" />
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 h-64 space-y-3">
              <div className="h-5 w-32 bg-slate-200 rounded" />
              <div className="space-y-2 pt-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-4 bg-slate-200 rounded-md w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
