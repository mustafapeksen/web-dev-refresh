import { pool } from "../database/pool.js";
import type {
  PatchUserRequest,
  User,
  UserToSave,
} from "../types/user.types.js";

export async function findUserById(userId: number): Promise<User | undefined> {
  const user = await pool.query<User>(
    `SELECT  id, name, age, email, phone, is_active AS "isActive", role FROM users WHERE id = $1`,
    [userId],
  );
  return user.rows[0];
}

export async function saveUser(user: UserToSave): Promise<User> {
  const result = await pool.query<User>(
    `INSERT INTO users (name,age,email,phone,is_active,role)
VALUES ($1,$2,$3,$4,$5,$6)
RETURNING id, name, age, email, phone, is_active AS "isActive", role`,
    [
      user.name,
      user.age,
      user.email,
      user.phone ?? null,
      user.isActive,
      user.role,
    ],
  );

  const createdUser = result.rows[0];

  if (!createdUser) {
    throw new Error("User could not be created.");
  }

  return createdUser;
}

export async function patchUser(
  currentPatchUser: PatchUserRequest,
  userId: number,
): Promise<User | undefined> {
  const columnMap = {
    name: "name",
    age: "age",
    email: "email",
    isActive: "is_active",
  } as const;
  const entries = Object.entries(currentPatchUser).filter(
    ([key, value]) => key in columnMap && value !== undefined,
  );

  if (entries.length === 0) {
    const existing = await pool.query<User>(
      'SELECT  id, name, age, email, phone, is_active AS "isActive", role FROM users WHERE id = $1',
      [userId],
    );
    return existing.rows[0];
  }

  const setClause = entries
    .map(
      ([key], i) => `${columnMap[key as keyof typeof columnMap]} = $${i + 1}`,
    )
    .join(", ");
  const values = entries.map(([, value]) => value);

  const result = await pool.query<User>(
    `UPDATE users SET ${setClause} WHERE id = $${entries.length + 1} RETURNING id, name, age, email, phone, is_active AS "isActive", role`,
    [...values, userId],
  );

  return result.rows[0];
}
export async function deleteUser(userId: number): Promise<User | undefined> {
  const deleteRequest = await pool.query<User>(
    `DELETE FROM users
WHERE id = $1
RETURNING id, name, age, email, phone, is_active AS "isActive", role`,
    [userId],
  );
  return deleteRequest.rows[0];
}

export async function getUsers(): Promise<User[]> {
  const users = await pool.query<User>(
    `SELECT  id, name, age, email, phone, is_active AS "isActive", role FROM users`,
  );
  return users.rows;
}
