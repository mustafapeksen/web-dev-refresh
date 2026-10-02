import type {
  CreateUserRequest,
  PatchUserRequest,
} from "../types/user.types.js";

type ValidationSuccess = {
  valid: true;
  data: CreateUserRequest;
};

type ValidationFailure = {
  valid: false;
  message: string;
};

type ValidationResult = ValidationSuccess | ValidationFailure;

type IdValidationSuccess = { valid: true; data: number };

type UserIdValidationResult = IdValidationSuccess | ValidationFailure;

type PatchValidationResult = PatchValidationSuccess | ValidationFailure;

type PatchValidationSuccess = {
  valid: true;
  data: PatchUserRequest;
};

const allowedKeys = ["name", "age", "email", "isActive"];

export function validateCreateUserRequest(input: unknown): ValidationResult {
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

  if (!("isActive" in input) || typeof input.isActive !== "boolean") {
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

export function validateUserId(id: string): UserIdValidationResult {
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    return { valid: false, message: "Please use correct number type!" };
  }
  if (userId < 1) {
    return { valid: false, message: "Please use valid id!" };
  }
  return { valid: true, data: userId };
}

const allowedPatchKeys = ["name", "age", "email", "isActive"];
export function validatePatchUserRequest(
  input: unknown,
): PatchValidationResult {
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

  if (!keys.every((key) => allowedPatchKeys.includes(key))) {
    return {
      valid: false,
      message: "Request body contains invalid keys",
    };
  }

  let name: string | undefined;
  if ("name" in input) {
    if (typeof input.name !== "string" || input.name.trim().length === 0) {
      return {
        valid: false,
        message: "Invalid 'name'",
      };
    }
    name = input.name;
  }

  let email: string | undefined;
  if ("email" in input) {
    if (typeof input.email !== "string" || input.email.trim().length === 0) {
      return {
        valid: false,
        message: "Invalid 'email'",
      };
    }
    email = input.email;
  }

  let isActive: boolean | undefined;
  if ("isActive" in input) {
    if (typeof input.isActive !== "boolean") {
      return {
        valid: false,
        message: "Invalid 'isActive'",
      };
    }
    isActive = input.isActive;
  }

  let age: number | undefined;
  if ("age" in input) {
    if (
      typeof input.age !== "number" ||
      !Number.isInteger(input.age) ||
      input.age < 1 ||
      input.age > 120
    ) {
      return {
        valid: false,
        message: "Invalid 'age'",
      };
    }
    age = input.age;
  }

  return {
    valid: true,
    data: {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      ...(isActive !== undefined && { isActive }),
      ...(age !== undefined && { age }),
    },
  };
}
