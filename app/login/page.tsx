'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn, KeyRound, Mail, AlertCircle, Loader2, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed. Please check credentials.');
      }

      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/teacher/dashboard');
      }
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

  const fillSampleTeacherCredentials = () => {
    setEmail('wessam.educator@wls.edu');
    setPassword('TeacherPass123!');
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="wls-card p-8 bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-blue-400">Portal Sign In</h1>
          <p className="text-xs text-slate-400 mt-1">Wessam Learning System (WLS)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                placeholder="name@wls.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="wls-input w-full pl-9 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="wls-input w-full pl-9 text-sm"
                required
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
                <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Secure Sign In
              </>
            )}
          </button>
        </form>

        {/* Demo Credentials Auto-Fill */}
        <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
          <button
            type="button"
            onClick={fillSampleTeacherCredentials}
            className="w-full p-2.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-800 text-blue-300 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
          >
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-400" /> Sample Faculty Demo Login
            </span>
            <span className="text-[10px] text-blue-400 font-mono">wessam.educator@wls.edu</span>
          </button>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-400">New Instructor? </span>
            <Link href="/register" className="text-xs font-semibold text-blue-400 hover:underline">
              Register Teacher Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
