export class EvaluationEntity {
  constructor({
    id,
    submissionId,
    examId,
    evaluatorType,
    criteriaScores,
    overallFeedback,
    totalScore,
    extractedText,
    createdAt,
    updatedAt,
  }) {
    this.id = id;
    this._id = id;
    this.submissionId = submissionId;
    this.examId = examId;
    this.evaluatorType = evaluatorType;
    this.criteriaScores = criteriaScores ?? [];
    this.overallFeedback = overallFeedback ?? "";
    this.totalScore = totalScore ?? 0;
    this.extractedText = extractedText ?? "";
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  recalculateTotalScore() {
    this.totalScore = this.criteriaScores.reduce(
      (sum, item) => sum + (Number(item.score) || 0),
      0
    );
    return this.totalScore;
  }
}
