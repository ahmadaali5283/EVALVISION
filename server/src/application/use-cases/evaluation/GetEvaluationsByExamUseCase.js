export class GetEvaluationsByExamUseCase {
  constructor(evaluationRepository) {
    this.evaluationRepository = evaluationRepository;
  }

  async execute({ examId }) {
    const evaluations = await this.evaluationRepository.findAll({
      examId,
      evaluatorType: "AI",
    });
    return { count: evaluations.length, evaluations };
  }
}
