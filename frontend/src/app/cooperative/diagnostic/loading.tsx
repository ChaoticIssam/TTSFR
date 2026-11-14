export default function DiagnosticLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Stepper Skeleton */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-2">
          <div className="h-4 w-40 bg-slate-200 rounded" />
          <div className="h-7 w-72 bg-slate-200 rounded-lg" />
          <div className="h-3.5 w-96 bg-slate-100 rounded" />
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
              <div className="h-4 w-60 bg-slate-200 rounded" />
              <div className="h-3 w-80 bg-slate-100 rounded" />
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-12 bg-white rounded-xl border border-slate-200/80" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
