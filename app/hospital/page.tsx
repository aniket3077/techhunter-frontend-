'use client';

import { useState, useEffect } from 'react';
import {
  Bed,
  Activity,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
} from 'lucide-react';

type DashboardData = {
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  icuBeds: number;
  icuAvailable: number;
  doctorsOnDuty: number;
  totalDoctors: number;
  emergencyAlerts: number;
};

export default function HospitalDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/dashboard');
      // const result = await response.json();

      // Mock data
      const mockData: DashboardData = {
        totalBeds: 250,
        availableBeds: 45,
        occupiedBeds: 205,
        icuBeds: 40,
        icuAvailable: 8,
        doctorsOnDuty: 12,
        totalDoctors: 25,
        emergencyAlerts: 2,
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      setData(mockData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No data available</p>
      </div>
    );
  }

  const bedAvailabilityPercentage = Math.round((data.availableBeds / data.totalBeds) * 100);
  const icuAvailabilityPercentage = Math.round((data.icuAvailable / data.icuBeds) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Hospital Management Overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-600">Last updated</p>
          <p className="text-sm font-medium text-slate-900 flex items-center gap-1">
            <Clock size={14} />
            {lastUpdated}
          </p>
        </div>
      </div>

      {/* Emergency Alerts */}
      {data.emergencyAlerts > 0 && (
        <div className="rounded-3xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-red-600" />
            <div>
              <p className="font-semibold text-red-900">Emergency Alerts</p>
              <p className="text-sm text-red-700">
                {data.emergencyAlerts} critical situation(s) require immediate attention
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Beds */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-blue-100 p-3">
              <Bed size={24} className="text-blue-600" />
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              bedAvailabilityPercentage > 30
                ? 'bg-green-100 text-green-700'
                : bedAvailabilityPercentage > 15
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {bedAvailabilityPercentage}% Available
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">Total Beds</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{data.totalBeds}</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-green-600 font-medium">Available: {data.availableBeds}</span>
            <span className="text-red-600 font-medium">Occupied: {data.occupiedBeds}</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${bedAvailabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* ICU Beds */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-red-100 p-3">
              <Activity size={24} className="text-red-600" />
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              icuAvailabilityPercentage > 30
                ? 'bg-green-100 text-green-700'
                : icuAvailabilityPercentage > 15
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {icuAvailabilityPercentage}% Available
            </span>
          </div>
          <h3 className="text-sm font-medium text-slate-600">ICU Beds</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{data.icuBeds}</p>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-green-600 font-medium">Available: {data.icuAvailable}</span>
            <span className="text-red-600 font-medium">Occupied: {data.icuBeds - data.icuAvailable}</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-red-500"
              style={{ width: `${icuAvailabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Doctors On Duty */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="rounded-full bg-green-100 p-3">
              <Users size={24} className="text-green-600" />
            </div>
            <TrendingUp size={20} className="text-green-600" />
          </div>
          <h3 className="text-sm font-medium text-slate-600">Doctors On Duty</h3>
          <p className="text-3xl font-bold text-slate-900 mt-2">{data.doctorsOnDuty}</p>
          <p className="mt-4 text-sm text-slate-600">
            Out of {data.totalDoctors} total doctors
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${(data.doctorsOnDuty / data.totalDoctors) * 100}%` }}
            />
          </div>
        </div>

        {/* Emergency Alerts */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className={`rounded-full p-3 ${
              data.emergencyAlerts > 0 ? 'bg-red-100' : 'bg-slate-100'
            }`}>
              <AlertTriangle size={24} className={
                data.emergencyAlerts > 0 ? 'text-red-600' : 'text-slate-400'
              } />
            </div>
            {data.emergencyAlerts > 0 && (
              <span className="animate-pulse h-3 w-3 rounded-full bg-red-500"></span>
            )}
          </div>
          <h3 className="text-sm font-medium text-slate-600">Emergency Alerts</h3>
          <p className={`text-3xl font-bold mt-2 ${
            data.emergencyAlerts > 0 ? 'text-red-600' : 'text-slate-900'
          }`}>
            {data.emergencyAlerts}
          </p>
          <p className="mt-4 text-sm text-slate-600">
            {data.emergencyAlerts > 0 ? 'Requires immediate attention' : 'All clear'}
          </p>
        </div>
      </div>

      {/* Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bed Occupancy Chart */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Bed Occupancy</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">General Beds</span>
                <span className="text-sm font-medium text-slate-900">
                  {data.occupiedBeds}/{data.totalBeds}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(data.occupiedBeds / data.totalBeds) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-600">ICU Beds</span>
                <span className="text-sm font-medium text-slate-900">
                  {data.icuBeds - data.icuAvailable}/{data.icuBeds}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${((data.icuBeds - data.icuAvailable) / data.icuBeds) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-left font-medium text-cyan-700 hover:bg-cyan-100 transition-colors">
              Update Bed Availability
            </button>
            <button className="w-full rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-left font-medium text-green-700 hover:bg-green-100 transition-colors">
              Manage Doctor Status
            </button>
            <button className="w-full rounded-xl border border-purple-200 bg-purple-50 px-4 py-3 text-left font-medium text-purple-700 hover:bg-purple-100 transition-colors">
              View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Low Availability Warning */}
      {(bedAvailabilityPercentage < 20 || icuAvailabilityPercentage < 20) && (
        <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle size={24} className="text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">Low Availability Warning</h3>
              <div className="space-y-1 text-sm text-yellow-700">
                {bedAvailabilityPercentage < 20 && (
                  <p>• General bed availability is critically low ({bedAvailabilityPercentage}%)</p>
                )}
                {icuAvailabilityPercentage < 20 && (
                  <p>• ICU bed availability is critically low ({icuAvailabilityPercentage}%)</p>
                )}
                <p className="mt-2 font-medium">Consider activating emergency protocols.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
