import { API_BASE_URL } from '@/lib/api';
import UnitsClient, { type AmbulanceUnit, type ApiResponse } from './units-client';

async function loadInitialUnits() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ambulances`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as ApiResponse<AmbulanceUnit[]>;
    return payload.data ?? [];
  } catch {
    return [];
  }
}

export default async function UnitsPage() {
  const initialUnits = await loadInitialUnits();

  return <UnitsClient initialUnits={initialUnits} />;
}
