import { ArrowRight, BrainCircuit, MapPinned, Siren, TimerReset } from 'lucide-react';
import { DASHBOARD_SUMMARY_ENDPOINT, HEALTH_ENDPOINT } from '@/lib/api';

type DashboardSummary = {
  activeEmergencies: number;
  pendingDispatch: number;
  averageResolutionMinutes: number | null;
};

type HealthData = {
  status: string;
};

type ApiResponse<T> = {
  success: boolean;
  data?: T;
};

async function loadJson<T>(url: string) {
  try {
    const response = await fetch(url, {
      next: { revalidate: 15 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as ApiResponse<T>;
  } catch {
    return null;
  }
}

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

export default async function DispatchPage() {
  const [health, summary] = await Promise.all([
    loadJson<HealthData>(HEALTH_ENDPOINT),
    loadJson<DashboardSummary>(DASHBOARD_SUMMARY_ENDPOINT),
  ]);

  const apiHealthy = health?.data?.status === 'ok';

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Dispatch Workflow</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">How the response engine moves</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This view turns the PRD into an operational handoff model so dispatch teams can see where AI,
          ambulance selection, and route data fit into the response loop.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span
            className={`rounded-full border px-4 py-2 font-medium ${
              apiHealthy
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            Backend: {apiHealthy ? 'Connected' : 'Unavailable'}
          </span>
          <span className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 font-medium text-sky-700">
            Pending dispatch: {summary?.data?.pendingDispatch ?? 0}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 font-medium text-slate-700">
            Active emergencies: {summary?.data?.activeEmergencies ?? 0}
          </span>
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 font-medium text-cyan-700">
            Avg response: {summary?.data?.averageResolutionMinutes ?? 'Learning'} min
          </span>
        </div>
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
