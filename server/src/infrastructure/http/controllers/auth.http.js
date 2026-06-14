import { handleError } from "./handleError.js";
import { ValidationError } from "../../../domain/errors/DomainError.js";

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return minLength && hasUpper && hasSymbol;
};

export class AuthHttpController {
  constructor(registerUserUseCase, loginUserUseCase, getMeUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.getMeUseCase = getMeUseCase;
  }

  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      
      if (!name || !email || !password) {
        throw new ValidationError("Please fill in all fields.");
      }
      if (!validateEmail(email)) {
        throw new ValidationError("Please enter a valid email address.");
      }
      if (!validatePassword(password)) {
        throw new ValidationError("Password must be at least 8 characters long, and include at least one uppercase letter and one symbol.");
      }

      const result = await this.registerUserUseCase.execute(req.body);
      return res.status(201).json(result);
    } catch (err) {
      return handleError(err, res, "register");
    }
  };

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ValidationError("Please fill in all fields.");
      }
      if (!validateEmail(email)) {
        throw new ValidationError("Please enter a valid email address.");
      }

      const result = await this.loginUserUseCase.execute(req.body);
      return res.status(200).json(result);
    } catch (err) {
      return handleError(err, res, "login");
    }
  };

  getMe = async (req, res) => {
    try {
      const user = await this.getMeUseCase.execute(req.user.id);
      return res.status(200).json({ user });
    } catch (err) {
      return handleError(err, res, "getMe");
    }
  };
}
