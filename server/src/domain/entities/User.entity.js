export class UserEntity {
  constructor({ id, name, email, password, role, createdAt, updatedAt }) {
    this.id = id;
    this._id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role ?? "teacher";
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static VALID_ROLES = ["admin", "teacher"];

  toSafeObject() {
    return {
      id: this.id,
      _id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
