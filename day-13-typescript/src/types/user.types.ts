export type UserRole = "admin" | "user";

export interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  phone?: string;
  isActive: boolean;
  role: UserRole;
}

export type CreateUserRequest = {
  name: string;
  age: number;
  email: string;
  isActive: boolean;
};

export type UserToSave = Omit<User, "id">;

export type CreateUserSuccessResponse = {
  data: User;
};

export type ApiErrorResponse = {
  message: string;
};

export type CreateUserResponse = CreateUserSuccessResponse | ApiErrorResponse;

export type GetUserResponse = SuccessGetUserResponse | ApiErrorResponse;

export type UserIdParam = { id: string };

export type SuccessGetUserResponse = { data: User };


export type PatchUserSuccessResponse = { data: User };

export type PatchUserResponse = PatchUserSuccessResponse | ApiErrorResponse;

export type PatchUserRequest = Partial<Omit<User, "id" | "role" | "phone">>;
