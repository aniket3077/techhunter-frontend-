"use client";

import { useEffect, useMemo, useState } from 'react';
import { Siren, Map, ShieldAlert, Check, Radio } from 'lucide-react';
import { AMBULANCES_ENDPOINT, CASES_ENDPOINT } from '@/lib/api';

const TRAFFIC_ROUTE_CLEARED_MARKER = '[TRAFFIC_ROUTE_CLEARED]';

type EmergencyCase = {
  id: string;
  status: 'PENDING' | 'DISPATCHED' | 'RESOLVED';
  aiSeverity: string | null;
  aiDescription: string | null;
  locationLat: number;
  locationLng: number;
};

type AmbulanceUnit = {
  id: string;
  driverName: string;
  status: 'AVAILABLE' | 'DISPATCHED' | 'OFF_DUTY';
  currentAssignment: {
    id: string;
  } | null;
  recommendedAction: string;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export default function PolicePanel() {
  const [cases, setCases] = useState<EmergencyCase[]>([]);
  const [units, setUnits] = useState<AmbulanceUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingCaseId, setUpdatingCaseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPoliceData = async (showLoading: boolean) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const [casesResponse, unitsResponse] = await Promise.all([
          fetch(CASES_ENDPOINT, { cache: 'no-store' }),
          fetch(AMBULANCES_ENDPOINT, { cache: 'no-store' }),
        ]);

        if (!casesResponse.ok || !unitsResponse.ok) {
          throw new Error('Unable to load police operations data.');
        }

        const [casesJson, unitsJson] = (await Promise.all([
          casesResponse.json(),
          unitsResponse.json(),
        ])) as [ApiResponse<EmergencyCase[]>, ApiResponse<AmbulanceUnit[]>];

        if (!mounted) {
          return;
        }

        setCases(casesJson.data ?? []);
        setUnits(unitsJson.data ?? []);
        setError(null);
      } catch (loadError) {
        if (!mounted) {
          return;
        }

        const message =
          loadError instanceof Error ? loadError.message : 'Unable to load police operations data.';
        setError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadPoliceData(true);

    const interval = window.setInterval(() => {
      void loadPoliceData(false);
    }, 10000);

    return () => {
      mounted = false;
      window.clearInterval(interval);
    };
  }, []);

  const dispatchedUnits = useMemo(
    () => units.filter((unit) => unit.status === 'DISPATCHED' && unit.currentAssignment),
    [units]
  );

  const corridorItems = useMemo(
    () =>
      dispatchedUnits.map((unit) => {
        const currentCase = cases.find((emergencyCase) => emergencyCase.id === unit.currentAssignment?.id) ?? null;
        return { unit, currentCase };
      }),
    [cases, dispatchedUnits]
  );

  const isRouteCleared = (description: string | null | undefined) =>
    typeof description === 'string' && description.includes(TRAFFIC_ROUTE_CLEARED_MARKER);

  const clearRouteMarker = (description: string | null | undefined) => {
    if (!description) {
      return '';
    }

    return description.replace(TRAFFIC_ROUTE_CLEARED_MARKER, '').replace(/\s{2,}/g, ' ').trim();
  };

  const toggleRouteClearance = async (emergencyCase: EmergencyCase | null) => {
    if (!emergencyCase) {
      return;
    }

    const currentlyCleared = isRouteCleared(emergencyCase.aiDescription);
    const descriptionWithoutMarker = clearRouteMarker(emergencyCase.aiDescription);
    const nextDescription = currentlyCleared
      ? descriptionWithoutMarker
      : `${descriptionWithoutMarker} ${TRAFFIC_ROUTE_CLEARED_MARKER}`.trim();

    setUpdatingCaseId(emergencyCase.id);

    try {
      const response = await fetch(`/api/cases/${emergencyCase.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ aiDescription: nextDescription }),
      });

      if (!response.ok) {
        throw new Error('Unable to update traffic route clearance.');
      }

      const payload = (await response.json()) as ApiResponse<EmergencyCase>;
      const updatedCase = payload.data;

      setCases((previous) =>
        previous.map((existingCase) =>
          existingCase.id === updatedCase.id
            ? {
                ...existingCase,
                ...updatedCase,
              }
            : existingCase
        )
      );
      setError(null);
    } catch (updateError) {
      const message =
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update traffic route clearance.';
      setError(message);
    } finally {
      setUpdatingCaseId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Police Operations</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Traffic Clearance & Corridors</h1>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
              This panel enables traffic authorities to view incoming critical ambulances and preemptively clear routes or create green corridors to minimize response times.
            </p>
          </div>
          <ShieldAlert size={48} className="text-blue-600 opacity-20" />
        </div>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Active Corridors Map */}
        <div className="flex min-h-[600px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Map size={18} />
              <h2 className="font-semibold text-slate-900">Live Traffic Control Map</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-blue-500"></span>
              </span>
              <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Live feed active</span>
            </div>
          </div>
          
          <div className="flex flex-1 items-center justify-center bg-slate-100/40 p-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Map size={32} />
              </div>
              <p className="mt-4 text-slate-500">
                {loading
                  ? 'Loading active emergency corridors...'
                  : corridorItems.length > 0
                    ? `Tracking ${corridorItems.length} dispatched unit corridor(s).`
                    : 'No active dispatched units right now.'}
              </p>

              {corridorItems.length > 0 ? (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {corridorItems.map(({ unit, currentCase }) =>
                    currentCase ? (
                      <a
                        key={unit.id}
                        href={`https://www.google.com/maps?q=${currentCase.locationLat},${currentCase.locationLng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-50"
                      >
                        Open {unit.driverName} route
                      </a>
                    ) : null
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Incoming Critical Units */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-900">Approaching Emergency Units</h3>
            <p className="text-sm text-slate-500">Units requiring priority clearance</p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-slate-500">
              Loading dispatched units...
            </div>
          ) : corridorItems.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-slate-500">
              No active dispatched units need traffic clearance.
            </div>
          ) : (
            corridorItems.map(({ unit, currentCase }) => {
              const cleared = isRouteCleared(currentCase?.aiDescription);
              const severity = currentCase?.aiSeverity?.toUpperCase() ?? 'UNKNOWN';
              const isUpdating = updatingCaseId === currentCase?.id;

              return (
                <article
                  key={unit.id}
                  className={`rounded-3xl border p-5 shadow-sm ${
                    cleared ? 'border-emerald-200 bg-emerald-50' : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Siren size={18} className={cleared ? 'text-emerald-600' : 'text-rose-600'} />
                        <span className="font-bold text-slate-900">{unit.driverName}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {currentCase
                          ? `Case coordinates: ${currentCase.locationLat.toFixed(4)}, ${currentCase.locationLng.toFixed(4)}`
                          : unit.recommendedAction}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2 py-1 text-xs font-bold shadow-sm ${
                        severity === 'CRITICAL'
                          ? 'border-rose-200 bg-white text-rose-600'
                          : 'border-amber-200 bg-amber-50 text-amber-700'
                      }`}
                    >
                      {severity}
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white/60 p-3">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                      <Radio size={16} className="text-blue-600" />
                      <span>
                        {cleared
                          ? 'Traffic route cleared. Keep corridor priority active.'
                          : 'Waiting for traffic override confirmation.'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-3">
                    <button
                      onClick={() => {
                        void toggleRouteClearance(currentCase);
                      }}
                      disabled={!currentCase || isUpdating}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        cleared ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                    >
                      <Check size={16} />
                      {isUpdating ? 'Saving...' : cleared ? 'Route Cleared' : 'Clear Traffic Route'}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
