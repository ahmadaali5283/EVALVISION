import { handleError } from "./handleError.js";

export class AIHttpController {
  constructor(gradeSubmissionUseCase) {
    this.gradeSubmissionUseCase = gradeSubmissionUseCase;
  }

  gradeSubmission = async (req, res) => {
    try {
      const result = await this.gradeSubmissionUseCase.execute({
        submissionId: req.params.submissionId,
        userId: req.user.id,
        userRole: req.user.role,
      });
      return res.status(200).json(result);
    } catch (err) {
      return handleError(err, res, "gradeSubmission");
    }
  };
}
