import { API_BASE_URL } from '@/lib/api';
import UnitsClient, { type AmbulanceUnit, type ApiResponse } from './units-client';

async function loadInitialUnits() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ambulances`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      // Return mock data if API is not available
      return [
        {
          id: 'AMB001',
          vehicleNumber: 'A-101',
          driverName: 'Robert Wilson',
          driverPhone: '+1-555-1001',
          status: 'AVAILABLE',
          currentAssignment: null,
          recommendedAction: 'Standing by at Station 1',
        },
        {
          id: 'AMB002',
          vehicleNumber: 'A-102',
          driverName: 'Sarah Davis',
          driverPhone: '+1-555-1002',
          status: 'AVAILABLE',
          currentAssignment: null,
          recommendedAction: 'Standing by at Station 2',
        },
        {
          id: 'AMB003',
          vehicleNumber: 'A-103',
          driverName: 'Michael Brown',
          driverPhone: '+1-555-1003',
          status: 'DISPATCHED',
          currentAssignment: { id: 'CASE001' },
          recommendedAction: 'En route to emergency',
        },
        {
          id: 'AMB004',
          vehicleNumber: 'A-104',
          driverName: 'Emily Johnson',
          driverPhone: '+1-555-1004',
          status: 'OFF_DUTY',
          currentAssignment: null,
          recommendedAction: 'Off duty - maintenance',
        },
      ] as AmbulanceUnit[];
    }

    const payload = (await response.json()) as ApiResponse<AmbulanceUnit[]>;
    return payload.data ?? [];
  } catch {
    // Return mock data on error
    return [
      {
        id: 'AMB001',
        vehicleNumber: 'A-101',
        driverName: 'Robert Wilson',
        driverPhone: '+1-555-1001',
        status: 'AVAILABLE',
        currentAssignment: null,
        recommendedAction: 'Standing by at Station 1',
      },
      {
        id: 'AMB002',
        vehicleNumber: 'A-102',
        driverName: 'Sarah Davis',
        driverPhone: '+1-555-1002',
        status: 'AVAILABLE',
        currentAssignment: null,
        recommendedAction: 'Standing by at Station 2',
      },
      {
        id: 'AMB003',
        vehicleNumber: 'A-103',
        driverName: 'Michael Brown',
        driverPhone: '+1-555-1003',
        status: 'DISPATCHED',
        currentAssignment: { id: 'CASE001' },
        recommendedAction: 'En route to emergency',
      },
      {
        id: 'AMB004',
        vehicleNumber: 'A-104',
        driverName: 'Emily Johnson',
        driverPhone: '+1-555-1004',
        status: 'OFF_DUTY',
        currentAssignment: null,
        recommendedAction: 'Off duty - maintenance',
      },
    ] as AmbulanceUnit[];
  }
}

export default async function UnitsPage() {
  const initialUnits = await loadInitialUnits();

  return <UnitsClient initialUnits={initialUnits} />;
}
