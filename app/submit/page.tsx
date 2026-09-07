import { StudentSubmissionForm } from '@/components/StudentSubmissionForm';

export default function SubmitPage() {
  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-blue-400">WLS Student Submission Portal</h1>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Please complete all required fields below. Select your course instructor so your project and portfolio can be directly assigned for rubric evaluation.
        </p>
      </div>
      <StudentSubmissionForm />
    </div>
  );
}
