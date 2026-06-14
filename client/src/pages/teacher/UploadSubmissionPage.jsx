import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadSubmission } from "../../services/submissionApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function UploadSubmissionPage() {
  const { examId } = useParams();
  const navigate = useNavigate();

  const [studentName, setStudentName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentName", studentName);

      await uploadSubmission(examId, formData);
      navigate(`/exams/${examId}/submissions`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to upload. The file may be too large."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
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
        <h2 className="text-2xl font-bold text-slate-800">
          Upload Answer Sheet
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Upload a scanned PDF or image of the student's work for AI grading.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5"
      >
        {/* Student name */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Student Name *
          </label>
          <input
            type="text"
            required
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
            placeholder="John Doe"
          />
        </div>

        {/* File input */}
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">
            Answer Sheet (PDF, JPG, PNG) *
          </label>
          <div className="mt-1">
            <label
              htmlFor="file-upload"
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 transition hover:border-indigo-400 hover:bg-indigo-50/30"
            >
              <svg className="mb-3 h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              {file ? (
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700">
                    {file.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-600">
                    Click to upload or drag & drop
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    PDF, JPG, PNG up to 10 MB
                  </p>
                </div>
              )}
              <input
                id="file-upload"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                    setError("");
                  }
                }}
              />
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/exams/${examId}`)}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !file}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Uploading…
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Upload & Submit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
