export class SubmissionEntity {
  constructor({
    id,
    studentName,
    examId,
    teacherId,
    answers,
    totalAIScore,
    totalFinalScore,
    filePath,
    originalFileName,
    mimeType,
    uploadDate,
    processingStage,
    status,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this._id = id;
    this.studentName = studentName;
    this.examId = examId;
    this.teacherId = teacherId;
    this.answers = answers ?? [];
    this.totalAIScore = totalAIScore ?? null;
    this.totalFinalScore = totalFinalScore ?? null;
    this.filePath = filePath ?? "";
    this.originalFileName = originalFileName ?? "";
    this.mimeType = mimeType ?? "";
    this.uploadDate = uploadDate ?? null;
    this.processingStage = processingStage ?? "uploaded";
    this.status = status ?? "pending";
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  isOwnedBy(userId) {
    return this.teacherId?.toString() === userId?.toString();
  }

  static PROCESSING_STAGES = [
    "uploaded",
    "preprocessing",
    "ocr",
    "grading",
    "completed",
  ];

  static STATUSES = ["pending", "graded", "reviewed"];
}
