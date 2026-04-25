import { BellRing, Database, ShieldPlus } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Platform Settings</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Deployment and integration checklist</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This surface keeps the technical pieces of the PRD visible: cloud database connectivity,
          API synchronization, and operational alerting.
        </p>
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
            The frontend now supports a configurable backend rewrite so local development and cloud deployment
            can use the same request paths.
          </p>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600">
            <ShieldPlus size={18} />
            <p className="text-sm font-semibold text-slate-900">Operational guardrails</p>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Summary endpoints, case updates, and ambulance controls provide the core scaffolding needed
            for later authentication, audit logging, and real-time event streaming.
          </p>
        </article>
      </section>
    </div>
  );
}
