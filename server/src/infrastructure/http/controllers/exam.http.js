import { handleError } from "./handleError.js";
import { ValidationError } from "../../../domain/errors/DomainError.js";

export class ExamHttpController {
  constructor(
    createExamUseCase,
    listExamsUseCase,
    getExamUseCase,
    updateExamUseCase,
    deleteExamUseCase,
    getExamAnalyticsUseCase
  ) {
    this.createExamUseCase = createExamUseCase;
    this.listExamsUseCase = listExamsUseCase;
    this.getExamUseCase = getExamUseCase;
    this.updateExamUseCase = updateExamUseCase;
    this.deleteExamUseCase = deleteExamUseCase;
    this.getExamAnalyticsUseCase = getExamAnalyticsUseCase;
  }

  createExam = async (req, res) => {
    try {
      let { title, subject, questions } = req.body;
      if (typeof questions === "string") {
        try {
          questions = JSON.parse(questions);
        } catch {
          if (req.file) req.fileCleanup = req.file.path;
          throw new ValidationError("Invalid JSON format for questions");
        }
      }

      const exam = await this.createExamUseCase.execute({
        userId: req.user.id,
        title,
        subject,
        questions,
        file: req.file,
      });
      return res.status(201).json({ exam });
    } catch (err) {
      return handleError(err, res, "createExam");
    }
  };

  listExams = async (req, res) => {
    try {
      const result = await this.listExamsUseCase.execute({
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json(result);
    } catch (err) {
      return handleError(err, res, "listExams");
    }
  };

  getExam = async (req, res) => {
    try {
      const exam = await this.getExamUseCase.execute({
        examId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json({ exam });
    } catch (err) {
      return handleError(err, res, "getExam");
    }
  };

  getExamAnalytics = async (req, res) => {
    try {
      const analytics = await this.getExamAnalyticsUseCase.execute({
        examId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json(analytics);
    } catch (err) {
      return handleError(err, res, "getExamAnalytics");
    }
  };

  updateExam = async (req, res) => {
    try {
      let { title, subject, questions } = req.body;
      if (typeof questions === "string") {
        try {
          questions = JSON.parse(questions);
        } catch {
          throw new ValidationError("Invalid JSON format for questions");
        }
      }

      const exam = await this.updateExamUseCase.execute({
        examId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role,
        title,
        subject,
        questions,
        file: req.file,
      });
      return res.status(200).json({ exam });
    } catch (err) {
      return handleError(err, res, "updateExam");
    }
  };

  deleteExam = async (req, res) => {
    try {
      await this.deleteExamUseCase.execute({
        examId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json({ message: "Exam deleted" });
    } catch (err) {
      return handleError(err, res, "deleteExam");
    }
  };
}
