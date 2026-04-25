'use client';

import { useState, useEffect } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import {
  AlertCircle,
  Ambulance,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Activity,
  Hospital,
  Navigation,
  CheckCircle,
  XCircle,
  TrendingUp,
  Users,
  Timer,
  Send,
  Bell,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

type NearbyLocation = {
  id: string;
  name: string;
  type: 'hospital' | 'police_station' | 'fire_station' | 'pharmacy';
  address: string;
  distance: number;
  eta: number;
  coordinates: { lat: number; lng: number };
  available?: boolean;
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

type Emergency = {
  id: string;
  patientName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  severity: 'critical' | 'high' | 'medium' | 'low';
  aiScore: number;
  reportedAt: string;
  status: 'pending' | 'assigned' | 'enroute' | 'arrived' | 'completed';
  description: string;
  contactNumber: string;
  recommendedHospital?: string;
  estimatedResponseTime?: number;
};

type AmbulanceUnit = {
  id: string;
  vehicleNumber: string;
  status: 'available' | 'busy' | 'offline';
  location: string;
  coordinates: { lat: number; lng: number };
  driverName: string;
  driverPhone: string;
  distanceKm?: number;
  eta?: number;
};

type DispatchHistory = {
  id: string;
  emergencyId: string;
  ambulanceId: string;
  dispatchedAt: string;
  completedAt?: string;
  responseTimeMinutes?: number;
  outcome: 'success' | 'failed' | 'cancelled';
};

export default function DispatchClient() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulanceUnit[]>([]);
  const [history, setHistory] = useState<DispatchHistory[]>([]);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceUnit | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('list');
  const [message, setMessage] = useState('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockEmergencies: Emergency[] = [
      {
        id: 'EMG001',
        patientName: 'John Doe',
        location: '123 Main St, Downtown',
        coordinates: { lat: 40.7128, lng: -74.006 },
        severity: 'critical',
        aiScore: 95,
        reportedAt: new Date(Date.now() - 5 * 60000).toISOString(),
        status: 'pending',
        description: 'Cardiac arrest, patient unconscious',
        contactNumber: '+1-555-0101',
        recommendedHospital: 'City General Hospital',
        estimatedResponseTime: 8,
      },
      {
        id: 'EMG002',
        patientName: 'Jane Smith',
        location: '456 Oak Ave, Westside',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        severity: 'high',
        aiScore: 82,
        reportedAt: new Date(Date.now() - 12 * 60000).toISOString(),
        status: 'pending',
        description: 'Severe bleeding from accident',
        contactNumber: '+1-555-0102',
        recommendedHospital: 'Memorial Hospital',
        estimatedResponseTime: 12,
      },
      {
        id: 'EMG003',
        patientName: 'Mike Johnson',
        location: '789 Pine Rd, Eastside',
        coordinates: { lat: 40.7489, lng: -73.9680 },
        severity: 'medium',
        aiScore: 65,
        reportedAt: new Date(Date.now() - 20 * 60000).toISOString(),
        status: 'assigned',
        description: 'Broken leg, stable condition',
        contactNumber: '+1-555-0103',
        recommendedHospital: 'St. Mary Medical Center',
        estimatedResponseTime: 15,
      },
    ];

    const mockAmbulances: AmbulanceUnit[] = [
      {
        id: 'AMB001',
        vehicleNumber: 'A-101',
        status: 'available',
        location: 'Station 1, Downtown',
        coordinates: { lat: 40.7180, lng: -74.0020 },
        driverName: 'Robert Wilson',
        driverPhone: '+1-555-1001',
        distanceKm: 2.3,
        eta: 6,
      },
      {
        id: 'AMB002',
        vehicleNumber: 'A-102',
        status: 'available',
        location: 'Station 2, Midtown',
        coordinates: { lat: 40.7589, lng: -73.9851 },
        driverName: 'Sarah Davis',
        driverPhone: '+1-555-1002',
        distanceKm: 4.1,
        eta: 10,
      },
      {
        id: 'AMB003',
        vehicleNumber: 'A-103',
        status: 'busy',
        location: 'En route to Memorial Hospital',
        coordinates: { lat: 40.7489, lng: -73.9680 },
        driverName: 'Michael Brown',
        driverPhone: '+1-555-1003',
      },
    ];

    const mockHistory: DispatchHistory[] = [
      {
        id: 'DISP001',
        emergencyId: 'EMG100',
        ambulanceId: 'AMB001',
        dispatchedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        completedAt: new Date(Date.now() - 1.5 * 3600000).toISOString(),
        responseTimeMinutes: 18,
        outcome: 'success',
      },
      {
        id: 'DISP002',
        emergencyId: 'EMG101',
        ambulanceId: 'AMB002',
        dispatchedAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        completedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
        responseTimeMinutes: 22,
        outcome: 'success',
      },
    ];

    setEmergencies(mockEmergencies);
    setAmbulances(mockAmbulances);
    setHistory(mockHistory);
  }, []);

  const getTimeSince = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 60000);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  const getSeverityColor = (severity: Emergency['severity']) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  const handleAssignAmbulance = () => {
    if (!selectedEmergency || !selectedAmbulance) return;
    
    // Update emergency status
    setEmergencies(prev =>
      prev.map(e =>
        e.id === selectedEmergency.id ? { ...e, status: 'assigned' } : e
      )
    );
    
    // Update ambulance status
    setAmbulances(prev =>
      prev.map(a =>
        a.id === selectedAmbulance.id ? { ...a, status: 'busy' } : a
      )
    );

    alert(`Ambulance ${selectedAmbulance.vehicleNumber} assigned to ${selectedEmergency.patientName}`);
    setSelectedAmbulance(null);
  };

  const handleSendMessage = (recipient: 'caller' | 'driver' | 'hospital') => {
    if (!message.trim()) return;
    alert(`Message sent to ${recipient}: ${message}`);
    setMessage('');
  };

  const avgResponseTime = history.length > 0
    ? Math.round(
        history.reduce((sum, h) => sum + (h.responseTimeMinutes || 0), 0) / history.length
      )
    : 0;

  const successRate = history.length > 0
    ? Math.round((history.filter(h => h.outcome === 'success').length / history.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">
              Dispatch Control Center
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Emergency Response Management</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('list')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'list'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'map'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Map View
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-4 gap-3">
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm font-medium">Pending</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-red-900">
              {emergencies.filter(e => e.status === 'pending').length}
            </p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2 text-blue-700">
              <Ambulance size={18} />
              <span className="text-sm font-medium">Available Units</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-blue-900">
              {ambulances.filter(a => a.status === 'available').length}
            </p>
          </div>
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-700">
              <Timer size={18} />
              <span className="text-sm font-medium">Avg Response</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-green-900">{avgResponseTime}m</p>
          </div>
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-center gap-2 text-purple-700">
              <TrendingUp size={18} />
              <span className="text-sm font-medium">Success Rate</span>
            </div>
            <p className="mt-2 text-3xl font-bold text-purple-900">{successRate}%</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Emergency List */}
        <section className="lg:col-span-1">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <AlertCircle size={20} className="text-red-600" />
              Active Emergencies
            </h2>
            <div className="mt-4 space-y-3 max-h-[600px] overflow-y-auto">
              {emergencies.map(emergency => (
                <button
                  key={emergency.id}
                  onClick={() => setSelectedEmergency(emergency)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    selectedEmergency?.id === emergency.id
                      ? 'border-cyan-500 bg-cyan-50 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{emergency.patientName}</span>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getSeverityColor(
                            emergency.severity
                          )}`}
                        >
                          {emergency.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-600">{emergency.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock size={12} />
                        {getTimeSince(emergency.reportedAt)}
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs font-medium text-cyan-600">
                        <Activity size={12} />
                        AI: {emergency.aiScore}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-600">
                    <MapPin size={12} />
                    {emergency.location}
                  </div>
                  <p className="mt-2 text-xs text-slate-700">{emergency.description}</p>
                  <div className="mt-2">
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        emergency.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : emergency.status === 'assigned'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {emergency.status.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Details & Assignment */}
        <section className="lg:col-span-2">
          {selectedEmergency ? (
            <div className="space-y-4">
              {/* Emergency Details Panel */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Emergency Details</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Patient</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{selectedEmergency.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Emergency ID</p>
                    <p className="mt-1 text-lg font-semibold text-slate-900">{selectedEmergency.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Severity</p>
                    <span
                      className={`mt-1 inline-block rounded-full border px-3 py-1 text-sm font-medium ${getSeverityColor(
                        selectedEmergency.severity
                      )}`}
                    >
                      {selectedEmergency.severity.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">AI Triage Score</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-2 w-full rounded-full bg-slate-200">
                        <div
                          className={`h-2 rounded-full ${
                            selectedEmergency.aiScore >= 80
                              ? 'bg-red-600'
                              : selectedEmergency.aiScore >= 60
                              ? 'bg-orange-500'
                              : 'bg-yellow-500'
                          }`}
                          style={{ width: `${selectedEmergency.aiScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{selectedEmergency.aiScore}</span>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-slate-500">Location</p>
                    <p className="mt-1 flex items-center gap-2 text-slate-900">
                      <MapPin size={16} className="text-cyan-600" />
                      {selectedEmergency.location}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-slate-500">Description</p>
                    <p className="mt-1 text-slate-900">{selectedEmergency.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Contact Number</p>
                    <p className="mt-1 flex items-center gap-2 text-slate-900">
                      <Phone size={16} className="text-cyan-600" />
                      {selectedEmergency.contactNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500">Reported</p>
                    <p className="mt-1 flex items-center gap-2 text-slate-900">
                      <Clock size={16} className="text-cyan-600" />
                      {getTimeSince(selectedEmergency.reportedAt)}
                    </p>
                  </div>
                  {selectedEmergency.recommendedHospital && (
                    <div>
                      <p className="text-sm font-medium text-slate-500">Recommended Hospital</p>
                      <p className="mt-1 flex items-center gap-2 text-slate-900">
                        <Hospital size={16} className="text-cyan-600" />
                        {selectedEmergency.recommendedHospital}
                      </p>
                    </div>
                  )}
                  {selectedEmergency.estimatedResponseTime && (
                    <div>
                      <p className="text-sm font-medium text-slate-500">Est. Response Time</p>
                      <p className="mt-1 flex items-center gap-2 text-slate-900">
                        <Timer size={16} className="text-cyan-600" />
                        {selectedEmergency.estimatedResponseTime} minutes
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Available Ambulances */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <Ambulance size={20} className="text-blue-600" />
                  Available Ambulances
                </h2>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {ambulances
                    .filter(a => a.status === 'available')
                    .map(ambulance => (
                      <button
                        key={ambulance.id}
                        onClick={() => setSelectedAmbulance(ambulance)}
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          selectedAmbulance?.id === ambulance.id
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900">{ambulance.vehicleNumber}</p>
                            <p className="mt-1 text-sm text-slate-600">{ambulance.driverName}</p>
                          </div>
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            AVAILABLE
                          </span>
                        </div>
                        <div className="mt-3 space-y-1 text-xs text-slate-600">
                          <p className="flex items-center gap-1">
                            <MapPin size={12} />
                            {ambulance.location}
                          </p>
                          <p className="flex items-center gap-1">
                            <Phone size={12} />
                            {ambulance.driverPhone}
                          </p>
                          {ambulance.distanceKm && (
                            <p className="flex items-center gap-1">
                              <Navigation size={12} />
                              {ambulance.distanceKm} km away • ETA {ambulance.eta}m
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                </div>

                {selectedAmbulance && (
                  <button
                    onClick={handleAssignAmbulance}
                    className="mt-4 w-full rounded-xl bg-cyan-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-cyan-700"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Send size={18} />
                      Assign {selectedAmbulance.vehicleNumber} to Emergency
                    </span>
                  </button>
                )}
              </div>

              {/* Communication Tools */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <MessageSquare size={20} className="text-purple-600" />
                  Communication
                </h2>
                <div className="mt-4">
                  <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    rows={3}
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleSendMessage('caller')}
                      className="flex-1 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Phone size={16} />
                        Contact Caller
                      </span>
                    </button>
                    <button
                      onClick={() => handleSendMessage('driver')}
                      className="flex-1 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Ambulance size={16} />
                        Message Driver
                      </span>
                    </button>
                    <button
                      onClick={() => handleSendMessage('hospital')}
                      className="flex-1 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Bell size={16} />
                        Notify Hospital
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Nearby Locations */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
                  <MapPin size={20} className="text-cyan-600" />
                  Nearby Locations
                </h2>
                <p className="mt-2 text-sm text-slate-600">
                  Critical facilities near the emergency location
                </p>
                <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto">
                  {nearbyLocations.map(location => (
                    <div
                      key={location.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 hover:border-cyan-300 hover:bg-cyan-50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {location.type === 'hospital' && (
                              <Hospital size={16} className="text-green-600" />
                            )}
                            {location.type === 'police_station' && (
                              <Activity size={16} className="text-blue-600" />
                            )}
                            {location.type === 'fire_station' && (
                              <AlertCircle size={16} className="text-red-600" />
                            )}
                            {location.type === 'pharmacy' && (
                              <Activity size={16} className="text-purple-600" />
                            )}
                            <span className="font-semibold text-slate-900">{location.name}</span>
                          </div>
                          <p className="mt-1 text-xs text-slate-600">{location.address}</p>
                          <div className="mt-2 flex items-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-slate-600">
                              <Navigation size={12} />
                              {location.distance} km
                            </span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Clock size={12} />
                              {location.eta} min
                            </span>
                            {location.available !== undefined && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  location.available
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {location.available ? 'Available' : 'Full'}
                              </span>
                            )}
                          </div>
                        </div>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="ml-2 rounded-lg border border-cyan-200 bg-white px-3 py-2 text-xs font-medium text-cyan-700 hover:bg-cyan-50"
                        >
                          Navigate
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
              <div className="text-center">
                <AlertCircle size={48} className="mx-auto text-slate-300" />
                <p className="mt-4 text-lg font-medium text-slate-500">Select an emergency to view details</p>
                <p className="mt-2 text-sm text-slate-400">
                  Choose from the active emergencies list to see patient information and assign ambulances
                </p>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* History & Analytics */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-slate-900">
          <Activity size={20} className="text-cyan-600" />
          Recent Dispatch History
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-sm font-medium text-slate-600">
                <th className="pb-3">Dispatch ID</th>
                <th className="pb-3">Emergency</th>
                <th className="pb-3">Ambulance</th>
                <th className="pb-3">Dispatched</th>
                <th className="pb-3">Completed</th>
                <th className="pb-3">Response Time</th>
                <th className="pb-3">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {history.map(record => (
                <tr key={record.id} className="border-b border-slate-100 text-sm">
                  <td className="py-3 font-medium text-slate-900">{record.id}</td>
                  <td className="py-3 text-slate-600">{record.emergencyId}</td>
                  <td className="py-3 text-slate-600">{record.ambulanceId}</td>
                  <td className="py-3 text-slate-600">
                    {new Date(record.dispatchedAt).toLocaleTimeString()}
                  </td>
                  <td className="py-3 text-slate-600">
                    {record.completedAt ? new Date(record.completedAt).toLocaleTimeString() : '-'}
                  </td>
                  <td className="py-3 text-slate-600">{record.responseTimeMinutes || '-'} min</td>
                  <td className="py-3">
                    {record.outcome === 'success' ? (
                      <span className="flex items-center gap-1 text-green-700">
                        <CheckCircle size={16} />
                        Success
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-700">
                        <XCircle size={16} />
                        {record.outcome}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Live Map View */}
      {activeTab === 'map' && (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900">
            <MapPin size={20} className="text-cyan-600" />
            Live Emergency Map
          </h2>
          <div className="h-[600px] rounded-2xl overflow-hidden">
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
              <Map
                defaultCenter={{ lat: 40.7128, lng: -74.006 }}
                defaultZoom={12}
                mapId="emergency-dispatch-map"
                gestureHandling="greedy"
                disableDefaultUI={false}
              >
                {/* Emergency Markers */}
                {emergencies.map(emergency => (
                  <Marker
                    key={emergency.id}
                    position={emergency.coordinates}
                    title={`${emergency.patientName} - ${emergency.severity.toUpperCase()}`}
                    onClick={() => setSelectedEmergency(emergency)}
                  />
                ))}

                {/* Ambulance Markers */}
                {ambulances.map(ambulance => (
                  <Marker
                    key={ambulance.id}
                    position={ambulance.coordinates}
                    title={`${ambulance.vehicleNumber} - ${ambulance.status.toUpperCase()}`}
                  />
                ))}

                {/* Info Window for Selected Emergency */}
                {selectedEmergency && (
                  <InfoWindow
                    position={selectedEmergency.coordinates}
                    onCloseClick={() => setSelectedEmergency(null)}
                  >
                    <div className="p-2 max-w-xs">
                      <h3 className="font-semibold text-slate-900">{selectedEmergency.patientName}</h3>
                      <p className="text-xs text-slate-600 mt-1">{selectedEmergency.id}</p>
                      <p className="text-sm text-slate-700 mt-2">{selectedEmergency.description}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            selectedEmergency.severity === 'critical'
                              ? 'bg-red-100 text-red-700'
                              : selectedEmergency.severity === 'high'
                              ? 'bg-orange-100 text-orange-700'
                              : selectedEmergency.severity === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {selectedEmergency.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-600">AI: {selectedEmergency.aiScore}</span>
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Map>
            </APIProvider>
          </div>
          
          {/* Map Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <span className="text-slate-600">Critical Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500"></div>
              <span className="text-slate-600">High Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-slate-600">Medium Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-slate-600">Low Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-slate-600">Available Ambulance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-slate-400"></div>
              <span className="text-slate-600">Busy Ambulance</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
