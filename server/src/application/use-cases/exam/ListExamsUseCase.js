import { NotFoundError } from "../../../domain/errors/DomainError.js";

export class ListExamsUseCase {
  constructor(examRepository, userRepository) {
    this.examRepository = examRepository;
    this.userRepository = userRepository;
  }

  async execute({ userId, userRole }) {
    const teacher = await this.userRepository.findById(userId);
    if (!teacher) throw new NotFoundError("Teacher");

    const filter = userRole === "admin" ? {} : { teacherId: teacher.id };
    const exams = await this.examRepository.findAll(filter);

    return { count: exams.length, exams };
  }
}
