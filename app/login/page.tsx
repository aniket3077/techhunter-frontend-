'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hospital, Lock, Mail, User } from 'lucide-react';

type UserRole = 'admin' | 'doctor' | 'staff';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('staff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // Simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user data (replace with actual auth)
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);

      // Redirect based on role
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-600 text-white mb-4">
            <Hospital size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">PulseRescue AI</h1>
          <p className="text-slate-600 mt-2">Hospital Management System</p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Sign In</h2>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Login As
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    role === 'admin'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <User size={16} className="mx-auto mb-1" />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('doctor')}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    role === 'doctor'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <User size={16} className="mx-auto mb-1" />
                  Doctor
                </button>
                <button
                  type="button"
                  onClick={() => setRole('staff')}
                  className={`rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    role === 'staff'
                      ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <User size={16} className="mx-auto mb-1" />
                  Staff
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  placeholder="you@hospital.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-3 text-sm focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded border-slate-300" />
                Remember me
              </label>
              <button type="button" className="text-cyan-600 hover:text-cyan-700 font-medium">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white transition-colors hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-slate-600">
            New hospital?{' '}
            <button
              onClick={() => router.push('/register-hospital')}
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Register here
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white/60 p-4 text-xs text-slate-600">
          <p className="font-semibold mb-2">Demo Credentials:</p>
          <p>Admin: admin@hospital.com / admin123</p>
          <p>Doctor: doctor@hospital.com / doctor123</p>
          <p>Staff: staff@hospital.com / staff123</p>
        </div>
      </div>
    </div>
  );
}
