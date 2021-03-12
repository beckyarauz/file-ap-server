import httpStatus from 'http-status';

class ExtendableError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super();
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

class APIError extends ExtendableError {
  constructor(message: string, status = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, status);
  }
}

export default APIError;
