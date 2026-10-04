import type {
  PatchUserRequest,
  User,
  UserToSave,
} from "../types/user.types.js";

const initialUsers: User[] = [
  {
    id: 1,
    name: "Emre Kaya",
    age: 28,
    email: "emre.kaya@example.com",
    phone: "000-000-0000",
    isActive: true,
    role: "user",
  },
  {
    id: 2,
    name: "Zeynep Demir",
    age: 19,
    email: "zeynep.demir@example.com",
    isActive: true,
    role: "user",
  },
  {
    id: 3,
    name: "Mert Aydın",
    age: 26,
    email: "mert.aydin@example.com",
    isActive: false,
    role: "user",
  },
];

export const users: User[] = initialUsers.map((user) => ({ ...user }));

export function resetUsers(): void {
  users.splice(0, users.length, ...initialUsers.map((user) => ({ ...user })));
}

export async function findUserById(userId: number): Promise<User | undefined> {
  const user = users.find((user) => user.id === userId);
  return user;
}

export async function saveUser(user: UserToSave): Promise<User> {
  const userIds = users.map((user) => user.id);
  const currentMaxId = userIds.length > 0 ? Math.max(...userIds) : 0;

  const savedUser: User = {
    id: currentMaxId + 1,
    ...user,
  };

  users.push(savedUser);

  return savedUser;
}

export async function patchUser(
  currentPatchUser: PatchUserRequest,
  userId: number,
): Promise<User | undefined> {
  const index = users.findIndex((user) => user.id === userId);
  const currentUser = users[index];

  if (typeof currentUser === "undefined") {
    return currentUser;
  }

  const patchedUser: User = {
    ...currentUser,
    ...currentPatchUser,
  };
  users.splice(index, 1, patchedUser);
  return patchedUser;
}
export async function deleteUser(userId: number): Promise<User | undefined> {
  const index = users.findIndex((user) => user.id === userId);
  const user = users[index];

  if (typeof user === "undefined") {
    return user;
  }

  users.splice(index, 1);
  return user;
}

export async function getUsers(): Promise<User[]> {
  return users;
}
