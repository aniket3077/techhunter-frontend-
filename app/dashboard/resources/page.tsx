'use client';

import { useState, useEffect } from 'react';
import {
  Bed,
  Activity,
  Heart,
  Wind,
  Syringe,
  Pill,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

type ResourceData = {
  beds: {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
  };
  icu: {
    total: number;
    available: number;
    occupied: number;
    ventilators: number;
    ventilatorsAvailable: number;
  };
  emergency: {
    total: number;
    available: number;
    occupied: number;
  };
  equipment: {
    oxygenCylinders: number;
    emergencyKits: number;
    defibrillators: number;
    wheelchairs: number;
    stretchers: number;
  };
  pharmacy: {
    criticalMedicines: number;
    bloodUnits: number;
  };
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadResources();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadResources, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadResources = async () => {
    try {
      // Mock data - replace with actual API call
      const mockData: ResourceData = {
        beds: {
          total: 250,
          available: 45,
          occupied: 185,
          reserved: 20,
        },
        icu: {
          total: 40,
          available: 8,
          occupied: 30,
          ventilators: 25,
          ventilatorsAvailable: 5,
        },
        emergency: {
          total: 30,
          available: 12,
          occupied: 18,
        },
        equipment: {
          oxygenCylinders: 150,
          emergencyKits: 45,
          defibrillators: 20,
          wheelchairs: 35,
          stretchers: 40,
        },
        pharmacy: {
          criticalMedicines: 95,
          bloodUnits: 120,
        },
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      setResources(mockData);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateResource = async (category: string, field: string, change: number) => {
    if (!resources) return;

    setUpdating(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setResources(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          [category]: {
            ...prev[category as keyof ResourceData],
            [field]: Math.max(0, (prev[category as keyof ResourceData] as any)[field] + change),
          },
        };
      });
    } catch (error) {
      alert('Failed to update resource');
    } finally {
      setUpdating(false);
    }
  };

  const getAvailabilityStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage >= 30) return { color: 'green', label: 'Good' };
    if (percentage >= 15) return { color: 'yellow', label: 'Low' };
    return { color: 'red', label: 'Critical' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  if (!resources) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No resource data available</p>
      </div>
    );
  }

  const bedStatus = getAvailabilityStatus(resources.beds.available, resources.beds.total);
  const icuStatus = getAvailabilityStatus(resources.icu.available, resources.icu.total);
  const emergencyStatus = getAvailabilityStatus(resources.emergency.available, resources.emergency.total);

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">
              Resource Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Hospital Resources</h1>
            <p className="mt-2 text-sm text-slate-600">
              Real-time availability and resource allocation
            </p>
          </div>
          <button
            onClick={loadResources}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </section>

      {/* Alerts */}
      {(bedStatus.color === 'red' || icuStatus.color === 'red' || emergencyStatus.color === 'red') && (
        <section className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Critical Resource Alert</p>
              <p className="text-sm text-red-700">
                Some resources are running critically low. Immediate action required.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Bed Management */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Bed size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">General Beds</h2>
              <p className="text-sm text-slate-600">Regular patient beds</p>
            </div>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              bedStatus.color === 'green'
                ? 'bg-green-100 text-green-700'
                : bedStatus.color === 'yellow'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {bedStatus.label}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Total Beds</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{resources.beds.total}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700">Available</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold text-green-900">{resources.beds.available}</p>
              <div className="flex gap-1">
                <button
                  onClick={() => updateResource('beds', 'available', -1)}
                  disabled={updating || resources.beds.available === 0}
                  className="rounded-lg bg-green-200 p-1 hover:bg-green-300 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => updateResource('beds', 'available', 1)}
                  disabled={updating}
                  className="rounded-lg bg-green-200 p-1 hover:bg-green-300 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">Occupied</p>
            <p className="mt-2 text-3xl font-bold text-red-900">{resources.beds.occupied}</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-amber-700">Reserved</p>
            <p className="mt-2 text-3xl font-bold text-amber-900">{resources.beds.reserved}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(resources.beds.available / resources.beds.total) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-slate-600">
            {Math.round((resources.beds.available / resources.beds.total) * 100)}% Available
          </p>
        </div>
      </section>

      {/* ICU Management */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <Activity size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">ICU (Intensive Care Unit)</h2>
              <p className="text-sm text-slate-600">Critical care beds and ventilators</p>
            </div>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              icuStatus.color === 'green'
                ? 'bg-green-100 text-green-700'
                : icuStatus.color === 'yellow'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {icuStatus.label}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Total ICU</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{resources.icu.total}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700">Available</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold text-green-900">{resources.icu.available}</p>
              <div className="flex gap-1">
                <button
                  onClick={() => updateResource('icu', 'available', -1)}
                  disabled={updating || resources.icu.available === 0}
                  className="rounded-lg bg-green-200 p-1 hover:bg-green-300 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => updateResource('icu', 'available', 1)}
                  disabled={updating}
                  className="rounded-lg bg-green-200 p-1 hover:bg-green-300 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">Occupied</p>
            <p className="mt-2 text-3xl font-bold text-red-900">{resources.icu.occupied}</p>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <p className="text-sm text-purple-700">Ventilators</p>
            <p className="mt-2 text-3xl font-bold text-purple-900">{resources.icu.ventilators}</p>
          </div>
          <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-sm text-cyan-700">Available</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold text-cyan-900">{resources.icu.ventilatorsAvailable}</p>
              <div className="flex gap-1">
                <button
                  onClick={() => updateResource('icu', 'ventilatorsAvailable', -1)}
                  disabled={updating || resources.icu.ventilatorsAvailable === 0}
                  className="rounded-lg bg-cyan-200 p-1 hover:bg-cyan-300 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => updateResource('icu', 'ventilatorsAvailable', 1)}
                  disabled={updating}
                  className="rounded-lg bg-cyan-200 p-1 hover:bg-cyan-300 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Beds */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <Heart size={24} className="text-orange-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Emergency Department</h2>
              <p className="text-sm text-slate-600">Emergency room beds</p>
            </div>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              emergencyStatus.color === 'green'
                ? 'bg-green-100 text-green-700'
                : emergencyStatus.color === 'yellow'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {emergencyStatus.label}
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-600">Total Emergency Beds</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{resources.emergency.total}</p>
          </div>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm text-green-700">Available</p>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-3xl font-bold text-green-900">{resources.emergency.available}</p>
              <div className="flex gap-1">
                <button
                  onClick={() => updateResource('emergency', 'available', -1)}
                  disabled={updating || resources.emergency.available === 0}
                  className="rounded-lg bg-green-200 p-1 hover:bg-green-300 disabled:opacity-50"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => updateResource('emergency', 'available', 1)}
                  disabled={updating}
                  className="rounded-lg bg-green-200 p-1 hover:bg-green-300 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">Occupied</p>
            <p className="mt-2 text-3xl font-bold text-red-900">{resources.emergency.occupied}</p>
          </div>
        </div>
      </section>

      {/* Equipment & Supplies */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Equipment & Supplies</h2>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind size={18} className="text-blue-600" />
              <p className="text-sm font-medium text-slate-700">Oxygen Cylinders</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{resources.equipment.oxygenCylinders}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Syringe size={18} className="text-red-600" />
              <p className="text-sm font-medium text-slate-700">Emergency Kits</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{resources.equipment.emergencyKits}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity size={18} className="text-orange-600" />
              <p className="text-sm font-medium text-slate-700">Defibrillators</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{resources.equipment.defibrillators}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-green-600" />
              <p className="text-sm font-medium text-slate-700">Wheelchairs</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{resources.equipment.wheelchairs}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bed size={18} className="text-purple-600" />
              <p className="text-sm font-medium text-slate-700">Stretchers</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">{resources.equipment.stretchers}</p>
          </div>
        </div>
      </section>

      {/* Pharmacy & Blood Bank */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-purple-100 p-3">
              <Pill size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Pharmacy</h2>
              <p className="text-sm text-slate-600">Critical medicines stock</p>
            </div>
          </div>
          <div className="rounded-xl border border-purple-200 bg-purple-50 p-4">
            <p className="text-sm text-purple-700">Critical Medicines</p>
            <p className="mt-2 text-4xl font-bold text-purple-900">{resources.pharmacy.criticalMedicines}%</p>
            <p className="mt-2 text-sm text-purple-600">Stock Level</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <Heart size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Blood Bank</h2>
              <p className="text-sm text-slate-600">Available blood units</p>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">Blood Units</p>
            <p className="mt-2 text-4xl font-bold text-red-900">{resources.pharmacy.bloodUnits}</p>
            <p className="mt-2 text-sm text-red-600">Units Available</p>
          </div>
        </div>
      </section>
    </div>
  );
}
