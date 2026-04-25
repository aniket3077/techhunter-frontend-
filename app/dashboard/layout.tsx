import Link from 'next/link';
import { Activity, AlertTriangle, Users, Map as MapIcon, Settings } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-red-500">
            <Activity size={28} />
            CareDispatch
          </h1>
          <p className="text-slate-400 text-sm mt-1">Hospital Dashboard</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg transition-colors">
            <AlertTriangle size={20} />
            <span>Emergencies</span>
          </Link>
          <Link href="/dashboard/dispatch" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
            <MapIcon size={20} />
            <span>Live Map</span>
          </Link>
          <Link href="/dashboard/units" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
            <Users size={20} />
            <span>Ambulances</span>
          </Link>
          <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
              CG
            </div>
            <div>
              <p className="font-medium text-sm">City General</p>
              <p className="text-xs text-green-400">● Online</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Emergency Command Center</h2>
          <div className="flex gap-4">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">System Status: Optimal</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Beds Available: 42</span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
