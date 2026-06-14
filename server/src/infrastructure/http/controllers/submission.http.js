import { handleError } from "./handleError.js";

export class SubmissionHttpController {
  constructor(
    createSubmissionUseCase,
    listSubmissionsByExamUseCase,
    getSubmissionUseCase,
    checkPlagiarismUseCase
  ) {
    this.createSubmissionUseCase = createSubmissionUseCase;
    this.listSubmissionsByExamUseCase = listSubmissionsByExamUseCase;
    this.getSubmissionUseCase = getSubmissionUseCase;
    this.checkPlagiarismUseCase = checkPlagiarismUseCase;
  }

  createSubmission = async (req, res) => {
    try {
      const { studentName, examId, answers } = req.body;
      const submission = await this.createSubmissionUseCase.execute({
        studentName,
        examId,
        answers,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(201).json({ submission });
    } catch (err) {
      return handleError(err, res, "createSubmission");
    }
  };

  listSubmissionsByExam = async (req, res) => {
    try {
      const result = await this.listSubmissionsByExamUseCase.execute({
        examId: req.params.examId,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json(result);
    } catch (err) {
      return handleError(err, res, "listSubmissionsByExam");
    }
  };

  getSubmission = async (req, res) => {
    try {
      const submission = await this.getSubmissionUseCase.execute({
        submissionId: req.params.id,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json({ submission });
    } catch (err) {
      return handleError(err, res, "getSubmission");
    }
  };

  checkPlagiarism = async (req, res) => {
    try {
      const result = await this.checkPlagiarismUseCase.execute({
        examId: req.params.examId,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json(result);
    } catch (err) {
      return handleError(err, res, "checkPlagiarism");
    }
  };
}
