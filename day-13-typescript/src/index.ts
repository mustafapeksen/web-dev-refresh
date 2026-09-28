type UserRole = "admin" | "user";
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  phone?: string;
  isActive: boolean;
  role: UserRole;
}

type CreateUserInput = Omit<User, "id" | "isActive" | "role">;
type UpdateUserInput = Partial<Omit<User, "id" | "role">>;
type PublicUser = Pick<User, "id" | "name" | "isActive">;

type SuccessResponse = {
  success: true;
  data: PublicUser[];
};
type ErrorResponse = {
  success: false;
  error: string;
};
type ApiResponse = SuccessResponse | ErrorResponse;

const firstUser: User = {
  id: 1,
  name: "Mustafa",
  age: 28,
  email: "user1@example.com",
  phone: "0531...",
  isActive: true,
  role: "user",
};
const secondUser: User = {
  id: 2,
  name: "Abdullah",
  age: 19,
  email: "user2@example.com",
  isActive: true,
  role: "user",
};
const thirdUser: User = {
  id: 3,
  name: "Mehmet Burak",
  age: 26,
  email: "user3@example.com",
  isActive: false,
  role: "user",
};

const users: User[] = [firstUser, secondUser, thirdUser];

function createUser(users: User[], input: CreateUserInput): User {
  const newId =
    users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

  const newUser: User = {
    id: newId,
    name: input.name,
    age: input.age,
    email: input.email,
    isActive: true,
    role: "user",
  };

  if (input.phone !== undefined) {
    newUser.phone = input.phone;
  }

  users.push(newUser);

  return newUser;
}

function updateUserAge(user: User, age: number): User {
  user.age = age;
  return user;
}

function formatIdentifier(identifier: string | number): string {
  if (typeof identifier === "string") {
    return "NAME: " + identifier.toUpperCase();
  } else {
    return "ID: " + identifier;
  }
}
function findUserById(users: User[], id: number): User | undefined {
  return users.find((user) => user.id === id);
}

function updateUserRole(
  users: User[],
  id: number,
  role: UserRole,
): User | undefined {
  const user = findUserById(users, id);
  if (user) {
    user.role = role;
    return user;
  }
}

function updateUser(
  users: User[],
  id: number,
  input: UpdateUserInput,
): User | undefined {
  const userIndex = users.findIndex((user) => user.id === id);
  const user = users[userIndex];

  if (!user) return undefined;

  const newUser: User = { ...user, ...input };

  users.splice(userIndex, 1, newUser);
  return newUser;
}

function getPublicUsers(users: User[]): PublicUser[] {
  const publicUsers: PublicUser[] = users.map(({ id, name, isActive }) => ({
    id,
    name,
    isActive,
  }));

  return publicUsers;
}

function getPublicUsersResponse(users: User[]): ApiResponse {
  return { success: true, data: getPublicUsers(users) };
}

const response = getPublicUsersResponse(users);

if (response.success) {
 // console.log(response.data);
} else {
 // console.log(response.error);
}

let requestBody: unknown = { name: "Mustafa", age: 28 };
type UpdateAgeInput = {
  age: number;
};

function isUpdateAgeInput(input: unknown): input is UpdateAgeInput {
  return (
    input !== null &&
    typeof input === "object" &&
    "age" in input &&
    typeof input.age === "number" &&
    Number.isFinite(input.age) &&
    Number.isInteger(input.age) &&
    input.age > 0 &&
    input.age <= 120
  );
}
if (!isUpdateAgeInput(requestBody)) {
  //console.log("Invalid request body");
} else {
  //console.log(requestBody.age);
}
const allowedKeys: string[] = ["name", "age", "email", "phone", "isActive"];

function isUpdateUserInput(input: unknown): input is UpdateUserInput {
  return (
    input !== null &&
    typeof input === "object" &&
    Object.keys(input).length > 0 &&
    Object.keys(input).every((key) => allowedKeys.includes(key)) &&
    (!("name" in input) || typeof input.name === "string") &&
    (!("email" in input) || typeof input.email === "string") &&
    (!("phone" in input) || typeof input.phone === "string") &&
    (!("isActive" in input) || typeof input.isActive === "boolean") &&
    (!("age" in input) ||
      (typeof input.age === "number" &&
        Number.isInteger(input.age) &&
        input.age >= 1 &&
        input.age <= 120))
  );
}

let id: number;
id = 2
requestBody = { age: 25, isActive: false }

if (!isUpdateUserInput(requestBody)) {
  console.log("Invalid request body");
} else {
  const updatedUser = updateUser(users, id, requestBody);
  if (typeof updatedUser === "undefined") {
    console.log("User not found");
  } else {
    console.log(updatedUser);
    console.log(findUserById(users, id));
  }
}
