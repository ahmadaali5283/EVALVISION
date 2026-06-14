import { ConflictError, ValidationError } from "../../../domain/errors/DomainError.js";

export class RegisterUserUseCase {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async execute({ name, email, password, role }) {
    if (!name || !email || !password) {
      throw new ValidationError("name, email, and password are required");
    }

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const user = await this.userRepository.create({
      name,
      email,
      password,
      role: role || "teacher",
    });

    const token = this.tokenService.generateToken(user.id, user.role);
    return { token, user: user.toSafeObject() };
  }
}
