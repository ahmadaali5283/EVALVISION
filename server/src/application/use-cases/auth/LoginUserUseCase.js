import { AuthenticationError, ValidationError } from "../../../domain/errors/DomainError.js";

export class LoginUserUseCase {
  constructor(userRepository, tokenService) {
    this.userRepository = userRepository;
    this.tokenService = tokenService;
  }

  async execute({ email, password }) {
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    const user = await this.userRepository.findByEmail(email, { includePassword: true });
    if (!user) {
      throw new AuthenticationError("Invalid credentials");
    }

    const isMatch = await this.userRepository.verifyPassword(user.id, password);
    if (!isMatch) {
      throw new AuthenticationError("Invalid credentials");
    }

    const token = this.tokenService.generateToken(user.id, user.role);
    return { token, user: user.toSafeObject() };
  }
}
