import type {
  PatchUserRequest,
  User,
  UserToSave,
} from "../types/user.types.js";

const users: User[] = [
  {
    id: 1,
    name: "Mustafa",
    age: 28,
    email: "gs33peksen@gmail.com",
    phone: "0531...",
    isActive: true,
    role: "user",
  },
  {
    id: 2,
    name: "Abdullah",
    age: 19,
    email: "abdullahpeksen33@gmail.com",
    isActive: true,
    role: "user",
  },
  {
    id: 3,
    name: "Mehmet Burak",
    age: 26,
    email: "mehmetpeksen3377@gmail.com",
    isActive: false,
    role: "user",
  },
];

export async function findUsers(): Promise<User[]> {
  return users;
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
export async function deleteUser(
  userId: number,
): Promise<User | undefined> {
  const index = users.findIndex((user) => user.id === userId);
  const user = users[index];

  if (typeof user === "undefined") {
    return user;
  }

  users.splice(index, 1);
  return user;
}