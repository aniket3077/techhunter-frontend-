'use client';

import { useEffect, useState } from 'react';
import { Clock, AlertCircle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function DashboardPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would use SWR or React Query, and handle auto-polling or websockets
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        if (!res.ok) throw new Error('Failed to fetch cases');
        const json = await res.json();
        setCases(json.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
    const interval = setInterval(fetchCases, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity?.toUpperCase()) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-medium"><AlertCircle size={14}/> Pending</span>;
      case 'DISPATCHED':
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs font-medium"><Activity size={14}/> Dispatched</span>;
      case 'RESOLVED':
        return <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs font-medium"><CheckCircle2 size={14}/> Resolved</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Active Emergencies</h3>
          <p className="text-3xl font-bold text-red-600">{cases.filter(c => c.status !== 'RESOLVED').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Pending Dispatch</h3>
          <p className="text-3xl font-bold text-orange-600">{cases.filter(c => c.status === 'PENDING').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Available Ambulances</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-2">Avg Response Time</h3>
          <p className="text-3xl font-bold text-blue-600">4m 12s</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-800">Live Incident Feed</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading cases...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">Error: {error}</div>
        ) : cases.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No emergency cases found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-200 text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Patient / Contact</th>
                  <th className="px-6 py-3 font-medium">AI Severity</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Assigned Unit</th>
                  <th className="px-6 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{c.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-gray-500">{c.user?.phone || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 border rounded-md text-xs font-semibold ${getSeverityColor(c.aiSeverity)}`}>
                        {c.aiSeverity || 'ANALYZING'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {c.assignedDriver ? c.assignedDriver.driverName : 'Unassigned'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors">
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
