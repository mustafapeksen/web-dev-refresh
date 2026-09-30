import { saveUser } from "../repositories/user.repository.js";

import type {
  CreateUserRequest,
  User,
  UserToSave,
} from "../types/user.types.js";

export async function createUser(
  input: CreateUserRequest,
): Promise<User> {
  const newUser: UserToSave = {
    name: input.name,
    age: input.age,
    email: input.email,
    isActive: input.isActive,
    role: "user",
  };

  return saveUser(newUser);
}