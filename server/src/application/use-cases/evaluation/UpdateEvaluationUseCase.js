import { ForbiddenError, NotFoundError } from "../../../domain/errors/DomainError.js";

export class UpdateEvaluationUseCase {
  constructor(evaluationRepository, submissionRepository) {
    this.evaluationRepository = evaluationRepository;
    this.submissionRepository = submissionRepository;
  }

  async execute({
    submissionId,
    userId,
    userRole,
    criteriaScores,
    overallFeedback,
    totalScore,
  }) {
    const submission = await this.submissionRepository.findById(submissionId);
    if (!submission) throw new NotFoundError("Submission");

    if (userRole !== "admin" && !submission.isOwnedBy(userId)) {
      throw new ForbiddenError("Forbidden: not your submission");
    }

    const evaluation = await this.evaluationRepository.findOne({
      submissionId,
      evaluatorType: "AI",
    });
    if (!evaluation) throw new NotFoundError("Evaluation");

    const updates = {};
    if (criteriaScores !== undefined) {
      updates.criteriaScores = criteriaScores;
      updates.totalScore = criteriaScores.reduce((sum, item) => sum + (Number(item.score) || 0), 0);
    } else if (totalScore !== undefined) {
      updates.totalScore = totalScore;
    }
    if (overallFeedback !== undefined) updates.overallFeedback = overallFeedback;

    const updatedEvaluation = await this.evaluationRepository.update(evaluation.id, updates);

    await this.submissionRepository.update(submissionId, {
      totalAIScore: updatedEvaluation.totalScore,
      status: "reviewed",
    });

    return updatedEvaluation;
  }
}
