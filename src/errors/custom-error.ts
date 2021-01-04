import { ValidationError } from "express-validator";

export abstract class CustomError extends Error {
  abstract statusCode: number;

  // the value in the variable message in the constructor simply just puts the value inside the message property from the Error class
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): {
    message: string;
    field?: string;
  }[];
}
