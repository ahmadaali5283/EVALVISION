/**
 * Renders a list of rubric criteria with scores, color badges, and feedback.
 *
 * Props:
 *   criteriaScores – array of { criterionId, score, feedback }
 *   maxScoreMap    – optional Map<criterionId, maxScore> for "x / max" display
 *   isEditing      - boolean indicating edit mode
 *   onScoreChange  - callback (index, newScore)
 *   onFeedbackChange - callback (index, newFeedback)
 */

function scoreColor(score, max) {
  if (!max) return "bg-slate-100 text-slate-700";
  const pct = score / max;
  if (pct >= 0.8) return "bg-emerald-100 text-emerald-700";
  if (pct >= 0.5) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

function formatCriterionId(id) {
  const match = String(id).match(/^q(\d+)$/i);
  if (match) {
    return `Q${parseInt(match[1], 10) + 1}`;
  }
  return id;
}

export default function CriteriaScoreList({
  criteriaScores = [],
  maxScoreMap = {},
  isEditing = false,
  onScoreChange = () => {},
  onFeedbackChange = () => {},
}) {
  if (!criteriaScores.length) {
    return (
      <p className="text-sm text-slate-400 italic">
        No criteria scores available.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {criteriaScores.map((cs, index) => {
        const max = maxScoreMap[cs.criterionId];
        return (
          <li
            key={cs.criterionId}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">
                {formatCriterionId(cs.criterionId)}
              </span>
              {isEditing ? (
                 <div className="flex items-center gap-2">
                     <input 
                        type="number"
                        min="0"
                        className="w-20 rounded border border-slate-300 p-1 text-sm font-semibold focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={cs.score}
                        onChange={(e) => onScoreChange(index, e.target.value)}
                     /> 
                     {max != null && <span className="text-sm font-semibold text-slate-500">/ {max}</span>}
                 </div>
              ) : (
                <span
                    className={`rounded-full px-3 py-0.5 text-xs font-bold ${scoreColor(
                    cs.score,
                    max
                    )}`}
                >
                    {cs.score}
                    {max != null ? ` / ${max}` : ""}
                </span>
              )}
            </div>

            {(cs.feedback || isEditing) && (
                 isEditing ? (
                    <textarea 
                        className="mt-2 text-sm leading-relaxed text-slate-600 w-full rounded border border-slate-300 p-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 min-h-[60px]"
                        value={cs.feedback || ""}
                        onChange={(e) => onFeedbackChange(index, e.target.value)}
                        placeholder="Provide feedback..."
                    />
                 ): (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {cs.feedback}
                    </p>
                )
            )}
          </li>
        );
      })}
    </ul>
  );
}
