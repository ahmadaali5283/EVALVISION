/**
 * Renders a coloured pill badge for submission status values.
 *
 * @param {{ status: string }} props
 */
export default function StatusBadge({ status }) {
  const styles = {
    pending: "bg-amber-100 text-amber-700",
    processing: "bg-blue-100 text-blue-700",
    graded: "bg-emerald-100 text-emerald-700",
    reviewed: "bg-purple-100 text-purple-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
