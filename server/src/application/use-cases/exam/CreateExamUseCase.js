import { ForbiddenError, NotFoundError, ValidationError } from "../../../domain/errors/DomainError.js";
import path from "node:path";

export class CreateExamUseCase {
  constructor(examRepository, userRepository, fileStorageService) {
    this.examRepository = examRepository;
    this.userRepository = userRepository;
    this.fileStorageService = fileStorageService;
  }

  async execute({ userId, title, subject, questions, file }) {
    if (!title || !questions || !questions.length) {
      if (file) await this.fileStorageService.deleteFile(file.path);
      throw new ValidationError("title and at least one question are required");
    }

    if (!file) {
      throw new ValidationError("Rubric file is required");
    }

    const teacher = await this.userRepository.findById(userId);
    if (!teacher) {
      await this.fileStorageService.deleteFile(file.path);
      throw new NotFoundError("Teacher");
    }

    const exam = await this.examRepository.create({
      title,
      subject,
      questions,
      teacherId: teacher.id,
    });

    const destDir = path.resolve("uploads", "rubrics", exam.id.toString());
    const finalPath = await this.fileStorageService.moveFile(file.path, destDir, file.filename);

    const relativePath = this.fileStorageService.toRelativePath(finalPath, path.resolve("uploads"));

    return await this.examRepository.update(exam.id, { rubricFile: relativePath });
  }
}
