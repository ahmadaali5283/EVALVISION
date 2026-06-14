import { IExamRepository } from "../../../../application/ports/repositories/IExamRepository.js";
import { ExamModel, toExamEntity } from "../schemas/ExamSchema.js";

export class MongoExamRepository extends IExamRepository {
  async findById(id) {
    const doc = await ExamModel.findById(id).exec();
    return toExamEntity(doc);
  }

  async findAll(filter = {}) {
    const docs = await ExamModel.find(filter).sort({ createdAt: -1 }).exec();
    return docs.map(toExamEntity);
  }

  async create(data) {
    const doc = await ExamModel.create(data);
    return toExamEntity(doc);
  }

  async update(id, data) {
    const doc = await ExamModel.findById(id).exec();
    if (!doc) return null;

    Object.assign(doc, data);
    await doc.save();
    return toExamEntity(doc);
  }

  async delete(id) {
    await ExamModel.findByIdAndDelete(id).exec();
  }
}
