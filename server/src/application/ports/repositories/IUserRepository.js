/* eslint-disable no-unused-vars */
export class IUserRepository {
  async findByEmail(email, opts) {
    throw new Error("not implemented");
  }

  async findById(id) {
    throw new Error("not implemented");
  }

  async create(data) {
    throw new Error("not implemented");
  }

  async verifyPassword(userId, candidatePassword) {
    throw new Error("not implemented");
  }
}
