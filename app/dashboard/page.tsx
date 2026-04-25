'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  Ambulance,
  BrainCircuit,
  CheckCircle2,
  Clock3,
  MapPinned,
  Radio,
  TimerReset,
  TriangleAlert,
  Hospital,
  Navigation,
  Shield,
} from 'lucide-react';
import { AMBULANCES_ENDPOINT, CASES_ENDPOINT } from '@/lib/api';

type NearbyLocation = {
  id: string;
  name: string;
  type: 'hospital' | 'police_station' | 'fire_station' | 'pharmacy';
  address: string;
  distance: number;
  eta: number;
  coordinates: { lat: number; lng: number };
  available?: boolean;
  capacity?: string;
};

const nearbyLocations: NearbyLocation[] = [
  {
    id: 'HOSP001',
    name: 'City General Hospital',
    type: 'hospital',
    address: '456 Medical Plaza, Downtown',
    distance: 2.3,
    eta: 6,
    coordinates: { lat: 40.7200, lng: -74.0100 },
    available: true,
    capacity: '15 beds available',
  },
  {
    id: 'HOSP002',
    name: 'Memorial Hospital',
    type: 'hospital',
    address: '789 Health Ave, Midtown',
    distance: 4.1,
    eta: 10,
    coordinates: { lat: 40.7600, lng: -73.9900 },
    available: true,
    capacity: '8 beds available',
  },
  {
    id: 'HOSP003',
    name: 'St. Mary Medical Center',
    type: 'hospital',
    address: '321 Care Blvd, Westside',
    distance: 5.8,
    eta: 14,
    coordinates: { lat: 40.7450, lng: -73.9750 },
    available: false,
    capacity: 'At capacity',
  },
  {
    id: 'POL001',
    name: 'Police Station 1',
    type: 'police_station',
    address: '100 Safety St, Downtown',
    distance: 1.5,
    eta: 4,
    coordinates: { lat: 40.7150, lng: -74.0050 },
  },
  {
    id: 'FIRE001',
    name: 'Fire Station 1',
    type: 'fire_station',
    address: '200 Rescue Rd, Downtown',
    distance: 1.8,
    eta: 5,
    coordinates: { lat: 40.7250, lng: -74.0000 },
  },
  {
    id: 'PHARM001',
    name: '24/7 Emergency Pharmacy',
    type: 'pharmacy',
    address: '150 Health Plaza, Downtown',
    distance: 1.2,
    eta: 3,
    coordinates: { lat: 40.7100, lng: -74.0080 },
    available: true,
  },
];

type EmergencyCase = {
  id: string;
  status: 'PENDING' | 'DISPATCHED' | 'RESOLVED';
  locationLat: number;
  locationLng: number;
  aiSeverity: string | null;
  aiDescription: string | null;
  createdAt: string;
  user: {
    name: string;
    phone: string;
    bloodType: string | null;
    medicalHistory: string | null;
  } | null;
  assignedDriver: {
    driverName: string;
    status: string;
    hospital: {
      name: string;
    } | null;
  } | null;
};

type AmbulanceUnit = {
  id: string;
  driverName: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'OFF_DUTY';
  currentLat: number | null;
  currentLng: number | null;
  hospital: {
    name: string;
  } | null;
  activeAssignmentCount: number;
  recommendedAction: string;
  currentAssignment: {
    id: string;
    status: string;
    aiSeverity: string | null;
    locationLat: number;
    locationLng: number;
    createdAt: string;
  } | null;
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
  data: T;
};

function severityTone(severity: string | null) {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    case 'HIGH':
      return 'border-orange-200 bg-orange-50 text-orange-700';
    case 'MEDIUM':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    default:
      return 'border-slate-200 bg-slate-50 text-slate-600';
  }
}

function statusTone(status: EmergencyCase['status'] | AmbulanceUnit['status']) {
  switch (status) {
    case 'PENDING':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    case 'DISPATCHED':
      return 'border-sky-200 bg-sky-50 text-sky-700';
    case 'RESOLVED':
    case 'AVAILABLE':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    default:
      return 'border-amber-200 bg-amber-50 text-amber-700';
  }
}

function formatMinutes(minutes: number | null) {
  return minutes === null ? 'Learning' : `${minutes} min`;
}

export default function DashboardPage() {
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        const [casesResponse, summaryResponse, ambulanceResponse] = await Promise.all([
          fetch(CASES_ENDPOINT, { cache: 'no-store' }),
          fetch('/api/dashboard/summary', { cache: 'no-store' }),
          fetch(AMBULANCES_ENDPOINT, { cache: 'no-store' }),
        ]);

        if (!casesResponse.ok || !summaryResponse.ok || !ambulanceResponse.ok) {
          throw new Error('Unable to refresh command center data.');
        }

        const [casesJson, summaryJson, ambulancesJson] = (await Promise.all([
          casesResponse.json(),
          summaryResponse.json(),
          ambulanceResponse.json(),
        ])) as [
          ApiResponse<EmergencyCase[]>,
          ApiResponse<DashboardSummary>,
          ApiResponse<AmbulanceUnit[]>,
        ];

        if (!mounted) {
          return;
        }

        setCases(casesJson.data ?? []);
        setSummary(summaryJson.data ?? null);
        setAmbulances(ambulancesJson.data ?? []);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        setError(null);
      } catch (fetchError) {
        if (!mounted) {
          return;
        }

        const message =
          fetchError instanceof Error ? fetchError.message : 'Unable to refresh command center data.';
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void fetchDashboard();
    const interval = window.setInterval(() => {
      void fetchDashboard();
    }, 10000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const activeCases = cases.filter((emergencyCase) => emergencyCase.status !== 'RESOLVED');
  const highlightedCase = activeCases[0] ?? null;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Active emergencies</p>
            <TriangleAlert className="text-rose-500" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {summary?.activeEmergencies ?? activeCases.length}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Critical alerts: {summary?.criticalAlerts ?? 0}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Pending dispatch</p>
            <Radio className="text-amber-500" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {summary?.pendingDispatch ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Last refresh: {lastUpdated ?? 'Starting stream'}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Available ambulances</p>
            <Ambulance className="text-emerald-500" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {summary?.availableAmbulances ?? 0}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Fleet readiness: {summary?.fleetReadiness ?? 0}%
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Average response loop</p>
            <TimerReset className="text-sky-500" size={18} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {formatMinutes(summary?.averageResolutionMinutes ?? null)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Resolved today: {summary?.resolvedToday ?? 0}
          </p>
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,1fr)]">
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Case Monitoring</p>
              <h3 className="mt-2 text-xl font-semibold text-slate-900">Live incident feed</h3>
            </div>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              {loading ? 'Syncing' : `${activeCases.length} live`}
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {loading && cases.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-slate-500">
                Loading emergency cases...
              </div>
            ) : activeCases.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-slate-500">
                No active emergency cases yet. New SOS requests will appear here.
              </div>
            ) : (
              activeCases.map((emergencyCase) => (
                <article
                  key={emergencyCase.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${severityTone(
                            emergencyCase.aiSeverity
                          )}`}
                        >
                          {emergencyCase.aiSeverity ?? 'ANALYZING'}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusTone(
                            emergencyCase.status
                          )}`}
                        >
                          {emergencyCase.status}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-slate-900">
                          {emergencyCase.user?.name ?? 'Unknown caller'}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {emergencyCase.user?.phone ?? 'No contact number captured'}
                        </p>
                      </div>

                      <div className="grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                        <p className="flex items-center gap-2">
                          <Clock3 size={16} className="text-cyan-600" />
                          {new Date(emergencyCase.createdAt).toLocaleString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPinned size={16} className="text-cyan-600" />
                          {emergencyCase.locationLat.toFixed(4)}, {emergencyCase.locationLng.toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div className="min-w-[220px] rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-cyan-700">
                        Assigned response
                      </p>
                      <p className="mt-2 text-base font-semibold text-slate-900">
                        {emergencyCase.assignedDriver?.driverName ?? 'Awaiting dispatch'}
                      </p>
                      <p className="mt-1 text-sm text-cyan-800/80">
                        {emergencyCase.assignedDriver?.hospital?.name ?? 'Smart allocation queue'}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {emergencyCase.aiDescription?.trim() ||
                      'AI summary pending. Voice, image, and live tracking signals can enrich this case.'}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">AI Dispatch</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Severity and allocation view</h3>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 text-cyan-600">
                  <BrainCircuit size={18} />
                  <p className="text-sm font-semibold">Current AI recommendation</p>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {highlightedCase
                    ? `Prioritize ${highlightedCase.user?.name ?? 'the latest caller'} and route the nearest available ambulance before the next polling cycle.`
                    : 'No active cases right now. AI dispatch recommendations will appear when new SOS events arrive.'}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Connected hospitals</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">
                    {summary?.connectedHospitals ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200/60 bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Fleet size</p>
                  <p className="mt-3 text-2xl font-semibold text-slate-900">
                    {summary?.totalAmbulances ?? ambulances.length}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Resource Allocation</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Ambulance readiness board</h3>
              </div>
              <Activity size={18} className="text-emerald-500" />
            </div>

            <div className="mt-5 space-y-3">
              {ambulances.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-slate-500">
                  No ambulance units available yet. Add drivers in the backend database to populate this fleet board.
                </div>
              ) : (
                ambulances.slice(0, 4).map((ambulance) => (
                  <div
                    key={ambulance.id}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-base font-semibold text-slate-900">{ambulance.driverName}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {ambulance.hospital?.name ?? 'Unassigned hospital'}
                        </p>
                      </div>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusTone(
                          ambulance.status
                        )}`}
                      >
                        {ambulance.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-600">{ambulance.recommendedAction}</p>
                    <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                      Active assignments: {ambulance.activeAssignmentCount}
                    </p>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Nearby Locations */}
          <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Nearby Facilities</p>
                <h3 className="mt-2 text-xl font-semibold text-slate-900">Critical locations</h3>
              </div>
              <MapPinned size={18} className="text-cyan-500" />
            </div>

            <div className="mt-5 space-y-3 max-h-[500px] overflow-y-auto">
              {nearbyLocations.map(location => (
                <div
                  key={location.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-cyan-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {location.type === 'hospital' && (
                          <Hospital size={16} className="text-green-600" />
                        )}
                        {location.type === 'police_station' && (
                          <Shield size={16} className="text-blue-600" />
                        )}
                        {location.type === 'fire_station' && (
                          <TriangleAlert size={16} className="text-red-600" />
                        )}
                        {location.type === 'pharmacy' && (
                          <Activity size={16} className="text-purple-600" />
                        )}
                        <span className="font-semibold text-slate-900 text-sm">{location.name}</span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{location.address}</p>
                      <div className="mt-2 flex items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Navigation size={12} />
                          {location.distance} km
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Clock3 size={12} />
                          {location.eta} min
                        </span>
                        {location.capacity && (
                          <span className="text-slate-500">{location.capacity}</span>
                        )}
                      </div>
                      {location.available !== undefined && (
                        <div className="mt-2">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                              location.available
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {location.available ? 'Available' : 'Full'}
                          </span>
                        </div>
                      )}
                    </div>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-xs font-medium text-cyan-700 hover:bg-cyan-100 transition-colors"
                    >
                      Navigate
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600">
            <CheckCircle2 size={18} />
            <p className="text-sm font-semibold">Reliability goal</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Keep operators focused on a single live surface for alerts, ambulance readiness,
            and hospital coordination.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600">
            <Ambulance size={18} />
            <p className="text-sm font-semibold">Fleet control</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Ambulance units are exposed through a dedicated endpoint so the fleet view can
            power accept, reject, and availability workflows.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
          <div className="flex items-center gap-2 text-cyan-600">
            <MapPinned size={18} />
            <p className="text-sm font-semibold">Route-ready intake</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Location coordinates are stored with every SOS event so route optimization can be
            layered in without changing the incident model.
          </p>
        </div>
      </section>
    </div>
  );
}
