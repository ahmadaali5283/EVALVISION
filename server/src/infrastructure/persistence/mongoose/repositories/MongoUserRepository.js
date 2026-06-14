import bcrypt from "bcryptjs";
import { IUserRepository } from "../../../../application/ports/repositories/IUserRepository.js";
import { UserModel, toUserEntity } from "../schemas/UserSchema.js";

export class MongoUserRepository extends IUserRepository {
  async findByEmail(email, opts = {}) {
    let query = UserModel.findOne({ email });
    if (opts.includePassword) query = query.select("+password");
    const doc = await query.exec();
    return toUserEntity(doc);
  }

  async findById(id) {
    const doc = await UserModel.findById(id).exec();
    return toUserEntity(doc);
  }

  async create(data) {
    const doc = await UserModel.create(data);
    return toUserEntity(doc);
  }

  async verifyPassword(userId, candidatePassword) {
    const doc = await UserModel.findById(userId).select("+password").exec();
    if (!doc) return false;
    return bcrypt.compare(candidatePassword, doc.password);
  }
}
