import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AIResultPanel from "../../components/teacher/AIResultPanel";
import SubmissionCard from "../../components/teacher/SubmissionCard";
import { gradeSubmission } from "../../services/aiApi";
import { getSubmissionsByExam, checkPlagiarism } from "../../services/submissionApi";
import { getEvaluation } from "../../services/evaluationApi";

/**
 * Teacher page — list submissions for an exam and trigger / view AI grading.
 *
 * Route:  /exams/:examId/submissions
 */
export default function AssignmentSubmissionsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Track which submission is currently being graded.
  const [loadingSubmissionId, setLoadingSubmissionId] = useState(null);

  // Currently displayed AI evaluation (open panel).
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  // Plagiarism detection state
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);
  const [plagiarismResults, setPlagiarismResults] = useState(null);

  // ── Fetch submissions ──────────────────────────────────
  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { submissions: subs } = await getSubmissionsByExam(examId);
      setSubmissions(subs);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    if (examId) fetchSubmissions();
  }, [examId, fetchSubmissions]);

  // ── AI Grade action ────────────────────────────────────
  async function handleGrade(submissionId) {
    try {
      setLoadingSubmissionId(submissionId);
      setError(null);
      const { evaluation } = await gradeSubmission(submissionId);

      // Refresh list to reflect new status / score.
      await fetchSubmissions();

      // Open result panel immediately.
      setSelectedEvaluation(evaluation);
    } catch (err) {
      setError(
        err.response?.data?.message || "AI grading failed — please try again"
      );
    } finally {
      setLoadingSubmissionId(null);
    }
  }

  // ── View result action — fetch real Evaluation ─────────
  async function handleViewResult(submissionId) {
    try {
      const { evaluation } = await getEvaluation(submissionId);
      setSelectedEvaluation(evaluation);
    } catch {
      // Fallback to submission-level data if no evaluation found
      const sub = submissions.find((s) => s._id === submissionId);
      if (!sub) return;

      const criteriaScores = (sub.answers || []).map((a) => ({
        criterionId: `q${a.questionIndex + 1}`,
        score: a.aiScore ?? 0,
        feedback: "",
      }));

      setSelectedEvaluation({
        criteriaScores,
        totalScore: sub.totalAIScore ?? 0,
        overallFeedback: "",
        extractedText: "",
      });
    }
  }

  // ── Plagiarism Check ───────────────────────────────────
  async function handleCheckPlagiarism() {
    try {
      setIsCheckingPlagiarism(true);
      setError(null);
      const res = await checkPlagiarism(examId);
      setPlagiarismResults(res.flagged || []);
      if (res.message) {
        alert(res.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to run plagiarism check"
      );
    } finally {
      setIsCheckingPlagiarism(false);
    }
  }

  // Updates UI locally after successful API call from child component
  const handleEvaluationUpdated = (updatedEval) => {
      setSelectedEvaluation(updatedEval);
      
      // update the submissions array so the updated score is immediately reflected
      setSubmissions(prev => 
          prev.map(sub => 
            sub._id === updatedEval.submissionId ? { ...sub, totalAIScore: updatedEval.totalScore, status: "reviewed" } : sub
          )
      );
  }

  // ── Render ─────────────────────────────────────────────
  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate(`/exams/${examId}`)}
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Exam
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              AI Grading Dashboard
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Review student submissions and trigger AI-powered rubric grading.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCheckPlagiarism}
              disabled={isCheckingPlagiarism || submissions.length < 2}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {isCheckingPlagiarism ? (
                <span>Checking...</span>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  Check Plagiarism
                </>
              )}
            </button>
            <Link
              to={`/exams/${examId}/upload`}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              Upload
            </Link>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Plagiarism Results */}
      {plagiarismResults !== null && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-amber-800">
              Plagiarism Check Results
            </h3>
            <button
              onClick={() => setPlagiarismResults(null)}
              className="text-amber-700 hover:text-amber-900"
            >
              Dismiss
            </button>
          </div>
          {plagiarismResults.length === 0 ? (
            <p className="text-sm text-amber-700">
              Good news! No flagged pairs found above the similarity threshold.
            </p>
          ) : (
            <ul className="space-y-2">
              {plagiarismResults.map((res, i) => (
                <li key={i} className="rounded-lg bg-white/60 px-4 py-3 text-sm text-amber-900 shadow-sm">
                  ⚠️ <span className="font-semibold">{res.studentA}</span> and{" "}
                  <span className="font-semibold">{res.studentB}</span> share a{" "}
                  <span className="font-bold text-red-600">{res.similarityPercentage}%</span> text similarity.
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      )}

      {/* Empty state */}
      {!loading && submissions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 px-6 py-16 text-center">
          <p className="text-sm text-slate-500">No submissions found for this exam.</p>
          <Link
            to={`/exams/${examId}/upload`}
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Upload first submission →
          </Link>
        </div>
      )}

      {/* Submissions grid + AI panel side-by-side on large screens */}
      {!loading && submissions.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: cards */}
          <div className="space-y-4">
            {submissions.map((sub) => (
              <SubmissionCard
                key={sub._id}
                submission={sub}
                isLoading={loadingSubmissionId === sub._id}
                onGrade={handleGrade}
                onViewResult={handleViewResult}
              />
            ))}
          </div>

          {/* Right: AI result panel */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            {selectedEvaluation ? (
              <AIResultPanel
                evaluation={selectedEvaluation}
                onClose={() => setSelectedEvaluation(null)}
                onEvaluationUpdated={handleEvaluationUpdated}
              />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-400">
                Select a submission and grade or view results here.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
