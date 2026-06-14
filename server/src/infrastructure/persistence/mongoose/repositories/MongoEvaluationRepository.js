import { IEvaluationRepository } from "../../../../application/ports/repositories/IEvaluationRepository.js";
import { EvaluationModel, toEvaluationEntity } from "../schemas/EvaluationSchema.js";

export class MongoEvaluationRepository extends IEvaluationRepository {
  async findOne(filter) {
    const doc = await EvaluationModel.findOne(filter).exec();
    return toEvaluationEntity(doc);
  }

  async findAll(filter = {}) {
    const docs = await EvaluationModel.find(filter).sort({ createdAt: -1 }).exec();
    return docs.map(toEvaluationEntity);
  }

  async findBySubmissionIds(submissionIds, extraFilter = {}) {
    const docs = await EvaluationModel.find({ submissionId: { $in: submissionIds }, ...extraFilter }).exec();
    return docs.map(toEvaluationEntity);
  }

  async upsert(filter, data) {
    const doc = await EvaluationModel.findOneAndUpdate(filter, data, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }).exec();
    return toEvaluationEntity(doc);
  }

  async update(id, data) {
    const doc = await EvaluationModel.findById(id).exec();
    if (!doc) return null;
    Object.assign(doc, data);
    await doc.save();
    return toEvaluationEntity(doc);
  }
}
