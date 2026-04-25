import Link from 'next/link';
import {
  Ambulance,
  ArrowRight,
  BellRing,
  BrainCircuit,
  Building2,
  Database,
  HeartPulse,
  MapPinned,
  Mic,
  Navigation,
  PhoneCall,
  Siren,
  Sparkles,
  Stethoscope,
  TimerReset,
} from 'lucide-react';
import { DASHBOARD_SUMMARY_ENDPOINT, HEALTH_ENDPOINT } from '@/lib/api';

type HealthData = {
  status: string;
  service: string;
  environment: string;
  timestamp: string;
  uptimeSeconds: number;
};

type DashboardSummary = {
  activeEmergencies: number;
  pendingDispatch: number;
  criticalAlerts: number;
  resolvedToday: number;
  availableAmbulances: number;
  totalAmbulances: number;
  connectedHospitals: number;
  averageResolutionMinutes: number | null;
  fleetReadiness: number | null;
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

function formatMinutes(minutes: number | null | undefined) {
  return typeof minutes === 'number' ? `${minutes} min` : 'Learning';
}

const productLanes = [
  {
    title: 'User App',
    icon: PhoneCall,
    accent: 'border-rose-200 bg-rose-50 text-rose-600',
    items: ['SOS button', 'Voice command trigger', 'Live tracking', 'Emergency history'],
  },
  {
    title: 'Web Dashboard',
    icon: Building2,
    accent: 'border-cyan-200 bg-cyan-50 text-cyan-700',
    items: ['Hospital login', 'Case monitoring', 'AI severity display', 'Resource allocation'],
  },
  {
    title: 'Ambulance Interface',
    icon: Ambulance,
    accent: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    items: ['Request notification', 'Accept or reject workflow', 'Navigation cues', 'Unit status updates'],
  },
] as const;

const aiModules = [
  {
    title: 'Accident detection',
    description: 'Use image input to flag crash scenes and feed triage signals into the dispatch loop.',
    icon: Sparkles,
  },
  {
    title: 'Severity classification',
    description: 'Rank incidents by urgency so hospitals and ambulance crews see the riskiest cases first.',
    icon: BrainCircuit,
  },
  {
    title: 'Smart ambulance selection',
    description: 'Recommend the best available unit using live status, assignment load, and hospital alignment.',
    icon: Siren,
  },
  {
    title: 'Route optimization',
    description: 'Use live coordinates to keep responders moving on the fastest path to patient pickup.',
    icon: Navigation,
  },
] as const;

const stackItems = [
  {
    title: 'React-driven interfaces',
    description: 'Citizen app, hospital dashboard, and fleet console built in a shared React-based frontend.',
    icon: HeartPulse,
  },
  {
    title: 'Next.js APIs',
    description: 'Route handlers manage SOS intake, live case monitoring, ambulance status, and dashboard summaries.',
    icon: BellRing,
  },
  {
    title: 'AWS RDS-ready PostgreSQL layer',
    description: 'Operational data is structured for PostgreSQL so the deployment path fits AWS RDS cleanly.',
    icon: Database,
  },
] as const;

export default async function Home() {
  const [health, summary] = await Promise.all([
    loadJson<HealthData>(HEALTH_ENDPOINT),
    loadJson<DashboardSummary>(DASHBOARD_SUMMARY_ENDPOINT),
  ]);

  const overview = summary?.data;
  const apiHealthy = health?.data?.status === 'ok';

  return (
    <div className="px-4 py-4 sm:px-6 lg:px-8">
      <main className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-[radial-gradient(circle_at_top_left,_rgba(244,63,94,0.08),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.06),_transparent_24%),linear-gradient(135deg,#ffffff_0%,#f1f5f9_45%,#e2e8f0_100%)] px-6 py-10 shadow-xl shadow-slate-200/50 sm:px-10 lg:px-12 lg:py-14">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle,_rgba(14,165,233,0.08),_transparent_58%)] lg:block" />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_360px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
                <Stethoscope size={16} />
                AI emergency response platform
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Faster emergency decisions with real-time triage, dispatch, and cloud-backed coordination.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                PulseRescue AI brings together citizens, hospitals, and ambulance fleets so SOS intake,
                severity classification, live tracking, and ambulance selection happen in one operating system.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  Open command center
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/dashboard/units"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  View ambulance fleet
                  <Ambulance size={16} />
                </Link>
              </div>
            </div>

            <div className="relative rounded-[1.75rem] border border-slate-200/60 bg-white/70 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-600">System Pulse</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-900">Live platform state</h2>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                  {apiHealthy ? 'Connected' : 'Waiting'}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Active emergencies</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{overview?.activeEmergencies ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Available ambulances</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">{overview?.availableAmbulances ?? 0}</p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Average response loop</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">
                    {formatMinutes(overview?.averageResolutionMinutes)}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Fleet readiness</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-900">
                    {overview?.fleetReadiness ?? 0}%
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-slate-600">
                Backend status: {apiHealthy ? 'healthy' : 'not reachable'}.
                {' '}
                {health?.data
                  ? `${health.data.service} in ${health.data.environment}, uptime ${health.data.uptimeSeconds}s.`
                  : 'Start the backend service to unlock live summaries and case feeds.'}
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {productLanes.map((lane) => {
            const Icon = lane.icon;

            return (
              <article
                key={lane.title}
                className="rounded-[1.75rem] border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur"
              >
                <div className={`inline-flex rounded-2xl border p-3 ${lane.accent}`}>
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-2xl font-semibold text-slate-900">{lane.title}</h3>
                <div className="mt-5 grid gap-2 text-sm text-slate-600">
                  {lane.items.map((item) => (
                    <p key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      {item}
                    </p>
                  ))}
                </div>
              </article>
            );
          })}
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,1fr)]">
          <div className="rounded-[2rem] border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex items-center gap-3 text-cyan-600">
              <BrainCircuit size={20} />
              <p className="text-sm font-medium uppercase tracking-[0.3em]">AI Capabilities</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {aiModules.map((module) => {
                const Icon = module.icon;

                return (
                  <article
                    key={module.title}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="inline-flex rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-cyan-700">
                      <Icon size={18} />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{module.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{module.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur sm:p-8">
            <div className="flex items-center gap-3 text-cyan-600">
              <TimerReset size={20} />
              <p className="text-sm font-medium uppercase tracking-[0.3em]">Success Metrics</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Response time reduction</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {formatMinutes(overview?.averageResolutionMinutes)}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">System reliability</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {apiHealthy ? 'Operational' : 'Needs backend'}
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">AI accuracy focus</p>
                <p className="mt-3 text-2xl font-semibold text-slate-900">
                  {overview?.criticalAlerts ?? 0} high-priority cases under watch
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {stackItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur"
              >
                <div className="inline-flex rounded-2xl border border-cyan-200 bg-cyan-50 p-3 text-cyan-700">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </article>
            );
          })}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[1.75rem] border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 text-cyan-600">
              <Mic size={18} />
              <p className="text-sm font-semibold text-slate-900">Voice-trigger ready</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The citizen workflow is structured for a voice activation layer, so hands-free SOS can feed
              the same backend pipeline as a manual emergency alert.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 text-cyan-600">
              <MapPinned size={18} />
              <p className="text-sm font-semibold text-slate-900">Real-time tracking</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Every emergency case stores live coordinates, making it easy to stream tracking updates and
              route ambulance crews without redesigning the data model.
            </p>
          </article>

          <article className="rounded-[1.75rem] border border-slate-200/60 bg-white/60 p-6 shadow-sm backdrop-blur">
            <div className="flex items-center gap-3 text-cyan-600">
              <Database size={18} />
              <p className="text-sm font-semibold text-slate-900">Centralized cloud data</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Emergency records, dispatch summaries, and fleet state live in one operational database so
              hospital teams and ambulance crews stay aligned.
            </p>
          </article>
        </section>
      </main>
    </div>
  );
}
