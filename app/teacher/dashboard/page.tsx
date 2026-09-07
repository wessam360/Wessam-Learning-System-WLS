'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TeacherInlineMetrics } from '@/components/TeacherInlineMetrics';
import { TeacherGradingModal } from '@/components/TeacherGradingModal';
import {
  FileSpreadsheet,
  Award,
  FileText,
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Clock,
  UserCheck,
} from 'lucide-react';

interface AcademicRecord {
  id?: string;
  participation: number;
  attendance: number;
  quizzes: number;
  assignments: number;
}

interface Evaluation {
  id?: string;
  synopsisScore: number;
  uiUxScore: number;
  innovationScore: number;
  reportingScore: number;
  outcomesScore: number;
  groupScore: number;
  presentationScore: number;
  totalScore: number;
  feedback?: string;
}

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
  academicRecord?: AcademicRecord | null;
  evaluation?: Evaluation | null;
  createdAt: string;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [downloadingDocxId, setDownloadingDocxId] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/teacher/submissions');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load assigned submissions.');
      setSubmissions(data.submissions || []);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Error fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
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
      a.download = `WLS_Consolidated_Results_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error exporting Excel sheet.');
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleDownloadDocx = async (id: string, code: string) => {
    setDownloadingDocxId(id);
    try {
      const res = await fetch(`/api/export/docx/${id}`);
      if (!res.ok) {
        alert('This project has not been evaluated yet.');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WLS_Evaluation_${code}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Error downloading Word report.');
    } finally {
      setDownloadingDocxId(null);
    }
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.studentName.toLowerCase().includes(search.toLowerCase()) ||
      sub.studentIdCode.toLowerCase().includes(search.toLowerCase()) ||
      sub.projectName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const evaluatedCount = submissions.filter((s) => s.status === 'EVALUATED').length;
  const pendingCount = submissions.length - evaluatedCount;

  return (
    <div className="space-y-8 py-4">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-blue-400">Teacher Evaluation Portal</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-950 border border-blue-700 text-blue-300">
              Isolated Assigned View
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Wessam Learning System (WLS) - Inline student monitoring, academic rubric evaluations, and instant document exports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubmissions}
            className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Refresh Data"
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
            Download Consolidated Excel Sheet (.xlsx)
          </button>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="wls-card p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Assigned Students
            </span>
            <span className="text-3xl font-extrabold text-white mt-1 block">{submissions.length}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="wls-card p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Evaluated Projects
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">{evaluatedCount}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="wls-card p-5 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Pending Evaluation
            </span>
            <span className="text-3xl font-extrabold text-amber-400 mt-1 block">{pendingCount}</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="wls-card p-4 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search student name, ID, or project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="wls-input w-full pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="wls-input text-xs"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Only</option>
            <option value="EVALUATED">Evaluated Only</option>
          </select>
        </div>
      </div>

      {/* Main Submissions & Grading Table */}
      {loading ? (
        <div className="wls-card p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span>Loading assigned academy student records...</span>
        </div>
      ) : error ? (
        <div className="wls-card p-8 text-center text-red-400 bg-red-950/40 border border-red-800">
          {error}
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="wls-card p-12 text-center text-slate-400">
          No student submissions found for the current search or status filter.
        </div>
      ) : (
        <div className="wls-card border border-slate-800 overflow-x-auto shadow-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Student Info</th>
                <th className="py-3.5 px-4">Course & Schedule</th>
                <th className="py-3.5 px-4">Final Project & Links</th>
                <th className="py-3.5 px-4">Inline Metrics (Part / Att / Quiz / Assign)</th>
                <th className="py-3.5 px-4">Rubric Score</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-900/50 transition-colors">
                  {/* Student Info */}
                  <td className="py-4 px-4">
                    <div className="font-bold text-white text-sm">{sub.studentName}</div>
                    <div className="text-blue-400 font-mono text-[11px] font-semibold">{sub.studentIdCode}</div>
                    <div className="text-slate-400 text-[10px]">{sub.gender}</div>
                  </td>

                  {/* Course & Schedule */}
                  <td className="py-4 px-4">
                    <div className="text-slate-200 font-medium">{sub.course}</div>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px]">
                      {sub.schedule}
                    </div>
                  </td>

                  {/* Project & Links */}
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
                        Project Link <ExternalLink className="w-3 h-3" />
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

                  {/* Inline Metrics */}
                  <td className="py-4 px-4">
                    <TeacherInlineMetrics
                      submissionId={sub.id}
                      initialRecord={sub.academicRecord}
                      onUpdate={fetchSubmissions}
                    />
                  </td>

                  {/* Rubric Score Badge */}
                  <td className="py-4 px-4">
                    {sub.evaluation ? (
                      <div>
                        <span className="text-base font-extrabold text-emerald-400">
                          {sub.evaluation.totalScore} <span className="text-xs text-slate-400">/ 100</span>
                        </span>
                        <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle className="w-3 h-3" /> EVALUATED
                        </div>
                      </div>
                    ) : (
                      <span className="px-2 py-1 rounded bg-amber-950/80 border border-amber-700 text-amber-300 text-[10px] font-semibold">
                        PENDING EVALUATION
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedSubmission(sub)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer transition-colors shadow-md shadow-blue-500/20"
                      >
                        <Award className="w-3.5 h-3.5" /> Evaluate
                      </button>

                      {sub.evaluation && (
                        <button
                          onClick={() => handleDownloadDocx(sub.id, sub.studentIdCode)}
                          disabled={downloadingDocxId === sub.id}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-colors cursor-pointer"
                          title="Download Word Report (.docx)"
                        >
                          {downloadingDocxId === sub.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Rubric Evaluation Modal */}
      <TeacherGradingModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
        onSuccess={() => {
          setSelectedSubmission(null);
          fetchSubmissions();
        }}
      />
    </div>
  );
}
