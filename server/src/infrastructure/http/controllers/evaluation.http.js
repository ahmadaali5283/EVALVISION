import { handleError } from "./handleError.js";

export class EvaluationHttpController {
  constructor(
    getEvaluationBySubmissionUseCase,
    getEvaluationsByExamUseCase,
    updateEvaluationUseCase
  ) {
    this.getEvaluationBySubmissionUseCase = getEvaluationBySubmissionUseCase;
    this.getEvaluationsByExamUseCase = getEvaluationsByExamUseCase;
    this.updateEvaluationUseCase = updateEvaluationUseCase;
  }

  getEvaluationBySubmission = async (req, res) => {
    try {
      const evaluation = await this.getEvaluationBySubmissionUseCase.execute({
        submissionId: req.params.submissionId,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json({ evaluation });
    } catch (err) {
      return handleError(err, res, "getEvaluationBySubmission");
    }
  };

  getEvaluationsByExam = async (req, res) => {
    try {
      const result = await this.getEvaluationsByExamUseCase.execute({ examId: req.params.examId });
      return res.status(200).json(result);
    } catch (err) {
      return handleError(err, res, "getEvaluationsByExam");
    }
  };

  updateEvaluation = async (req, res) => {
    try {
      const { criteriaScores, overallFeedback, totalScore } = req.body;
      const evaluation = await this.updateEvaluationUseCase.execute({
        submissionId: req.params.submissionId,
        userId: req.user.id,
        userRole: req.user.role,
        criteriaScores,
        overallFeedback,
        totalScore,
      });
      return res.status(200).json({ evaluation });
    } catch (err) {
      return handleError(err, res, "updateEvaluation");
    }
  };
}
