import { ForbiddenError, NotFoundError } from "../../../domain/errors/DomainError.js";

export class CheckPlagiarismUseCase {
  constructor(submissionRepository, examRepository, evaluationRepository) {
    this.submissionRepository = submissionRepository;
    this.examRepository = examRepository;
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

    if (submissions.length < 2) {
      return { message: "Not enough submissions to perform plagiarism check", flagged: [] };
    }

    const submissionIds = submissions.map((s) => s.id);
    const evaluations = await this.evaluationRepository.findBySubmissionIds(submissionIds, { evaluatorType: "AI" });

    const textLookup = {};
    for (const sub of submissions) {
      const evalDoc = evaluations.find((e) => e.submissionId.toString() === sub.id.toString());
      let text = evalDoc?.extractedText || "";
      if (!text && sub.answers) {
        text = sub.answers.map((a) => a.extractedText || "").join(" ");
      }
      textLookup[sub.id.toString()] = { name: sub.studentName, text };
    }

    const flagged = [];
    const THRESHOLD = 0.5;

    for (let i = 0; i < submissions.length; i++) {
      for (let j = i + 1; j < submissions.length; j++) {
        const id1 = submissions[i].id.toString();
        const id2 = submissions[j].id.toString();
        const t1 = textLookup[id1];
        const t2 = textLookup[id2];

        if (t1.text.length < 50 || t2.text.length < 50) continue;

        const sim = this._similarity(t1.text, t2.text);
        if (sim >= THRESHOLD) {
          flagged.push({
            studentA: t1.name,
            studentB: t2.name,
            similarityPercentage: Math.round(sim * 100),
          });
        }
      }
    }

    flagged.sort((a, b) => b.similarityPercentage - a.similarityPercentage);
    return { flagged };
  }

  _similarity(text1, text2) {
    const getWords = (t) => t.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
    const words1 = new Set(getWords(text1));
    const words2 = new Set(getWords(text2));

    if (words1.size < 10 || words2.size < 10) return 0;

    let intersectionCount = 0;
    for (const word of words1) {
      if (words2.has(word)) intersectionCount++;
    }

    const diceScore = (2 * intersectionCount) / (words1.size + words2.size);

    return diceScore;
  }
}
