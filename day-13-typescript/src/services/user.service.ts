import {
  findUserById,
  saveUser,
  patchUser,
  deleteUser,
} from "../repositories/user.repository.js";

import type {
  CreateUserRequest,
  PatchUserRequest,
  User,
  UserIdParam,
  UserToSave,
} from "../types/user.types.js";

export async function createUser(input: CreateUserRequest): Promise<User> {
  const newUser: UserToSave = {
    name: input.name,
    age: input.age,
    email: input.email,
    isActive: input.isActive,
    role: "user",
  };

  return saveUser(newUser);
}

export async function getUserById(id: number): Promise<User | undefined> {
  return findUserById(id);
}

export async function patchUserFunction(
  input: PatchUserRequest,
  id: number,
): Promise<User | undefined> {
  return patchUser(input, id);
}
export async function deleteUserService(id: number): Promise<User | undefined> {
  return deleteUser(id);
}
