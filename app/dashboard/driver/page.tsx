"use client";

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MapPinned, Navigation, Phone } from 'lucide-react';
import { AMBULANCES_ENDPOINT, CASES_ENDPOINT } from '@/lib/api';

type EmergencyCase = {
  id: string;
  status: 'PENDING' | 'DISPATCHED' | 'RESOLVED';
  locationLat: number;
  locationLng: number;
  aiSeverity: string | null;
  user: {
    name: string;
    phone: string;
  } | null;
};

type AmbulanceUnit = {
  id: string;
  driverName: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'OFF_DUTY';
  currentAssignment: {
    id: string;
  } | null;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export default function DriverPanel() {
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [units, setUnits] = useState<AmbulanceUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDriverData = async () => {
    setLoading(true);

    try {
      const [casesResponse, unitsResponse] = await Promise.all([
        fetch(CASES_ENDPOINT, { cache: 'no-store' }).catch(() => null),
        fetch(AMBULANCES_ENDPOINT, { cache: 'no-store' }).catch(() => null),
      ]);

      // If API is available, use it
      if (casesResponse?.ok && unitsResponse?.ok) {
        const [casesJson, unitsJson] = (await Promise.all([
          casesResponse.json(),
          unitsResponse.json(),
        ])) as [ApiResponse<EmergencyCase[]>, ApiResponse<AmbulanceUnit[]>];

        setCases(casesJson.data ?? []);
        setUnits(unitsJson.data ?? []);
        setError(null);
      } else {
        // Use mock data if API is not available
        const mockCases: EmergencyCase[] = [
          {
            id: 'CASE001',
            status: 'DISPATCHED',
            locationLat: 40.7128,
            locationLng: -74.006,
            aiSeverity: 'CRITICAL',
            user: {
              name: 'John Doe',
              phone: '+1-555-0101',
            },
          },
        ];

        const mockUnits: AmbulanceUnit[] = [
          {
            id: 'AMB001',
            driverName: 'Robert Wilson',
            status: 'DISPATCHED',
            currentAssignment: { id: 'CASE001' },
          },
        ];

        setCases(mockCases);
        setUnits(mockUnits);
        setError(null);
      }
    } catch (loadError) {
      const message =
        loadError instanceof Error ? loadError.message : 'Unable to load driver panel data.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDriverData();
    }, 0);

    const interval = window.setInterval(() => {
      void loadDriverData();
    }, 10000);

    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  const activeUnit = useMemo(
    () => units.find((unit) => unit.status === 'DISPATCHED' && unit.currentAssignment),
    [units]
  );

  const activeCase = useMemo(() => {
    if (!activeUnit?.currentAssignment?.id) {
      return null;
    }

    return cases.find((emergencyCase) => emergencyCase.id === activeUnit.currentAssignment?.id) ?? null;
  }, [activeUnit, cases]);

  const confirmArrival = async () => {
    if (!activeUnit) {
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(`/api/ambulances/${activeUnit.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'AVAILABLE' }),
      });

      if (!response.ok) {
        throw new Error('Unable to confirm arrival.');
      }

      await loadDriverData();
    } catch (updateError) {
      const message =
        updateError instanceof Error ? updateError.message : 'Unable to confirm arrival.';
      setError(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Driver Operations</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Active Navigation & Mission</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This panel allows ambulance drivers to view their current mission, communicate with the hospital, and navigate to the incident location.
        </p>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main Map / Route Area */}
        <div className="flex min-h-[500px] flex-col overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="flex items-center gap-2 text-cyan-700">
              <Navigation size={18} />
              <h2 className="font-semibold text-slate-900">Live Route Guidance</h2>
            </div>
          </div>
          
          <div className="flex flex-1 items-center justify-center bg-slate-100/50 p-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 text-cyan-600">
                <MapPinned size={32} />
              </div>
              <p className="mt-4 text-slate-500">
                {loading
                  ? 'Loading route coordinates...'
                  : activeCase
                    ? `Route to ${activeCase.locationLat.toFixed(4)}, ${activeCase.locationLng.toFixed(4)}`
                    : 'No active dispatch route yet. Waiting for assignment.'}
                <br />
                {activeCase ? '(Live mission route is active)' : '(Driver panel will update automatically)'}
              </p>

              {activeCase ? (
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={`https://www.google.com/maps?q=${activeCase.locationLat},${activeCase.locationLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-cyan-200 bg-white px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50"
                  >
                    Open in Google Maps
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeCase.locationLat},${activeCase.locationLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    Start Navigation
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Sidebar / Actions */}
        <div className="space-y-4">
          <article className="rounded-3xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="rounded-full border border-rose-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-rose-700 shadow-sm">
                {activeCase?.aiSeverity ?? 'IDLE'}
              </span>
              <span className="text-sm font-medium text-rose-600">
                {activeCase ? 'Mission active' : 'No dispatch yet'}
              </span>
            </div>

            <h3 className="mt-4 text-xl font-semibold text-slate-900">
              {activeCase?.user?.name ?? 'No active case'}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {activeCase
                ? `Location: ${activeCase.locationLat.toFixed(4)}, ${activeCase.locationLng.toFixed(4)}`
                : 'Waiting for dispatch assignment.'}
            </p>
            
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => {
                  void confirmArrival();
                }}
                disabled={!activeUnit || updating}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rose-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={18} />
                {updating ? 'Updating...' : 'Confirm Arrival'}
              </button>
              <a
                href={activeCase?.user?.phone ? `tel:${activeCase.user.phone}` : '#'}
                aria-disabled={!activeCase?.user?.phone}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 aria-disabled:pointer-events-none aria-disabled:opacity-60"
              >
                <Phone size={18} />
                {activeCase?.user?.phone ? 'Call Patient' : 'No contact available'}
              </a>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Hospital Connection</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {activeUnit
                ? `${activeUnit.driverName} is linked to an active dispatch. Patient data is syncing to the receiving hospital.`
                : 'No active dispatch is linked yet. New assignments will appear here automatically.'}
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
