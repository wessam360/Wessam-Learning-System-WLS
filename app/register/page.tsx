'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, KeyRound, User, Building, Award, AlertCircle, Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'AI & Full-Stack Engineering',
    designation: 'Instructor',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      router.push('/teacher/dashboard');
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <div className="wls-card p-8 bg-slate-950 border border-slate-800 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-blue-400">Teacher Registration</h1>
          <p className="text-xs text-slate-400 mt-1">Join Wessam Learning System (WLS) Faculty</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="text"
                name="name"
                placeholder="Prof. Wessam Aftab"
                value={formData.name}
                onChange={handleChange}
                className="wls-input w-full pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Institutional Email *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                name="email"
                placeholder="wessam.educator@wls.edu"
                value={formData.email}
                onChange={handleChange}
                className="wls-input w-full pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password *
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="wls-input w-full pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Department
              </label>
              <input
                type="text"
                name="department"
                placeholder="AI & CS"
                value={formData.department}
                onChange={handleChange}
                className="wls-input w-full text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                placeholder="Senior Instructor"
                value={formData.designation}
                onChange={handleChange}
                className="wls-input w-full text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="wls-btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Register Teacher Profile
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">Already registered? </span>
          <Link href="/login" className="text-xs font-semibold text-blue-400 hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
