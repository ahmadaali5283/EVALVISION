import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { listExams } from "../services/examApi";
import LoadingSpinner from "../components/common/LoadingSpinner";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalExams: 0, recentExams: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listExams()
      .then(({ count, exams }) => {
        setStats({
          totalExams: count,
          recentExams: exams.slice(0, 5),
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner className="py-20" />;

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold">
          Welcome back, {user?.name || "User"}!
        </h2>
        <p className="mt-2 max-w-lg text-indigo-100">
          Manage your exams, upload student submissions, and let AI grade them
          instantly with rubric-based evaluation.
        </p>
        <Link
          to="/exams/new"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 shadow transition hover:bg-indigo-50"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create New Exam
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Exams"
          value={stats.totalExams}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          }
          color="indigo"
          linkTo="/exams"
        />
        <StatCard
          label="Role"
          value={user?.role || "—"}
          icon={
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          }
          color="purple"
        />
      </div>

      {/* Recent exams */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Recent Exams</h3>
          <Link
            to="/exams"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View all →
          </Link>
        </div>

        {stats.recentExams.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 px-6 py-12 text-center">
            <p className="text-sm text-slate-500">
              No exams yet. Create your first exam to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {stats.recentExams.map((exam) => (
              <Link
                key={exam._id}
                to={`/exams/${exam._id}`}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 transition hover:border-indigo-200 hover:shadow-md"
              >
                <div>
                  <h4 className="font-semibold text-slate-800">{exam.title}</h4>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {exam.subject || "No subject"} · {exam.questions?.length || 0} questions · {exam.totalMarks} marks
                  </p>
                </div>
                <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color, linkTo }) {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  const Wrapper = linkTo ? Link : "div";
  const wrapperProps = linkTo ? { to: linkTo } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className={`rounded-xl p-3 ${colorMap[color]}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-xl font-bold capitalize text-slate-800">{String(value)}</p>
      </div>
    </Wrapper>
  );
}
