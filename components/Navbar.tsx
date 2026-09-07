'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { GraduationCap, LogOut, ShieldCheck, UserCheck, Send, Home, LogIn, Menu, X } from 'lucide-react';

interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
}

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight text-white group-hover:text-blue-400 transition-colors">
              Wessam Learning System
            </span>
            <span className="text-[10px] font-semibold text-blue-400 tracking-widest uppercase -mt-1">
              WLS Academy Platform
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname === '/' ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Home className="w-4 h-4" /> Home
          </Link>

          <Link
            href="/submit"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname === '/submit' ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Send className="w-4 h-4" /> Student Portal
          </Link>

          <Link
            href="/teacher/dashboard"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname.startsWith('/teacher') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Teacher Portal
          </Link>

          <Link
            href="/admin/dashboard"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              pathname.startsWith('/admin') ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Master Admin
          </Link>
        </nav>

        {/* User Status & Theme Toggle (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end text-xs">
                <span className="font-semibold text-white">{user.name}</span>
                <span className="text-blue-400 font-bold px-1.5 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-[10px]">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" /> Log Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-500/20"
            >
              <LogIn className="w-4 h-4" /> Faculty Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-4 shadow-2xl">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/' ? 'bg-blue-950/80 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Home className="w-4 h-4" /> Home
            </Link>

            <Link
              href="/submit"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/submit' ? 'bg-blue-950/80 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Send className="w-4 h-4" /> Student Portal
            </Link>

            <Link
              href="/teacher/dashboard"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith('/teacher') ? 'bg-blue-950/80 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Teacher Portal
            </Link>

            <Link
              href="/admin/dashboard"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname.startsWith('/admin') ? 'bg-blue-950/80 text-blue-400 font-semibold' : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" /> Master Admin
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            {user ? (
              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-white">{user.name}</span>
                  <span className="text-blue-400 text-[10px]">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-950/80 border border-red-800 text-red-300"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-md"
              >
                <LogIn className="w-4 h-4" /> Faculty Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
