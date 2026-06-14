import mongoose from "mongoose";
import { SubmissionEntity } from "../../../../domain/entities/Submission.entity.js";

const answerSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    extractedText: { type: String, default: "" },
    aiScore: { type: Number, default: null },
    finalScore: { type: Number, default: null },
    confidence: { type: Number, default: null },
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: [true, "Student name is required"], trim: true },
    examId: { type: mongoose.Schema.Types.ObjectId, ref: "Exam", required: true, index: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    answers: { type: [answerSchema], default: [] },
    totalAIScore: { type: Number, default: null },
    totalFinalScore: { type: Number, default: null },
    filePath: { type: String, default: "" },
    originalFileName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    uploadDate: { type: Date, default: null },
    processingStage: { type: String, enum: { values: ["uploaded", "preprocessing", "ocr", "grading", "completed"] }, default: "uploaded" },
    status: { type: String, enum: { values: ["pending", "graded", "reviewed"] }, default: "pending" },
  },
  { timestamps: true }
);

export function toSubmissionEntity(doc) {
  if (!doc) return null;
  return new SubmissionEntity({
    id: doc._id.toString(),
    studentName: doc.studentName,
    examId: (doc.examId?._id || doc.examId)?.toString(),
    teacherId: (doc.teacherId?._id || doc.teacherId)?.toString(),
    answers: doc.answers?.map((a) => ({
      questionIndex: a.questionIndex,
      extractedText: a.extractedText,
      aiScore: a.aiScore,
      finalScore: a.finalScore,
      confidence: a.confidence,
    })) ?? [],
    totalAIScore: doc.totalAIScore,
    totalFinalScore: doc.totalFinalScore,
    filePath: doc.filePath,
    originalFileName: doc.originalFileName,
    mimeType: doc.mimeType,
    uploadDate: doc.uploadDate,
    processingStage: doc.processingStage,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export const SubmissionModel = mongoose.model("Submission", submissionSchema);
