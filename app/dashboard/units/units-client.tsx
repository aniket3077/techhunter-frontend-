'use client';

import { useState } from 'react';
import { Ambulance, CheckCircle2, Navigation, PauseCircle, RefreshCcw } from 'lucide-react';
import { AMBULANCES_ENDPOINT } from '@/lib/api';

export type AmbulanceUnit = {
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

export type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type UnitStatus = AmbulanceUnit['status'];

function statusTone(status: UnitStatus) {
  switch (status) {
    case 'AVAILABLE':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'DISPATCHED':
      return 'border-sky-200 bg-sky-50 text-sky-700';
    default:
      return 'border-amber-200 bg-amber-50 text-amber-700';
  }
}

function getPrimaryAction(status: UnitStatus) {
  if (status === 'AVAILABLE') {
    return { label: 'Accept request', nextStatus: 'DISPATCHED' as const };
  }

  if (status === 'DISPATCHED') {
    return { label: 'Complete run', nextStatus: 'AVAILABLE' as const };
  }

  return { label: 'Reactivate unit', nextStatus: 'AVAILABLE' as const };
}

export default function UnitsClient({ initialUnits }: { initialUnits: AmbulanceUnit[] }) {
  const [units, setUnits] = useState<AmbulanceUnit[]>(initialUnits);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingUnitId, setUpdatingUnitId] = useState<string | null>(null);

  const loadUnits = async () => {
    setLoading(true);

    try {
      const response = await fetch(AMBULANCES_ENDPOINT, { cache: 'no-store' });

      if (!response.ok) {
        throw new Error('Unable to load ambulance fleet.');
      }

      const payload = (await response.json()) as ApiResponse<AmbulanceUnit[]>;
      setUnits(payload.data ?? []);
      setError(null);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error ? fetchError.message : 'Unable to load ambulance fleet.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (driverId: string, status: UnitStatus) => {
    setUpdatingUnitId(driverId);

    try {
      const response = await fetch(`/api/ambulances/${driverId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Unable to update ambulance status.');
      }

      await loadUnits();
      setError(null);
    } catch (updateError) {
      const message =
        updateError instanceof Error ? updateError.message : 'Unable to update ambulance status.';
      setError(message);
    } finally {
      setUpdatingUnitId(null);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">Ambulance Interface</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Fleet readiness and response actions</h1>
          </div>

          <button
            onClick={() => {
              void loadUnits();
            }}
            className="inline-flex items-center gap-2 self-start rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <RefreshCcw size={16} />
            {loading ? 'Refreshing...' : 'Refresh fleet'}
          </button>
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          This view supports the ambulance side of the PRD with request acceptance, completion, and
          temporary off-duty state changes backed by live API updates.
        </p>
      </section>

      {error ? (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading && units.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-slate-500 md:col-span-2 xl:col-span-3">
            Loading ambulance fleet...
          </div>
        ) : units.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center text-slate-500 md:col-span-2 xl:col-span-3">
            No ambulance units found. Add drivers in the backend database to enable fleet controls.
          </div>
        ) : (
          units.map((unit) => {
            const primaryAction = getPrimaryAction(unit.status);
            const isBusy = updatingUnitId === unit.id;

            return (
              <article key={unit.id} className="rounded-3xl border border-slate-200/60 bg-white/60 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{unit.driverName}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {unit.hospital?.name ?? 'No hospital assigned'}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${statusTone(
                      unit.status
                    )}`}
                  >
                    {unit.status}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p className="flex items-center gap-2">
                    <Ambulance size={16} className="text-cyan-600" />
                    Active assignments: {unit.activeAssignmentCount}
                  </p>
                  <p className="flex items-center gap-2">
                    <Navigation size={16} className="text-cyan-600" />
                    {unit.recommendedAction}
                  </p>
                  <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    {unit.currentAssignment
                      ? `Current case ${unit.currentAssignment.id.slice(0, 8)} is ${unit.currentAssignment.aiSeverity ?? 'ANALYZING'} severity.`
                      : 'No active case attached. Unit is ready for the next dispatch cycle.'}
                  </p>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      void updateStatus(unit.id, primaryAction.nextStatus);
                    }}
                    disabled={isBusy}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <CheckCircle2 size={16} />
                    {isBusy ? 'Updating...' : primaryAction.label}
                  </button>

                  {unit.status !== 'OFF_DUTY' ? (
                    <button
                      onClick={() => {
                        void updateStatus(unit.id, 'OFF_DUTY');
                      }}
                      disabled={isBusy}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <PauseCircle size={16} />
                      Mark off duty
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </section>
    </div>
  );
}
