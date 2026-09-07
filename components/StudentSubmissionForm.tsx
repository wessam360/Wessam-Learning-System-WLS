'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send, CheckCircle2, AlertCircle, Loader2, User, BookOpen, Calendar, Link2, FolderGit2, Sparkles } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  department?: string;
  designation?: string;
}

export function StudentSubmissionForm() {
  const router = useRouter();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    studentCourse: 'AI & Full-Stack Next.js Engineering',
    daySchedule: 'Mon-Tue',
    studentName: '',
    studentIdCode: '',
    gender: 'Male',
    finalProjectName: '',
    projectUrl: '',
    portfolioUrl: '',
    teacherId: '',
  });

  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await fetch('/api/teachers');
        const data = await res.json();
        if (data.teachers && data.teachers.length > 0) {
          setTeachers(data.teachers);
          setFormData((prev) => ({ ...prev, teacherId: data.teachers[0].id }));
        }
      } catch (err) {
        console.error('Failed to load teachers:', err);
      } finally {
        setLoadingTeachers(false);
      }
    }
    loadTeachers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Submission failed. Please check inputs.');
      }

      setSuccess('🎉 Final project submission successfully recorded! Your assigned teacher will review and evaluate your work.');
      setFormData({
        studentCourse: 'AI & Full-Stack Next.js Engineering',
        daySchedule: 'Mon-Tue',
        studentName: '',
        studentIdCode: '',
        gender: 'Male',
        finalProjectName: '',
        projectUrl: '',
        portfolioUrl: '',
        teacherId: teachers[0]?.id || '',
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="wls-card max-w-3xl mx-auto p-6 sm:p-10 border border-slate-800 bg-slate-950/80 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-blue-400">Final Project & Portfolio Submission</h2>
          <p className="text-xs text-slate-400">Wessam Learning System (WLS) Student Assessment Portal</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>{error}</div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-start gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>{success}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Student Course */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Student Course *
            </label>
            <select
              name="studentCourse"
              value={formData.studentCourse}
              onChange={handleChange}
              className="wls-input w-full"
              required
            >
              <option value="AI & Full-Stack Next.js Engineering">Web Development</option>
              <option value="Advanced Machine Learning & AI Specialization">Graphic Design</option>
              <option value="Cloud Architecture & DevOps Systems">Digital Marketing</option>
              <option value="Frontend Web Architecture">Video Editing</option>
            </select>
          </div>

          {/* Day Schedule */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Day Schedule *
            </label>
            <select
              name="daySchedule"
              value={formData.daySchedule}
              onChange={handleChange}
              className="wls-input w-full"
              required
            >
              <option value="Mon-Tue">Mon-Tue</option>
              <option value="Wed-Thu">Wed-Thu</option>
              <option value="Sat-Sun">Sat-Sun</option>
            </select>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Student Name *
            </label>
            <input
              type="text"
              name="studentName"
              placeholder="e.g. Muhammad Hamza"
              value={formData.studentName}
              onChange={handleChange}
              className="wls-input w-full"
              required
            />
          </div>

          {/* Student ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Student ID *
            </label>
            <input
              type="text"
              name="studentIdCode"
              placeholder="e.g. WLS-2026-042"
              value={formData.studentIdCode}
              onChange={handleChange}
              className="wls-input w-full"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="wls-input w-full"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Dynamic Teacher Assignment Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
              Assigned Teacher / Instructor *
            </label>
            {loadingTeachers ? (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> Loading instructor dropdown...
              </div>
            ) : teachers.length === 0 ? (
              <div className="text-xs text-amber-400 py-2">No registered teachers found in database.</div>
            ) : (
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                className="wls-input w-full border-blue-500/50 bg-blue-950/20 text-white font-medium"
                required
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department || 'Instructor'})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Final Project Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Final Project Name *
          </label>
          <input
            type="text"
            name="finalProjectName"
            placeholder="e.g. Autonomous AI Code Reviewer & Analyzer"
            value={formData.finalProjectName}
            onChange={handleChange}
            className="wls-input w-full"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Link of Final Project */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Link of Final Project (GitHub / Live) *
            </label>
            <input
              type="url"
              name="projectUrl"
              placeholder="https://github.com/username/project"
              value={formData.projectUrl}
              onChange={handleChange}
              className="wls-input w-full"
              required
            />
          </div>

          {/* Link of Portfolio */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Link of Portfolio *
            </label>
            <input
              type="url"
              name="portfolioUrl"
              placeholder="https://my-portfolio.dev"
              value={formData.portfolioUrl}
              onChange={handleChange}
              className="wls-input w-full"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="wls-btn-primary w-full py-3 text-base flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/25"
        >
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Submitting Record...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" /> Submit Project for Evaluation
            </>
          )}
        </button>
      </form>
    </div>
  );
}
