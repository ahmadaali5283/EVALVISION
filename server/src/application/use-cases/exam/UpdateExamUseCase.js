import { ForbiddenError, NotFoundError } from "../../../domain/errors/DomainError.js";
import path from "node:path";

export class UpdateExamUseCase {
  constructor(examRepository, fileStorageService) {
    this.examRepository = examRepository;
    this.fileStorageService = fileStorageService;
  }

  async execute({ examId, userId, userRole, title, subject, questions, file }) {
    const exam = await this.examRepository.findById(examId);
    if (!exam) {
      if (file) await this.fileStorageService.deleteFile(file.path);
      throw new NotFoundError("Exam");
    }

    if (userRole !== "admin" && !exam.isOwnedBy(userId)) {
      if (file) await this.fileStorageService.deleteFile(file.path);
      throw new ForbiddenError("Forbidden: not your exam");
    }

    const updates = {};
    if (title !== undefined) updates.title = title;
    if (subject !== undefined) updates.subject = subject;
    if (questions !== undefined) updates.questions = questions;

    if (file) {
      const destDir = path.resolve("uploads", "rubrics", exam.id.toString());
      const finalPath = await this.fileStorageService.moveFile(file.path, destDir, file.filename);
      updates.rubricFile = this.fileStorageService.toRelativePath(finalPath, path.resolve("uploads"));
    }

    return await this.examRepository.update(examId, updates);
  }
}
