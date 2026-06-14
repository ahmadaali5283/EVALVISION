import StatusBadge from "../common/StatusBadge";

/**
 * Card for a single submission in the AI Grading Dashboard.
 *
 * Props:
 *   submission – submission object
 *   isLoading  – true while AI grading is in progress for this submission
 *   onGrade    – (submissionId) => void
 *   onViewResult – (submissionId) => void
 */
export default function SubmissionCard({
  submission,
  isLoading,
  onGrade,
  onViewResult,
}) {
  const isGraded =
    submission.status === "graded" || submission.status === "reviewed";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-semibold text-slate-800">
            {submission.studentName}
          </h4>
          <p className="mt-1 text-xs text-slate-400">
            {submission.originalFileName || "No file"} ·{" "}
            {new Date(submission.createdAt).toLocaleDateString()}
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      {/* Score preview */}
      {submission.totalAIScore != null && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">AI Score:</span>
          <span className="text-sm font-bold text-indigo-600">
            {submission.totalAIScore}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {!isGraded && (
          <button
            onClick={() => onGrade(submission._id)}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-indigo-600 py-2 text-center text-xs font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Grading…
              </span>
            ) : (
              "Grade with AI"
            )}
          </button>
        )}
        {isGraded && (
          <button
            onClick={() => onViewResult(submission._id)}
            className="flex-1 rounded-lg bg-emerald-50 py-2 text-center text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
          >
            View Result
          </button>
        )}
        <button
          onClick={() => onViewResult(submission._id)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Details
        </button>
      </div>
    </div>
  );
}
