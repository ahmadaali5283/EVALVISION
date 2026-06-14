import { ISubmissionRepository } from "../../../../application/ports/repositories/ISubmissionRepository.js";
import { SubmissionModel, toSubmissionEntity } from "../schemas/SubmissionSchema.js";

export class MongoSubmissionRepository extends ISubmissionRepository {
  async findById(id) {
    const doc = await SubmissionModel.findById(id).exec();
    return toSubmissionEntity(doc);
  }

  async findAll(filter = {}) {
    const docs = await SubmissionModel.find(filter).sort({ createdAt: -1 }).exec();
    return docs.map(toSubmissionEntity);
  }

  async create(data) {
    const doc = await SubmissionModel.create(data);
    return toSubmissionEntity(doc);
  }

  async update(id, data) {
    const doc = await SubmissionModel.findById(id).exec();
    if (!doc) return null;
    Object.assign(doc, data);
    await doc.save();
    return toSubmissionEntity(doc);
  }

  async findManyByIds(ids) {
    const docs = await SubmissionModel.find({ _id: { $in: ids } }).exec();
    return docs.map(toSubmissionEntity);
  }
}
