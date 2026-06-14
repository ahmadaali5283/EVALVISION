import { ForbiddenError, NotFoundError } from "../../../domain/errors/DomainError.js";

export class GetExamAnalyticsUseCase {
  constructor(examRepository, submissionRepository, evaluationRepository) {
    this.examRepository = examRepository;
    this.submissionRepository = submissionRepository;
    this.evaluationRepository = evaluationRepository;
  }

  async execute({ examId, userId, userRole }) {
    const exam = await this.examRepository.findById(examId);
    if (!exam) throw new NotFoundError("Exam");

    if (userRole !== "admin" && !exam.isOwnedBy(userId)) {
      throw new ForbiddenError("Forbidden: not your exam");
    }

    const submissions = await this.submissionRepository.findAll({
      examId: exam.id,
      status: { $in: ["graded", "reviewed"] },
    });

    if (!submissions.length) {
      return {
        totalSubmissions: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        distribution: [],
        questionPerformance: [],
      };
    }

    let totalScoreSum = 0;
    let highestScore = 0;
    let lowestScore = exam.totalMarks;

    const bins = [
      { name: "0-20%", count: 0, min: 0, max: 20 },
      { name: "21-40%", count: 0, min: 21, max: 40 },
      { name: "41-60%", count: 0, min: 41, max: 60 },
      { name: "61-80%", count: 0, min: 61, max: 80 },
      { name: "81-100%", count: 0, min: 81, max: 100 },
    ];

    for (const sub of submissions) {
      const score = sub.totalAIScore || 0;
      totalScoreSum += score;
      if (score > highestScore) highestScore = score;
      if (score < lowestScore) lowestScore = score;

      const percentage = exam.totalMarks ? (score / exam.totalMarks) * 100 : 0;
      const bin = bins.find((b) => percentage >= b.min && percentage <= b.max);
      if (bin) bin.count++;
    }

    const averageScore = Number((totalScoreSum / submissions.length).toFixed(2));
    const evaluations = await this.evaluationRepository.findAll({ examId: exam.id });

    const questionPerformance = exam.questions.map((q, idx) => {
      const criterionId = `q${idx}`;
      let totalQuestionScore = 0;
      let count = 0;

      for (const ev of evaluations) {
        const criterion = ev.criteriaScores.find((c) => c.criterionId === criterionId);
        if (criterion) {
          totalQuestionScore += criterion.score || 0;
          count++;
        }
      }

      return {
        question: `Q${idx + 1}`,
        averageScore: count > 0 ? Number((totalQuestionScore / count).toFixed(2)) : 0,
        maxScore: q.maxMarks,
        percentage: count > 0 ? Number(((totalQuestionScore / count / q.maxMarks) * 100).toFixed(1)) : 0,
      };
    });

    return {
      totalSubmissions: submissions.length,
      averageScore,
      highestScore,
      lowestScore,
      distribution: bins,
      questionPerformance,
    };
  }
}
