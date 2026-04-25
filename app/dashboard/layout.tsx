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
      <aside className="border-b border-white/10 bg-slate-950/80 px-5 py-6 backdrop-blur lg:border-b-0 lg:border-r">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-rose-500/20 p-3 text-rose-300">
              <Activity size={26} />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">PulseRescue AI</h1>
              <p className="text-sm text-slate-400">Hospital command center</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 text-sm text-emerald-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(74,222,128,0.75)]" />
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
                    ? 'border-rose-400/40 bg-rose-500/20 text-white shadow-lg shadow-rose-950/30'
                    : 'border-white/8 bg-white/5 text-slate-300 hover:border-cyan-400/25 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-5">
          <div className="flex items-center gap-2 text-cyan-200">
            <ShieldPlus size={18} />
            <p className="text-sm font-semibold">Prepared for surge mode</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            AI triage, fleet status, and live dispatch tools stay grouped here so
            operators can move from alert intake to assignment in one flow.
          </p>
        </div>
      </aside>

      <main className="min-w-0 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
        <header className="mb-6 rounded-3xl border border-white/10 bg-white/6 px-5 py-5 backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-200">Live Operations</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Emergency command center
              </h2>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-emerald-200">
                AI severity monitoring
              </span>
              <span className="rounded-full border border-sky-400/20 bg-sky-400/10 px-4 py-2 text-sky-200">
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
