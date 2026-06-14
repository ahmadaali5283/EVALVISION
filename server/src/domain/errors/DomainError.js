export class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = "DomainError";
  }
}

export class ValidationError extends DomainError {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends DomainError {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class ForbiddenError extends DomainError {
  constructor(message = "Forbidden: insufficient permissions") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends DomainError {
  constructor(resource = "Resource") {
    super(`${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends DomainError {
  constructor(message) {
    super(message);
    this.name = "ConflictError";
  }
}
