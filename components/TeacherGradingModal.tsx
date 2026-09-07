'use client';

import React, { useState, useEffect } from 'react';
import { X, Award, FileText, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';

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
  evaluation?: Evaluation | null;
}

interface TeacherGradingModalProps {
  submission: Submission | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TeacherGradingModal({
  submission,
  onClose,
  onSuccess,
}: TeacherGradingModalProps) {
  const [synopsisScore, setSynopsisScore] = useState(10);
  const [uiUxScore, setUiUxScore] = useState(20);
  const [innovationScore, setInnovationScore] = useState(30);
  const [reportingScore, setReportingScore] = useState(10);
  const [outcomesScore, setOutcomesScore] = useState(10);
  const [groupScore, setGroupScore] = useState(10);
  const [presentationScore, setPresentationScore] = useState(10);
  const [feedback, setFeedback] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [downloadingDocx, setDownloadingDocx] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (submission?.evaluation) {
      const ev = submission.evaluation;
      setSynopsisScore(ev.synopsisScore);
      setUiUxScore(ev.uiUxScore);
      setInnovationScore(ev.innovationScore);
      setReportingScore(ev.reportingScore);
      setOutcomesScore(ev.outcomesScore);
      setGroupScore(ev.groupScore);
      setPresentationScore(ev.presentationScore);
      setFeedback(ev.feedback || '');
    } else {
      setSynopsisScore(10);
      setUiUxScore(20);
      setInnovationScore(30);
      setReportingScore(10);
      setOutcomesScore(10);
      setGroupScore(10);
      setPresentationScore(10);
      setFeedback('');
    }
  }, [submission]);

  if (!submission) return null;

  const totalScore =
    Number(synopsisScore || 0) +
    Number(uiUxScore || 0) +
    Number(innovationScore || 0) +
    Number(reportingScore || 0) +
    Number(outcomesScore || 0) +
    Number(groupScore || 0) +
    Number(presentationScore || 0);

  const handleSubmitEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/teacher/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          type: 'RUBRIC_EVALUATION',
          synopsisScore,
          uiUxScore,
          innovationScore,
          reportingScore,
          outcomesScore,
          groupScore,
          presentationScore,
          feedback,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        onSuccess();
      }
    } catch (err) {
      console.error('Submit evaluation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadWordDoc = async () => {
    setDownloadingDocx(true);
    try {
      const res = await fetch(`/api/export/docx/${submission.id}`);
      if (!res.ok) {
        alert('Please save evaluation first before exporting Word report.');
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `WLS_Evaluation_${submission.studentIdCode}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download Word doc error:', err);
    } finally {
      setDownloadingDocx(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="wls-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-slate-950 border border-slate-800 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-lg bg-slate-900 border border-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-400">Final Project Academic Rubric Evaluation</h2>
            <p className="text-xs text-slate-400">
              Student ID: <span className="text-white font-semibold">{submission.studentIdCode}</span> | Name: <span className="text-white font-semibold">{submission.studentName}</span>
            </p>
          </div>
        </div>

        {/* Student Links Quick Access */}
        <div className="mb-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-400 block">Project Name:</span>
            <span className="text-white font-bold text-sm">{submission.projectName}</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={submission.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-950 border border-blue-700 text-blue-300 hover:text-white transition-colors"
            >
              Project Link <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <a
              href={submission.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-950 border border-purple-700 text-purple-300 hover:text-white transition-colors"
            >
              Portfolio Link <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Evaluation scores saved successfully!
            </div>
            <button
              onClick={handleDownloadWordDoc}
              disabled={downloadingDocx}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Download Word Report (.docx)
            </button>
          </div>
        )}

        {/* Evaluation Form */}
        <form onSubmit={handleSubmitEvaluation} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Criterion 1 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-200">Idea / Synopsis</label>
                <span className="text-xs font-bold text-blue-400">Max: 10</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={synopsisScore}
                onChange={(e) => setSynopsisScore(parseFloat(e.target.value) || 0)}
                className="wls-input w-full text-center font-bold"
                required
              />
            </div>

            {/* Criterion 2 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-200">User / Client Interface & Layout</label>
                <span className="text-xs font-bold text-blue-400">Max: 20</span>
              </div>
              <input
                type="number"
                min="0"
                max="20"
                step="0.5"
                value={uiUxScore}
                onChange={(e) => setUiUxScore(parseFloat(e.target.value) || 0)}
                className="wls-input w-full text-center font-bold"
                required
              />
            </div>

            {/* Criterion 3 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-200">Innovation / Creativity</label>
                <span className="text-xs font-bold text-blue-400">Max: 30</span>
              </div>
              <input
                type="number"
                min="0"
                max="30"
                step="0.5"
                value={innovationScore}
                onChange={(e) => setInnovationScore(parseFloat(e.target.value) || 0)}
                className="wls-input w-full text-center font-bold"
                required
              />
            </div>

            {/* Criterion 4 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-200">Reporting System / Activity Log</label>
                <span className="text-xs font-bold text-blue-400">Max: 10</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={reportingScore}
                onChange={(e) => setReportingScore(parseFloat(e.target.value) || 0)}
                className="wls-input w-full text-center font-bold"
                required
              />
            </div>

            {/* Criterion 5 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-200">Integration with Course Outcomes</label>
                <span className="text-xs font-bold text-blue-400">Max: 10</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={outcomesScore}
                onChange={(e) => setOutcomesScore(parseFloat(e.target.value) || 0)}
                className="wls-input w-full text-center font-bold"
                required
              />
            </div>

            {/* Criterion 6 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-200">Group Involvement</label>
                <span className="text-xs font-bold text-blue-400">Max: 10</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={groupScore}
                onChange={(e) => setGroupScore(parseFloat(e.target.value) || 0)}
                className="wls-input w-full text-center font-bold"
                required
              />
            </div>

            {/* Criterion 7 */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-200">Presentation Style</label>
                <span className="text-xs font-bold text-blue-400">Max: 10</span>
              </div>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={presentationScore}
                onChange={(e) => setPresentationScore(parseFloat(e.target.value) || 0)}
                className="wls-input w-full text-center font-bold"
                required
              />
            </div>
          </div>

          {/* Feedback Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Evaluator Feedback & Comments
            </label>
            <textarea
              rows={3}
              placeholder="Provide constructive feedback for the student..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="wls-input w-full"
            />
          </div>

          {/* Total Score Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950 to-indigo-950 border border-blue-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-400" />
              <span className="font-bold text-white text-base">TOTAL ACADEMIC EVALUATION SCORE:</span>
            </div>
            <div className="text-2xl font-extrabold text-blue-400">
              {totalScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownloadWordDoc}
              disabled={downloadingDocx}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700"
            >
              {downloadingDocx ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4 text-blue-400" />
              )}
              Export Word Report (.docx)
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="wls-btn-primary w-full sm:w-auto px-6 py-2.5 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving Evaluation...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Submit & Finalize Rubric
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
