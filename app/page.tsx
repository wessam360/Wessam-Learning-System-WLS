import Link from 'next/link';
import { Send, UserCheck, FileSpreadsheet, FileText, Sparkles, ArrowRight, CheckCircle2, Award, Users, BookOpen } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-20 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="text-center relative py-12 px-4 sm:px-8 lg:px-12 rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-950 to-black border border-blue-900/40 shadow-2xl overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[500px] h-80 sm:h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/80 text-blue-400 text-xs font-semibold mb-6 shadow-inner">
          <Sparkles className="w-4 h-4 text-blue-400" />
          High-Performance Academy Platform
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          Wessam Learning System <span className="text-blue-500 underline decoration-blue-500/40 decoration-wavy">(WLS)</span>
        </h1>

        <p className="mt-5 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          An advanced academic management system designed to scale for 500+ active students with automated rubric evaluations, inline grading, and document exports.
        </p>

        {/* Primary Portal Access Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto text-left">
          {/* Student Portal Card */}
          <Link
            href="/submit"
            className="wls-card p-6 border border-slate-800 hover:border-blue-500/70 group transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors flex items-center justify-between">
                Student Submission Portal
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Submit your final project, portfolio link, day schedule, and assign your course instructor for review.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-blue-400">
              Go to Submission Form &rarr;
            </div>
          </Link>

          {/* Teacher Portal Card */}
          <Link
            href="/teacher/dashboard"
            className="wls-card p-6 border border-slate-800 hover:border-indigo-500/70 group transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                Teacher Dashboard & Portal
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Isolated instructor panel for inline student monitoring, 7-criterion rubric scoring, and Word/Excel exports.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-indigo-400">
              Access Teacher Portal &rarr;
            </div>
          </Link>
        </div>
      </section>

      {/* Core Educational Features Section */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-400">Academy System Capabilities</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Built to maintain rigorous academic standards with minimal administrative overhead.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="wls-card p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Word (.docx) Assessment Reports</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates official academic assessment reports with complete mark breakdowns across all 7 evaluation rubric criteria out of 100 total marks.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="wls-card p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Excel (.xlsx) Marksheet Export</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consolidated result collection sheet downloads powered by `exceljs` featuring participation, attendance, quizzes, assignments, and project scores.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="wls-card p-6 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-base text-white">Inline Student Metrics</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enables course instructors to input and update attendance, class participation, quiz results, and assignments in real-time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
