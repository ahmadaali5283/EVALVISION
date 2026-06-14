import { ForbiddenError, NotFoundError } from "../../../domain/errors/DomainError.js";

export class ListSubmissionsByExamUseCase {
  constructor(submissionRepository, examRepository) {
    this.submissionRepository = submissionRepository;
    this.examRepository = examRepository;
  }

  async execute({ examId, userId, userRole }) {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw new NotFoundError("Exam");

    if (userRole !== "admin" && !exam.isOwnedBy(userId)) {
      throw new ForbiddenError("Forbidden: not your exam");
    }

    const submissions = await this.submissionRepository.findAll({ examId: exam.id });

    return { count: submissions.length, submissions };
  }
}
