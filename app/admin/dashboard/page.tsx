'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  FileSpreadsheet,
  FileText,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';

interface Submission {
  id: string;
  studentIdCode: string;
  studentName: string;
  course: string;
  schedule: string;
  gender: string;
  projectName: string;
  projectUrl: string;
  portfolioUrl: string;
  status: string;
  teacher: {
    user: { name: string; email: string };
  };
  academicRecord?: {
    participation: number;
    attendance: number;
    quizzes: number;
    assignments: number;
  } | null;
  evaluation?: {
    synopsisScore: number;
    uiUxScore: number;
    innovationScore: number;
    reportingScore: number;
    outcomesScore: number;
    groupScore: number;
    presentationScore: number;
    totalScore: number;
    feedback?: string;
  } | null;
  createdAt: string;
}

export default function MasterAdminDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [teachersCount, setTeachersCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/submissions');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load master admin data.');
      setSubmissions(data.submissions || []);

      const teachersRes = await fetch('/api/teachers');
      const teachersData = await teachersRes.json();
      setTeachersCount(teachersData.teachers?.length || 0);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error loading admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const res = await fetch('/api/export/excel');
      if (!res.ok) throw new Error('Failed to generate Excel file.');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WLS_Academy_Master_Marksheet_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch {
      alert('Error exporting Excel sheet.');
    } finally {
      setDownloadingExcel(false);
    }
  };

  const filteredSubmissions = submissions.filter(
    (s) =>
      s.studentName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentIdCode.toLowerCase().includes(search.toLowerCase()) ||
      s.projectName.toLowerCase().includes(search.toLowerCase()) ||
      s.teacher.user.name.toLowerCase().includes(search.toLowerCase())
  );

  const evaluatedSubmissions = submissions.filter((s) => s.evaluation);
  const averageAcademyScore =
    evaluatedSubmissions.length > 0
      ? (
          evaluatedSubmissions.reduce((acc, curr) => acc + (curr.evaluation?.totalScore || 0), 0) /
          evaluatedSubmissions.length
        ).toFixed(1)
      : '0.0';

  return (
    <div className="space-y-8 py-4">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-purple-400">Master Admin Oversight Dashboard</h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-purple-950 border border-purple-800 text-purple-300">
              System Admin
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Wessam Learning System (WLS) - Complete academy oversight for 500+ active students.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh System Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs cursor-pointer shadow-lg shadow-emerald-600/20 transition-all"
          >
            {downloadingExcel ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4" />
            )}
            Download Master Academy Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Institutional Analytics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="wls-card p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Submissions
            </span>
            <span className="text-3xl font-extrabold text-white mt-1 block">{submissions.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="wls-card p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Registered Faculty
            </span>
            <span className="text-3xl font-extrabold text-blue-400 mt-1 block">{teachersCount}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="wls-card p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Evaluated Projects
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">
              {evaluatedSubmissions.length}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="wls-card p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Academy Avg Score
            </span>
            <span className="text-3xl font-extrabold text-indigo-400 mt-1 block">
              {averageAcademyScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="wls-card p-4 border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student, ID, instructor, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="wls-input w-full pl-9 text-xs"
          />
        </div>
      </div>

      {/* Master Academy Table */}
      {loading ? (
        <div className="wls-card p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span>Loading institutional database records...</span>
        </div>
      ) : error ? (
        <div className="wls-card p-8 text-center text-red-400 bg-red-950/40 border border-red-800">
          {error}
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="wls-card p-12 text-center text-slate-400">
          No records match your search criteria.
        </div>
      ) : (
        <div className="wls-card border border-slate-800 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Student ID & Name</th>
                <th className="py-3.5 px-4">Assigned Instructor</th>
                <th className="py-3.5 px-4">Course & Schedule</th>
                <th className="py-3.5 px-4">Project & Portfolio Links</th>
                <th className="py-3.5 px-4">Metrics (Part/Att/Quiz/Assign)</th>
                <th className="py-3.5 px-4">Rubric Score</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSubmissions.map((sub) => {
                const ar = sub.academicRecord;
                const ev = sub.evaluation;

                return (
                  <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white text-sm">{sub.studentName}</div>
                      <div className="text-purple-400 font-mono text-[11px] font-semibold">
                        {sub.studentIdCode}
                      </div>
                      <div className="text-slate-500 text-[10px]">{sub.gender}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-blue-300">{sub.teacher.user.name}</div>
                      <div className="text-slate-400 text-[10px]">{sub.teacher.user.email}</div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-slate-200 font-medium">{sub.course}</div>
                      <div className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px]">
                        {sub.schedule}
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-xs">
                      <div className="font-semibold text-slate-100 truncate" title={sub.projectName}>
                        {sub.projectName}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={sub.projectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-0.5 text-[10px]"
                        >
                          Project <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-slate-600">|</span>
                        <a
                          href={sub.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:underline flex items-center gap-0.5 text-[10px]"
                        >
                          Portfolio <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-0.5 text-[11px]">
                        <div><span className="text-slate-400">Participation:</span> <span className="text-white font-semibold">{ar?.participation ?? 0}/10</span></div>
                        <div><span className="text-slate-400">Attendance:</span> <span className="text-white font-semibold">{ar?.attendance ?? 0}/10</span></div>
                        <div><span className="text-slate-400">Quizzes:</span> <span className="text-white font-semibold">{ar?.quizzes ?? 0}/20</span></div>
                        <div><span className="text-slate-400">Assignments:</span> <span className="text-white font-semibold">{ar?.assignments ?? 0}/20</span></div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {ev ? (
                        <div>
                          <span className="text-base font-extrabold text-emerald-400">
                            {ev.totalScore} <span className="text-xs text-slate-400">/ 100</span>
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Not evaluated</span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {sub.status === 'EVALUATED' ? (
                        <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-bold flex items-center gap-1 w-fit">
                          <CheckCircle className="w-3 h-3" /> EVALUATED
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-700 text-amber-300 text-[10px] font-bold flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
