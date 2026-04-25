import { Siren, Map, ShieldAlert, Check, Radio } from 'lucide-react';

export default function PolicePanel() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Police Operations</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Traffic Clearance & Corridors</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              This panel enables traffic authorities to view incoming critical ambulances and preemptively clear routes or create green corridors to minimize response times.
            </p>
          </div>
          <ShieldAlert size={48} className="text-blue-600 opacity-20" />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Active Corridors Map */}
        <div className="flex min-h-[600px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Map size={18} />
              <h2 className="font-semibold text-slate-900">Live Traffic Control Map</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Live feed active</span>
            </div>
          </div>
          
          <div className="flex flex-1 items-center justify-center bg-slate-100/40 p-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Map size={32} />
              </div>
              <p className="mt-4 text-slate-500">
                Map interface loads here showing active ambulances and traffic density.
              </p>
            </div>
          </div>
        </div>

        {/* Incoming Critical Units */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Approaching Emergency Units</h3>
            <p className="text-sm text-slate-500">Units requiring priority clearance</p>
          </div>

          {/* Example Unit */}
          <article className="rounded-3xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Siren size={18} className="text-rose-600" />
                  <span className="font-bold text-slate-900">Unit Alpha-4</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">Route: Downtown Ave to City General</p>
              </div>
              <span className="rounded-full border border-rose-200 bg-white px-2 py-1 text-xs font-bold text-rose-600 shadow-sm">
                CRITICAL
              </span>
            </div>
            
            <div className="mt-4 rounded-2xl bg-white/60 p-3">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Radio size={16} className="text-blue-600" />
                <span>Requesting intersection override at 5th St.</span>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500">
                <Check size={16} />
                Clear Traffic Route
              </button>
            </div>
          </article>

          {/* Another Example Unit */}
          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Siren size={18} className="text-amber-500" />
                  <span className="font-bold text-slate-900">Unit Beta-2</span>
                </div>
                <p className="mt-1 text-sm text-slate-500">Route: West Side Hwy to Metro Health</p>
              </div>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-bold text-amber-700">
                HIGH
              </span>
            </div>
            
            <div className="mt-5 flex gap-3">
              <button className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
                <Check size={16} />
                Clear Traffic Route
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
