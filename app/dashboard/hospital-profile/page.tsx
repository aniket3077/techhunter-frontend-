'use client';

import { useState, useEffect } from 'react';
import {
  Hospital,
  MapPin,
  Phone,
  Mail,
  Globe,
  Edit2,
  Save,
  X,
  Building2,
  Users,
  Bed,
  Activity,
} from 'lucide-react';

type HospitalProfile = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  email: string;
  website: string;
  specializations: string[];
  departments: string[];
  totalBeds: number;
  icuBeds: number;
  emergencyBeds: number;
  totalDoctors: number;
  establishedYear: number;
  licenseNumber: string;
  accreditation: string;
};

export default function HospitalProfilePage() {
  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockProfile: HospitalProfile = {
      id: 'HOSP001',
      name: 'Government Medical College & Hospital',
      address: 'Panchakki Road',
      city: 'Chhatrapati Sambhajinagar',
      state: 'Maharashtra',
      zipCode: '431001',
      coordinates: { lat: 19.8762, lng: 75.3433 },
      phone: '+91-240-2323333',
      email: 'contact@gmcaurangabad.edu.in',
      website: 'https://gmcaurangabad.edu.in',
      specializations: ['Cardiology', 'Neurology', 'Emergency Medicine', 'Trauma Care', 'ICU'],
      departments: ['Emergency', 'ICU', 'Surgery', 'Radiology', 'Laboratory'],
      totalBeds: 250,
      icuBeds: 40,
      emergencyBeds: 30,
      totalDoctors: 85,
      establishedYear: 1985,
      licenseNumber: 'MED-MH-2024-001',
      accreditation: 'NABH Accredited',
    };

    setTimeout(() => {
      setProfile(mockProfile);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading hospital profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="rounded-3xl border border-slate-200/60 bg-white/60 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-600">
              Hospital Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Hospital Profile</h1>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
              >
                <Edit2 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-3">
              <Bed size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Beds</p>
              <p className="text-2xl font-bold text-slate-900">{profile.totalBeds}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-3">
              <Activity size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">ICU Beds</p>
              <p className="text-2xl font-bold text-slate-900">{profile.icuBeds}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-orange-100 p-3">
              <Hospital size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Emergency Beds</p>
              <p className="text-2xl font-bold text-slate-900">{profile.emergencyBeds}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-3">
              <Users size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Doctors</p>
              <p className="text-2xl font-bold text-slate-900">{profile.totalDoctors}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hospital Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-900">
                    <Building2 size={18} className="text-cyan-600" />
                    <span className="font-medium">{profile.name}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-900">
                      <Phone size={16} className="text-cyan-600" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-slate-900">
                      <Mail size={16} className="text-cyan-600" />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={profile.website}
                    onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-900">
                    <Globe size={16} className="text-cyan-600" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-600 hover:underline"
                    >
                      {profile.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Street Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-slate-900">
                    <MapPin size={16} className="text-cyan-600" />
                    <span>{profile.address}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  ) : (
                    <p className="text-slate-900">{profile.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  ) : (
                    <p className="text-slate-900">{profile.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.zipCode}
                      onChange={(e) => setProfile({ ...profile, zipCode: e.target.value })}
                      className="w-full rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                    />
                  ) : (
                    <p className="text-slate-900">{profile.zipCode}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Latitude</label>
                  <p className="text-slate-900">{profile.coordinates.lat}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Longitude</label>
                  <p className="text-slate-900">{profile.coordinates.lng}</p>
                </div>
              </div>

              <a
                href={`https://www.google.com/maps?q=${profile.coordinates.lat},${profile.coordinates.lng}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-100"
              >
                <MapPin size={16} />
                View on Google Maps
              </a>
            </div>
          </section>

          {/* Specializations */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Specializations</h2>
            <div className="flex flex-wrap gap-2">
              {profile.specializations.map((spec) => (
                <span
                  key={spec}
                  className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700"
                >
                  {spec}
                </span>
              ))}
            </div>
          </section>

          {/* Departments */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Departments</h2>
            <div className="grid grid-cols-2 gap-3">
              {profile.departments.map((dept) => (
                <div
                  key={dept}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {dept}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Accreditation */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Accreditation</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">License Number</p>
                <p className="mt-1 font-medium text-slate-900">{profile.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Accreditation</p>
                <p className="mt-1 font-medium text-slate-900">{profile.accreditation}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Established</p>
                <p className="mt-1 font-medium text-slate-900">{profile.establishedYear}</p>
              </div>
            </div>
          </section>

          {/* Status */}
          <section className="rounded-3xl border border-green-200 bg-green-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-green-900 mb-2">Hospital Status</h2>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">Active & Operational</span>
            </div>
            <p className="mt-3 text-sm text-green-700">
              Connected to PulseRescue AI Emergency Network
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
