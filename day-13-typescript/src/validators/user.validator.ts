import type { CreateUserRequest } from "../types/user.types.js";

type ValidationSuccess = {
  valid: true;
  data: CreateUserRequest;
};

type ValidationFailure = {
  valid: false;
  message: string;
};

type ValidationResult =
  | ValidationSuccess
  | ValidationFailure;

const allowedKeys = [
  "name",
  "age",
  "email",
  "isActive",
];

export function validateCreateUserRequest(
  input: unknown,
): ValidationResult {
  if (input === null || typeof input !== "object") {
    return {
      valid: false,
      message: "Request body must be an object",
    };
  }

  const keys = Object.keys(input);

  if (keys.length === 0) {
    return {
      valid: false,
      message: "Request body cannot be empty",
    };
  }

  if (!keys.every((key) => allowedKeys.includes(key))) {
    return {
      valid: false,
      message: "Request body contains invalid keys",
    };
  }

  if (
    !("name" in input) ||
    typeof input.name !== "string" ||
    input.name.trim().length === 0
  ) {
    return {
      valid: false,
      message: "Invalid or missing 'name'",
    };
  }

  if (
    !("email" in input) ||
    typeof input.email !== "string" ||
    input.email.trim().length === 0
  ) {
    return {
      valid: false,
      message: "Invalid or missing 'email'",
    };
  }

  if (
    !("isActive" in input) ||
    typeof input.isActive !== "boolean"
  ) {
    return {
      valid: false,
      message: "Invalid or missing 'isActive'",
    };
  }

  if (
    !("age" in input) ||
    typeof input.age !== "number" ||
    !Number.isInteger(input.age) ||
    input.age < 1 ||
    input.age > 120
  ) {
    return {
      valid: false,
      message: "Invalid or missing 'age'",
    };
  }

  return {
    valid: true,
    data: {
      name: input.name,
      email: input.email,
      isActive: input.isActive,
      age: input.age,
    },
  };
}