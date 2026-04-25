import { ArrowRight, CheckCircle2, MapPinned, Navigation, Phone } from 'lucide-react';

export default function DriverPanel() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Driver Operations</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Active Navigation & Mission</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This panel allows ambulance drivers to view their current mission, communicate with the hospital, and navigate to the incident location.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Map / Route Area */}
        <div className="flex min-h-[500px] flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="flex items-center gap-2 text-cyan-700">
              <Navigation size={18} />
              <h2 className="font-semibold text-slate-900">Live Route Guidance</h2>
            </div>
          </div>
          
          <div className="flex flex-1 items-center justify-center bg-slate-100/50 p-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                <MapPinned size={32} />
              </div>
              <p className="mt-4 text-slate-500">
                Map interface loads here when dispatch assigns a case.
                <br />
                (Waiting for active emergency coordinates)
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar / Actions */}
        <div className="space-y-4">
          <article className="rounded-3xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
                CRITICAL
              </span>
              <span className="text-sm font-medium text-rose-600">3 mins away</span>
            </div>
            
            <h3 className="mt-4 text-xl font-semibold text-slate-900">Cardiac Arrest</h3>
            <p className="mt-1 text-sm text-slate-600">Location: 452 Downtown Ave.</p>
            
            <div className="mt-6 flex flex-col gap-3">
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-rose-500">
                <CheckCircle2 size={18} />
                Confirm Arrival
              </button>
              <button className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50">
                <Phone size={18} />
                Call Patient
              </button>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Hospital Connection</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              City General Hospital is preparing ER Bay 3. Patient data is syncing.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
