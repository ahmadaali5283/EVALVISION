import { ForbiddenError, NotFoundError } from "../../../domain/errors/DomainError.js";

export class GetSubmissionUseCase {
  constructor(submissionRepository) {
    this.submissionRepository = submissionRepository;
  }

  async execute({ submissionId, userId, userRole }) {
    const submission = await this.submissionRepository.findById(submissionId);
    if (!submission) throw new NotFoundError("Submission");

    if (userRole !== "admin" && !submission.isOwnedBy(userId)) {
      throw new ForbiddenError("Forbidden: not your submission");
    }

    return submission;
  }
}
