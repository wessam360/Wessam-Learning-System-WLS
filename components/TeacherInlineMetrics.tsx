'use client';

import React, { useState } from 'react';
import { Save, Loader2, Check } from 'lucide-react';

interface AcademicRecord {
  id?: string;
  participation: number;
  attendance: number;
  quizzes: number;
  assignments: number;
}

interface TeacherInlineMetricsProps {
  submissionId: string;
  initialRecord?: AcademicRecord | null;
  onUpdate?: () => void;
}

export function TeacherInlineMetrics({
  submissionId,
  initialRecord,
  onUpdate,
}: TeacherInlineMetricsProps) {
  const [participation, setParticipation] = useState(initialRecord?.participation ?? 0);
  const [attendance, setAttendance] = useState(initialRecord?.attendance ?? 0);
  const [quizzes, setQuizzes] = useState(initialRecord?.quizzes ?? 0);
  const [assignments, setAssignments] = useState(initialRecord?.assignments ?? 0);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/teacher/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId,
          type: 'INLINE_METRICS',
          participation,
          attendance,
          quizzes,
          assignments,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
        if (onUpdate) onUpdate();
      }
    } catch (err) {
      console.error('Inline grade save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-col gap-1 text-[11px]">
        <div className="flex items-center gap-1">
          <span className="text-slate-400 w-16">Part (10):</span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={participation}
            onChange={(e) => setParticipation(parseFloat(e.target.value) || 0)}
            className="w-12 bg-slate-900 border border-slate-700 text-white rounded text-center px-1 py-0.5 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-400 w-16">Att (10):</span>
          <input
            type="number"
            min="0"
            max="10"
            step="0.5"
            value={attendance}
            onChange={(e) => setAttendance(parseFloat(e.target.value) || 0)}
            className="w-12 bg-slate-900 border border-slate-700 text-white rounded text-center px-1 py-0.5 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1 text-[11px]">
        <div className="flex items-center gap-1">
          <span className="text-slate-400 w-16">Quiz (20):</span>
          <input
            type="number"
            min="0"
            max="20"
            step="0.5"
            value={quizzes}
            onChange={(e) => setQuizzes(parseFloat(e.target.value) || 0)}
            className="w-12 bg-slate-900 border border-slate-700 text-white rounded text-center px-1 py-0.5 focus:border-blue-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-1">
          <span className="text-slate-400 w-16">Assign (20):</span>
          <input
            type="number"
            min="0"
            max="20"
            step="0.5"
            value={assignments}
            onChange={(e) => setAssignments(parseFloat(e.target.value) || 0)}
            className="w-12 bg-slate-900 border border-slate-700 text-white rounded text-center px-1 py-0.5 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`p-2 rounded-lg border transition-all cursor-pointer ${
          savedSuccess
            ? 'bg-emerald-950/80 border-emerald-600 text-emerald-400'
            : 'bg-blue-950/80 hover:bg-blue-900 border-blue-700 text-blue-400'
        }`}
        title="Save Inline Metrics"
      >
        {saving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : savedSuccess ? (
          <Check className="w-4 h-4" />
        ) : (
          <Save className="w-4 h-4" />
        )}
      </button>
    </div>
  );
}
