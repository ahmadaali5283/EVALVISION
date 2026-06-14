import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createExam, getExam, updateExam } from "../../services/examApi";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const emptyQuestion = () => ({
  questionText: "",
  maxMarks: 1,
  type: "subjective",
});

export default function CreateExamPage() {
  const { examId } = useParams(); // present when editing
  const navigate = useNavigate();
  const isEdit = !!examId;

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [rubricFile, setRubricFile] = useState(null);
  const [questions, setQuestions] = useState([emptyQuestion()]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState("");

  // ── Pre-fill when editing ──────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    getExam(examId)
      .then(({ exam }) => {
        setTitle(exam.title);
        setSubject(exam.subject || "");
        setQuestions(
          exam.questions.map((q) => ({
            questionText: q.questionText,
            maxMarks: q.maxMarks,
            type: q.type || "subjective",
          }))
        );
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load exam")
      )
      .finally(() => setFetching(false));
  }, [examId, isEdit]);

  // ── Question helpers ───────────────────────────────────
  function updateQuestion(index, field, value) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(index) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  // ── Submit ─────────────────────────────────────────────
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("questions", JSON.stringify(questions));
      if (rubricFile) {
        formData.append("rubricFile", rubricFile);
      }

      if (isEdit) {
        await updateExam(examId, formData);
        navigate(`/exams/${examId}`);
      } else {
        const { exam } = await createExam(formData);
        navigate(`/exams/${exam._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save exam");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <LoadingSpinner className="py-20" />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <button
          onClick={() => navigate(isEdit ? `/exams/${examId}` : "/exams")}
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <h2 className="text-2xl font-bold text-slate-800">
          {isEdit ? "Edit Exam" : "Create New Exam"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isEdit
            ? "Update the exam details and questions below."
            : "Define the exam structure, questions, and grading rubric."}
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic info */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Exam Details
          </h3>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
              placeholder="Midterm Exam"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
              placeholder="Physics, Math, English…"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Rubric / Grading Instructions (Document)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => setRubricFile(e.target.files?.[0])}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {isEdit && (
              <p className="mt-1 text-xs text-slate-500">
                Leave blank to keep the existing rubric file.
              </p>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Questions ({questions.length})
            </h3>
            <button
              type="button"
              onClick={addQuestion}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Question
            </button>
          </div>

          {questions.map((q, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-500">
                  Q{idx + 1}
                </span>
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(idx)}
                    className="text-sm text-red-500 hover:text-red-700 transition"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Question Text *
                </label>
                <textarea
                  rows={2}
                  required
                  value={q.questionText}
                  onChange={(e) =>
                    updateQuestion(idx, "questionText", e.target.value)
                  }
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition resize-y"
                  placeholder="Enter the question…"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Max Marks *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={q.maxMarks}
                    onChange={(e) =>
                      updateQuestion(idx, "maxMarks", Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Type
                  </label>
                  <select
                    value={q.type}
                    onChange={(e) =>
                      updateQuestion(idx, "type", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition"
                  >
                    <option value="subjective">Subjective</option>
                    <option value="mcq">MCQ</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(isEdit ? `/exams/${examId}` : "/exams")}
            className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading
              ? isEdit
                ? "Saving…"
                : "Creating…"
              : isEdit
              ? "Save Changes"
              : "Create Exam"}
          </button>
        </div>
      </form>
    </div>
  );
}
