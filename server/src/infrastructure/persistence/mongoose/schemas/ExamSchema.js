import mongoose from "mongoose";
import { ExamEntity } from "../../../../domain/entities/Exam.entity.js";

const questionSchema = new mongoose.Schema(
  {
    questionText: { type: String, required: [true, "Question text is required"] },
    maxMarks: { type: Number, required: [true, "Max marks is required"], min: [1, "Max marks must be at least 1"] },
    type: { type: String, enum: { values: ["subjective", "mcq"], message: "Type must be subjective or mcq" }, default: "subjective" },
  },
  { _id: false }
);

const examSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    subject: { type: String, trim: true, default: "" },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    totalMarks: { type: Number, default: 0 },
    questions: { type: [questionSchema], validate: { validator: (arr) => arr.length > 0, message: "At least one question is required" } },
    rubricFile: { type: String, default: "" },
  },
  { timestamps: true }
);

examSchema.pre("save", function (next) {
  if (this.isModified("questions")) {
    this.totalMarks = this.questions.reduce((sum, q) => sum + q.maxMarks, 0);
  }
  next();
});

export function toExamEntity(doc) {
  if (!doc) return null;
  return new ExamEntity({
    id: doc._id.toString(),
    title: doc.title,
    subject: doc.subject,
    teacherId: (doc.teacherId?._id || doc.teacherId)?.toString(),
    totalMarks: doc.totalMarks,
    questions: doc.questions?.map((q) => ({
      questionText: q.questionText,
      maxMarks: q.maxMarks,
      type: q.type,
    })) ?? [],
    rubricFile: doc.rubricFile,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  });
}

export const ExamModel = mongoose.model("Exam", examSchema);
