import mongoose from "mongoose";
import { EvaluationEntity } from "../../../../domain/entities/Evaluation.entity.js";

const criterionScoreSchema = new mongoose.Schema(
  {
    criterionId: { type: String, required: true },
    score: { type: Number, required: true, default: 0 },
    feedback: { type: String, default: "" },
  },
  { _id: false }
);

const evaluationSchema = new mongoose.Schema(
  {
    submissionId: { type: mongoose.Schema.Types.ObjectId, ref: "Submission", required: true, index: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    evaluatorType: { type: String, enum: { values: ["AI", "Teacher"], message: "evaluatorType must be AI or Teacher" }, required: true },
    criteriaScores: { type: [criterionScoreSchema], default: [] },
    overallFeedback: { type: String, default: "" },
    totalScore: { type: Number, default: 0 },
    extractedText: { type: String, default: "" },
  },
  { timestamps: true }
);

evaluationSchema.index({ submissionId: 1, evaluatorType: 1 }, { unique: true });

export function toEvaluationEntity(doc) {
  if (!doc) return null;
  return new EvaluationEntity({
    id: doc._id.toString(),
    submissionId: (doc.submissionId?._id || doc.submissionId)?.toString(),
    examId: (doc.examId?._id || doc.examId)?.toString(),
    evaluatorType: doc.evaluatorType,
    criteriaScores: doc.criteriaScores?.map((cs) => ({
      criterionId: cs.criterionId,
      score: cs.score,
      feedback: cs.feedback,
    })) ?? [],
    overallFeedback: doc.overallFeedback,
    totalScore: doc.totalScore,
    extractedText: doc.extractedText,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export const EvaluationModel = mongoose.model("Evaluation", evaluationSchema);
