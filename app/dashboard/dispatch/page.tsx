import { ArrowRight, BrainCircuit, MapPinned, Siren, TimerReset } from 'lucide-react';

const dispatchSteps = [
  {
    title: '1. Signal intake',
    description: 'SOS, voice trigger, or image-derived accident detection opens a new emergency record.',
    icon: Siren,
  },
  {
    title: '2. AI triage',
    description: 'Severity classification scores urgency so operators can prioritize high-risk cases first.',
    icon: BrainCircuit,
  },
  {
    title: '3. Smart allocation',
    description: 'The nearest available ambulance and hospital context guide dispatch recommendations.',
    icon: MapPinned,
  },
  {
    title: '4. Response tracking',
    description: 'Fleet status, route optimization, and outcome timing feed reliability reporting.',
    icon: TimerReset,
  },
] as const;

export default function DispatchPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Dispatch Workflow</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">How the response engine moves</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This view turns the PRD into an operational handoff model so dispatch teams can see where AI,
          ambulance selection, and route data fit into the response loop.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-4">
        {dispatchSteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === dispatchSteps.length - 1;

          return (
            <article key={step.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="inline-flex rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-cyan-700">
                  <Icon size={18} />
                </div>
                {!isLast ? <ArrowRight size={18} className="text-slate-400" /> : null}
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-900">{step.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
