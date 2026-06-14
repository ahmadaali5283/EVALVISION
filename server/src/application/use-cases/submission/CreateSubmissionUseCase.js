import { ForbiddenError, NotFoundError, ValidationError } from "../../../domain/errors/DomainError.js";

export class CreateSubmissionUseCase {
  constructor(submissionRepository, examRepository, userRepository) {
    this.submissionRepository = submissionRepository;
    this.examRepository = examRepository;
    this.userRepository = userRepository;
  }

  async execute({ studentName, examId, answers, userId, userRole }) {
    if (!studentName || !examId) {
      throw new ValidationError("studentName and examId are required");
    }

    const exam = await this.examRepository.findById(examId);
    if (!exam) throw new NotFoundError("Exam");

    if (userRole !== "admin" && !exam.isOwnedBy(userId)) {
      throw new ForbiddenError("Forbidden: you do not own this exam");
    }

    const teacher = await this.userRepository.findById(userId);

    return await this.submissionRepository.create({
      studentName,
      examId: exam.id,
      teacherId: teacher.id,
      answers: answers || [],
      status: "pending",
    });
  }
}
