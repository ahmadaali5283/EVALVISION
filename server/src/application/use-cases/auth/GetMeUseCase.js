import { NotFoundError } from "../../../domain/errors/DomainError.js";

export class GetMeUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError("User");
    }
    return user.toSafeObject();
  }
}
