import {
  ValidationError,
  AuthenticationError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} from "../../../domain/errors/DomainError.js";

export function handleError(err, res, context = "") {
  if (context) console.error(`${context}:`, err.message);

  if (err instanceof ValidationError) return res.status(400).json({ message: err.message });
  if (err instanceof AuthenticationError) return res.status(401).json({ message: err.message });
  if (err instanceof ForbiddenError) return res.status(403).json({ message: err.message });
  if (err instanceof NotFoundError) return res.status(404).json({ message: err.message });
  if (err instanceof ConflictError) return res.status(409).json({ message: err.message });

  if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });

  return res.status(500).json({ message: "Internal server error" });
}
