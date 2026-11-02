import MarathonMap from "../../../components/MarathonMap";


export default function MarathonPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900">
          Chennai 10K Marathon
        </h1>

        <p className="mt-2 text-slate-600">
          Follow the route and find hydration stations.
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border bg-[var(--color-surface)]">
          <MarathonMap />
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <span>🟢 Start</span>
          <span>🔵 Hydration station</span>
          <span>🟠 Route</span>
          <span>🔴 Finish</span>
        </div>
      </div>
    </main>
  );
}
