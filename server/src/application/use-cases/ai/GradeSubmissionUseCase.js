import { ForbiddenError, NotFoundError, ValidationError } from "../../../domain/errors/DomainError.js";

export class GradeSubmissionUseCase {
  constructor(submissionRepository, examRepository, evaluationRepository, aiGradingService) {
    this.submissionRepository = submissionRepository;
    this.examRepository = examRepository;
    this.evaluationRepository = evaluationRepository;
    this.aiGradingService = aiGradingService;
  }

  async execute({ submissionId, userId, userRole }) {
    const submission = await this.submissionRepository.findById(submissionId);
    if (!submission) throw new NotFoundError("Submission");

    if (userRole !== "admin" && !submission.isOwnedBy(userId)) {
      throw new ForbiddenError("Forbidden: you do not own this submission");
    }

    const exam = await this.examRepository.findById(submission.examId);
    if (!exam) throw new NotFoundError("Exam linked to this submission");

    const hasFile = Boolean(submission.filePath);
    const hasText = !hasFile && submission.answers.length > 0 && submission.answers.some((a) => a.extractedText);

    let submissionText = "";
    if (hasText) {
      submissionText = submission.answers.map((a) => a.extractedText).filter(Boolean).join("\n\n");
    }

    if (!hasFile && !submissionText) {
      throw new ValidationError("Submission has no file and no extracted text — cannot grade");
    }

    await this.submissionRepository.update(submissionId, { processingStage: "grading" });

    let aiResponse;
    try {
      aiResponse = await this.aiGradingService.grade({
        filePath: hasFile ? submission.filePath : undefined,
        mimeType: hasFile ? submission.mimeType : undefined,
        text: hasText ? submissionText : undefined,
        rubricFilePath: exam.rubricFile,
        questions: exam.questions,
        assignmentTitle: exam.title,
        courseName: exam.subject,
      });
    } catch (aiErr) {
      await this.submissionRepository.update(submissionId, { processingStage: "uploaded" });
      const detail = aiErr.response?.data?.detail || aiErr.message || "AI service error";
      const status = aiErr.response?.status || 502;
      const err = new Error(`AI grading failed: ${detail}`);
      err.statusCode = status;
      throw err;
    }

    if (!aiResponse?.success || !aiResponse?.evaluation) {
      await this.submissionRepository.update(submissionId, { processingStage: "uploaded" });
      const err = new Error("AI service returned an invalid response");
      err.statusCode = 502;
      throw err;
    }

    const { evaluation: evalData, extractedText } = aiResponse;

    const evaluation = await this.evaluationRepository.upsert(
      { submissionId: submission.id, evaluatorType: "AI" },
      {
        submissionId: submission.id,
        examId: exam.id,
        evaluatorType: "AI",
        criteriaScores: evalData.criteriaScores || [],
        overallFeedback: evalData.overallFeedback || "",
        totalScore: evalData.totalScore ?? 0,
        extractedText: extractedText || "",
      }
    );

    const updatedAnswers = evalData.criteriaScores?.length
      ? exam.questions.map((q, idx) => {
          const criterionId = `q${idx}`;
          const match = evalData.criteriaScores.find((cs) => cs.criterionId === criterionId);
          return {
            questionIndex: idx,
            extractedText: submission.answers[idx]?.extractedText || extractedText || "",
            aiScore: match?.score ?? null,
            finalScore: submission.answers[idx]?.finalScore ?? null,
            confidence: null,
          };
        })
      : submission.answers;

    await this.submissionRepository.update(submissionId, {
      totalAIScore: evalData.totalScore ?? 0,
      status: "graded",
      processingStage: "completed",
      answers: updatedAnswers,
    });

    return { message: "AI grading completed", evaluation };
  }
}
