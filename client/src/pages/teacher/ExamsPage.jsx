import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listExams, deleteExam } from "../../services/examApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function ExamsPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  async function fetchExams() {
    try {
      setLoading(true);
      const { exams: data } = await listExams();
      setExams(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load exams");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExams();
  }, []);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await deleteExam(deleteTarget);
      setExams((prev) => prev.filter((e) => e._id !== deleteTarget));
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Exams</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your exams, define questions, and rubrics
          </p>
        </div>
        <Link
          to="/exams/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Exam
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && <LoadingSpinner className="py-20" />}

      {/* Empty state */}
      {!loading && exams.length === 0 && (
        <EmptyState
          icon={
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
          title="No exams yet"
          description="Create your first exam to start grading student submissions with AI."
          action={
            <Link
              to="/exams/new"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700"
            >
              Create Exam
            </Link>
          }
        />
      )}

      {/* Exam list */}
      {!loading && exams.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
            >
              <Link to={`/exams/${exam._id}`} className="block">
                <div className="mb-3 flex items-start justify-between">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-600">
                    {exam.totalMarks} marks
                  </span>
                </div>

                <h3 className="font-semibold text-slate-800 group-hover:text-indigo-700">
                  {exam.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {exam.subject || "No subject"} · {exam.questions?.length || 0} questions
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Created {new Date(exam.createdAt).toLocaleDateString()}
                </p>
              </Link>

              {/* Actions */}
              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
                <Link
                  to={`/exams/${exam._id}`}
                  className="flex-1 rounded-lg bg-indigo-50 py-1.5 text-center text-xs font-medium text-indigo-600 transition hover:bg-indigo-100"
                >
                  View
                </Link>
                <Link
                  to={`/exams/${exam._id}/edit`}
                  className="flex-1 rounded-lg bg-slate-50 py-1.5 text-center text-xs font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Edit
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteTarget(exam._id);
                  }}
                  className="flex-1 rounded-lg bg-red-50 py-1.5 text-center text-xs font-medium text-red-600 transition hover:bg-red-100"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Exam"
        message="Are you sure? This will permanently delete this exam and cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
