'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Ambulance,
  MapPinned,
  Settings,
  ShieldPlus,
  Siren,
} from 'lucide-react';

const navigationItems = [
  { href: '/dashboard', label: 'Emergencies', icon: Siren },
  { href: '/dashboard/dispatch', label: 'Dispatch Flow', icon: MapPinned },
  { href: '/dashboard/units', label: 'Ambulance Fleet', icon: Ambulance },
  { href: '/dashboard/driver', label: 'Driver Panel', icon: Activity },
  { href: '/dashboard/police', label: 'Police Panel', icon: ShieldPlus },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
] as const;

function isActive(pathname: string, href: string) {
  if (href === '/dashboard') {
    return pathname === href;
  }

  return pathname.startsWith(href);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-slate-200/60 bg-white/80 px-5 py-6 backdrop-blur lg:border-b-0 lg:border-r">
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-rose-100 p-3 text-rose-600">
              <Activity size={26} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-slate-900">PulseRescue AI</h1>
              <p className="text-sm text-slate-500">Hospital command center</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm font-medium text-emerald-600">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
            Operational
          </div>
        </div>

        <nav className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  active
                    ? 'border-rose-200 bg-rose-50 text-rose-700 shadow-md shadow-rose-100'
                    : 'border-slate-200/50 bg-white/40 text-slate-600 hover:border-cyan-200 hover:bg-white/80 hover:text-cyan-700'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-700">
            <ShieldPlus size={18} />
            <p className="text-sm font-semibold">Prepared for surge mode</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-cyan-800/80">
            AI triage, fleet status, and live dispatch tools stay grouped here so
            operators can move from alert intake to assignment in one flow.
          </p>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="mb-6 rounded-3xl border border-slate-200/60 bg-white/60 px-5 py-5 backdrop-blur shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-cyan-600">Live Operations</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Emergency command center
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 text-sm font-medium">
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-emerald-700">
                AI severity monitoring
              </span>
              <span className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sky-700">
                Real-time fleet updates
              </span>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
