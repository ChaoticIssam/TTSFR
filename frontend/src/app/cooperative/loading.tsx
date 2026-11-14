export default function CooperativeGenericLoading() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="h-6 w-52 bg-slate-200 rounded-md" />
        <div className="h-4 w-80 bg-slate-100 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
          <div className="h-32 bg-slate-50 rounded-xl border border-slate-100" />
          <div className="h-32 bg-slate-50 rounded-xl border border-slate-100" />
        </div>
      </div>
    </div>
  );
}
