export class ExamEntity {
  constructor({
    id,
    title,
    subject,
    teacherId,
    totalMarks,
    questions,
    rubricFile,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this._id = id;
    this.title = title;
    this.subject = subject ?? "";
    this.teacherId = teacherId;
    this.questions = questions ?? [];
    this.rubricFile = rubricFile ?? "";
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;

    this.totalMarks =
      this.questions.length > 0
        ? this.questions.reduce((sum, q) => sum + (q.maxMarks ?? 0), 0)
        : (totalMarks ?? 0);
  }

  isOwnedBy(userId) {
    return this.teacherId?.toString() === userId?.toString();
  }
}
