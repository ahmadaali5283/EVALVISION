/* eslint-disable no-unused-vars */
export class IEvaluationRepository {
  async findOne(filter) {
    throw new Error("not implemented");
  }

  async findAll(filter) {
    throw new Error("not implemented");
  }

  async findBySubmissionIds(submissionIds, extraFilter) {
    throw new Error("not implemented");
  }

  async upsert(filter, data) {
    throw new Error("not implemented");
  }

  async update(id, data) {
    throw new Error("not implemented");
  }
}
