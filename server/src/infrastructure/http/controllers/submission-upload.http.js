import { handleError } from "./handleError.js";

export class SubmissionUploadHttpController {
  constructor(uploadSubmissionUseCase) {
    this.uploadSubmissionUseCase = uploadSubmissionUseCase;
  }

  uploadSubmission = async (req, res) => {
    try {
      const result = await this.uploadSubmissionUseCase.execute({
        examId: req.params.examId,
        studentName: req.body.studentName,
        userId: req.user.id,
        userRole: req.user.role,
        file: req.file,
      });
      return res.status(201).json(result);
    } catch (err) {
      return handleError(err, res, "uploadSubmission");
    }
  };
}
