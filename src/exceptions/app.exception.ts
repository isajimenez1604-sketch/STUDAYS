export class AppException extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode: number = 400,
    public readonly details?: Record<string, string>
  ) {
    super(message);
    this.name = "AppException";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
