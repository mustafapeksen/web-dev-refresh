import type {
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

export async function saveUser(
  user: UserToSave,
): Promise<User> {
  const userIds = users.map((user) => user.id);
  const currentMaxId =
    userIds.length > 0 ? Math.max(...userIds) : 0;

  const savedUser: User = {
    id: currentMaxId + 1,
    ...user,
  };

  users.push(savedUser);

  return savedUser;
}