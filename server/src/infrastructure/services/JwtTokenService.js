import jwt from "jsonwebtoken";
import { ITokenService } from "../../application/ports/services/ITokenService.js";
import { env } from "../config/env.js";

export class JwtTokenService extends ITokenService {
  generateToken(userId, role) {
    return jwt.sign({ id: userId, role }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN || "7d",
    });
  }

  verifyToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
  }
}
