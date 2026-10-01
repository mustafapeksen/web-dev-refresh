import type { User, UserToSave } from "../types/user.types.js";

const users: User[] = [
  {
    id: 1,
    name: "Mustafa",
    age: 28,
    email: "user1@example.com",
    phone: "0531...",
    isActive: true,
    role: "user",
  },
  {
    id: 2,
    name: "Abdullah",
    age: 19,
    email: "user2@example.com",
    isActive: true,
    role: "user",
  },
  {
    id: 3,
    name: "Mehmet Burak",
    age: 26,
    email: "user3@example.com",
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
