import { useState } from "react";
import CriteriaScoreList from "./CriteriaScoreList";
import { updateEvaluation } from "../../services/evaluationApi";

/**
 * Panel that displays an AI evaluation result.
 *
 * Props:
 *   evaluation  – { _id, submissionId, criteriaScores, totalScore, overallFeedback, extractedText }
 *   onClose     – callback to dismiss the panel
 *   onEvaluationUpdated - callback when evaluation was successfully updated by teacher
 */
export default function AIResultPanel({ evaluation, onClose, onEvaluationUpdated }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCriteriaScores, setEditedCriteriaScores] = useState(
    evaluation?.criteriaScores || []
  );
  const [isSaving, setIsSaving] = useState(false);
  
  if (!evaluation) return null;

  const handleScoreChange = (index, newScore) => {
    const newScores = [...editedCriteriaScores];
    newScores[index] = { ...newScores[index], score: Number(newScore) };
    setEditedCriteriaScores(newScores);
  };

  const handleFeedbackChange = (index, newFeedback) => {
    const newScores = [...editedCriteriaScores];
    newScores[index] = { ...newScores[index], feedback: newFeedback };
    setEditedCriteriaScores(newScores);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateEvaluation(evaluation.submissionId, {
        criteriaScores: editedCriteriaScores,
        overallFeedback: evaluation.overallFeedback,
      });
      if (onEvaluationUpdated) onEvaluationUpdated(updated.evaluation);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update evaluation:", error);
      alert("Error saving evaluation changes");
    } finally {
      setIsSaving(false);
    }
  };

  const totalEditedScore = editedCriteriaScores.reduce((sum, item) => sum + (Number(item.score) || 0), 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-800">
          AI Evaluation {isEditing ? "(Edit Mode)" : ""}
        </h3>
        <div className="flex gap-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium pr-4"
              >
                  Edit Scores
              </button>
            ) : (
                <div className="flex gap-2 pr-4">
                     <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedCriteriaScores(evaluation.criteriaScores);
                        }}
                        className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                      >
                          Cancel
                      </button>
                      <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="text-green-600 hover:text-green-700 text-sm font-bold disabled:opacity-50"
                      >
                          {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                </div>
            )}
            
            <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
      </div>

      {/* Total score */}
      <div className="flex items-center gap-4 rounded-lg bg-indigo-50 p-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <span className="text-xl font-bold">{isEditing ? totalEditedScore : evaluation.totalScore}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">Total Score</p>
          <p className="text-2xl font-bold text-slate-800">
            {isEditing ? totalEditedScore : evaluation.totalScore} pts
          </p>
        </div>
      </div>

      {/* Criteria scores */}
      {evaluation.criteriaScores?.length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Criteria Breakdown
          </h4>
          <CriteriaScoreList 
             criteriaScores={isEditing ? editedCriteriaScores : evaluation.criteriaScores} 
             isEditing={isEditing}
             onScoreChange={handleScoreChange}
             onFeedbackChange={handleFeedbackChange}
          />
        </div>
      )}

      {/* Overall feedback */}
      {evaluation.overallFeedback && (
        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Overall Feedback
          </h4>
          <p className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {evaluation.overallFeedback}
          </p>
        </div>
      )}

      {/* Extracted text */}
      {evaluation.extractedText && (
        <div>
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Extracted Text (OCR)
          </h4>
          <div className="max-h-60 overflow-y-auto rounded-lg bg-slate-50 p-4">
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
              {evaluation.extractedText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
