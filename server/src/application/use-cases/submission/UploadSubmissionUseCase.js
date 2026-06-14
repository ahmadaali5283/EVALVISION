import { ForbiddenError, NotFoundError, ValidationError } from "../../../domain/errors/DomainError.js";
import path from "node:path";

export class UploadSubmissionUseCase {
  constructor(submissionRepository, examRepository, userRepository, fileStorageService) {
    this.submissionRepository = submissionRepository;
    this.examRepository = examRepository;
    this.userRepository = userRepository;
    this.fileStorageService = fileStorageService;
  }

  async execute({ examId, studentName, userId, userRole, file }) {
    if (!studentName) {
      if (file) await this.fileStorageService.deleteFile(file.path);
      throw new ValidationError("studentName is required (send as form field)");
    }

    if (!file) throw new ValidationError("No file uploaded");

    const exam = await this.examRepository.findById(examId);
    if (!exam) {
      await this.fileStorageService.deleteFile(file.path);
      throw new NotFoundError("Exam");
    }

    if (userRole !== "admin" && !exam.isOwnedBy(userId)) {
      await this.fileStorageService.deleteFile(file.path);
      throw new ForbiddenError("Forbidden: you do not own this exam");
    }

    const teacher = await this.userRepository.findById(userId);

    const submission = await this.submissionRepository.create({
      studentName,
      examId: exam.id,
      teacherId: teacher.id,
      originalFileName: file.originalname,
      mimeType: file.mimetype,
      uploadDate: new Date(),
      status: "pending",
      processingStage: "uploaded",
    });

    const destDir = path.resolve("uploads", "exams", examId, submission.id.toString(), "original");
    const finalPath = await this.fileStorageService.moveFile(file.path, destDir, file.filename);

    const relativePath = this.fileStorageService.toRelativePath(finalPath, path.resolve("uploads"));

    const updatedSubmission = await this.submissionRepository.update(submission.id, { filePath: relativePath });

    return {
      submissionId: updatedSubmission.id,
      fileUrl: `/uploads/${relativePath}`,
      status: updatedSubmission.status,
      processingStage: updatedSubmission.processingStage,
    };
  }
}
