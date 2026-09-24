import fs from "fs/promises";

const usersFile =
  process.env.NODE_ENV === "test"
    ? new URL("../data/users.test.json", import.meta.url)
    : new URL("../data/users.json", import.meta.url);

export async function getUsers() {
  const users = await fs.readFile(usersFile, "utf-8");
  return JSON.parse(users);
}

export async function saveUsers(users) {
  const newUsers = JSON.stringify(users, null, 2);
  await fs.writeFile(usersFile, newUsers, "utf-8");
}
