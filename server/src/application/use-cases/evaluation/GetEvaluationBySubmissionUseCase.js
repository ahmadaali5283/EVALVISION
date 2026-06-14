import { ForbiddenError, NotFoundError } from "../../../domain/errors/DomainError.js";

export class GetEvaluationBySubmissionUseCase {
  constructor(evaluationRepository, submissionRepository) {
    this.evaluationRepository = evaluationRepository;
    this.submissionRepository = submissionRepository;
  }

  async execute({ submissionId, userId, userRole }) {
    const submission = await this.submissionRepository.findById(submissionId);
    if (!submission) throw new NotFoundError("Submission");

    if (userRole !== "admin" && !submission.isOwnedBy(userId)) {
      throw new ForbiddenError("Forbidden: not your submission");
    }

    const evaluation = await this.evaluationRepository.findOne({
      submissionId,
      evaluatorType: "AI",
    });

    if (!evaluation) throw new NotFoundError("AI evaluation for this submission");

    return evaluation;
  }
}
