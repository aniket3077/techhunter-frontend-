import { BellRing, Database, ShieldPlus } from 'lucide-react';
import { API_BASE_URL, API_PROXY_PREFIX, DASHBOARD_SUMMARY_ENDPOINT, HEALTH_ENDPOINT } from '@/lib/api';

type DashboardSummary = {
  activeEmergencies: number;
  availableAmbulances: number;
};

type HealthData = {
  status: string;
  environment?: string;
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

export default async function SettingsPage() {
  const [health, summary] = await Promise.all([
    loadJson<HealthData>(HEALTH_ENDPOINT),
    loadJson<DashboardSummary>(DASHBOARD_SUMMARY_ENDPOINT),
  ]);

  const apiHealthy = health?.data?.status === 'ok';

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Platform Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Deployment and integration checklist</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This surface keeps the technical pieces of the PRD visible: cloud database connectivity,
          API synchronization, and operational alerting.
        </p>

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <span
            className={`rounded-full border px-4 py-2 font-medium ${
              apiHealthy
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            Backend health: {apiHealthy ? 'Connected' : 'Unavailable'}
          </span>
          <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 font-medium text-cyan-700">
            API base: {API_BASE_URL}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 font-medium text-slate-700">
            Proxy prefix: {API_PROXY_PREFIX}
          </span>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600">
            <Database size={18} />
            <p className="text-sm font-semibold text-slate-900">Database</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Prisma is already pointed at a PostgreSQL datasource, which keeps the project aligned with
            an AWS RDS PostgreSQL deployment path.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600">
            <BellRing size={18} />
            <p className="text-sm font-semibold text-slate-900">API wiring</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            The frontend uses a configurable backend rewrite so local development and cloud deployment
            can share request paths. Active emergencies: {summary?.data?.activeEmergencies ?? 0}, available
            ambulances: {summary?.data?.availableAmbulances ?? 0}.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600">
            <ShieldPlus size={18} />
            <p className="text-sm font-semibold text-slate-900">Operational guardrails</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Summary endpoints, case updates, and ambulance controls provide the core scaffolding needed
            for later authentication, audit logging, and real-time event streaming in {health?.data?.environment ?? 'unknown'} environment.
          </p>
        </article>
      </section>
    </div>
  );
}
