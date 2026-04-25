"use client";

import { useEffect, useMemo, useState } from 'react';
import { APIProvider, Map as GoogleMap, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { Siren, Map, ShieldAlert, Check, Radio, MapPin, Hospital, Building2 } from 'lucide-react';
import { AMBULANCES_ENDPOINT, CASES_ENDPOINT } from '@/lib/api';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const TRAFFIC_ROUTE_CLEARED_MARKER = '[TRAFFIC_ROUTE_CLEARED]';

type Landmark = {
  id: string;
  name: string;
  type: 'hospital' | 'police_station' | 'fire_station';
  coordinates: { lat: number; lng: number };
};

const landmarks: Landmark[] = [
  {
    id: 'HOSP001',
    name: 'City General Hospital',
    type: 'hospital',
    coordinates: { lat: 40.7200, lng: -74.0100 },
  },
  {
    id: 'HOSP002',
    name: 'Memorial Hospital',
    type: 'hospital',
    coordinates: { lat: 40.7600, lng: -73.9900 },
  },
  {
    id: 'HOSP003',
    name: 'St. Mary Medical Center',
    type: 'hospital',
    coordinates: { lat: 40.7450, lng: -73.9750 },
  },
  {
    id: 'POL001',
    name: 'Police Station 1',
    type: 'police_station',
    coordinates: { lat: 40.7150, lng: -74.0050 },
  },
  {
    id: 'POL002',
    name: 'Police Station 2',
    type: 'police_station',
    coordinates: { lat: 40.7550, lng: -73.9800 },
  },
  {
    id: 'FIRE001',
    name: 'Fire Station 1',
    type: 'fire_station',
    coordinates: { lat: 40.7250, lng: -74.0000 },
  },
];

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
        // Try to fetch from API first
        const [casesResponse, unitsResponse] = await Promise.all([
          fetch(CASES_ENDPOINT, { cache: 'no-store' }).catch(() => null),
          fetch(AMBULANCES_ENDPOINT, { cache: 'no-store' }).catch(() => null),
        ]);

        if (!mounted) {
          return;
        }

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
              aiSeverity: 'CRITICAL',
              aiDescription: 'Cardiac arrest, patient unconscious',
              locationLat: 40.7128,
              locationLng: -74.006,
            },
            {
              id: 'CASE002',
              status: 'DISPATCHED',
              aiSeverity: 'HIGH',
              aiDescription: 'Severe bleeding from accident',
              locationLat: 40.7589,
              locationLng: -73.9851,
            },
          ];

          const mockUnits: AmbulanceUnit[] = [
            {
              id: 'AMB001',
              driverName: 'Robert Wilson',
              status: 'DISPATCHED',
              currentAssignment: { id: 'CASE001' },
              recommendedAction: 'En route to emergency location',
            },
            {
              id: 'AMB002',
              driverName: 'Sarah Davis',
              status: 'DISPATCHED',
              currentAssignment: { id: 'CASE002' },
              recommendedAction: 'En route to emergency location',
            },
            {
              id: 'AMB003',
              driverName: 'Michael Brown',
              status: 'AVAILABLE',
              currentAssignment: null,
              recommendedAction: 'Standing by at station',
            },
          ];

          setCases(mockCases);
          setUnits(mockUnits);
          setError(null);
        }
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
          
          <div className="flex-1 bg-slate-100/40">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <GoogleMap
                defaultCenter={{ lat: 40.7128, lng: -74.006 }}
                defaultZoom={12}
                mapId="police-traffic-map"
                gestureHandling="greedy"
                disableDefaultUI={false}
                style={{ width: '100%', height: '100%' }}
              >
                {/* Emergency Case Markers */}
                {corridorItems.map(({ unit, currentCase }) =>
                  currentCase ? (
                    <Marker
                      key={currentCase.id}
                      position={{ lat: currentCase.locationLat, lng: currentCase.locationLng }}
                      title={`Emergency: ${currentCase.aiSeverity}`}
                    />
                  ) : null
                )}

                {/* Ambulance Unit Markers */}
                {corridorItems.map(({ unit }) => (
                  <Marker
                    key={unit.id}
                    position={{ lat: 40.7128 + Math.random() * 0.05, lng: -74.006 + Math.random() * 0.05 }}
                    title={`Ambulance: ${unit.driverName}`}
                  />
                ))}

                {/* Hospital Landmarks */}
                {landmarks
                  .filter(l => l.type === 'hospital')
                  .map(landmark => (
                    <Marker
                      key={landmark.id}
                      position={landmark.coordinates}
                      title={landmark.name}
                    />
                  ))}

                {/* Police Station Landmarks */}
                {landmarks
                  .filter(l => l.type === 'police_station')
                  .map(landmark => (
                    <Marker
                      key={landmark.id}
                      position={landmark.coordinates}
                      title={landmark.name}
                    />
                  ))}

                {/* Fire Station Landmarks */}
                {landmarks
                  .filter(l => l.type === 'fire_station')
                  .map(landmark => (
                    <Marker
                      key={landmark.id}
                      position={landmark.coordinates}
                      title={landmark.name}
                    />
                  ))}
              </GoogleMap>
            </APIProvider>
          </div>

          {/* Map Legend */}
          <div className="border-t border-slate-100 bg-white px-5 py-3">
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-600"></div>
                <span className="text-slate-600">Critical Emergency</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-slate-600">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-slate-600">Ambulance / Police</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-slate-600">Hospital</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-slate-600">Fire Station</span>
              </div>
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
