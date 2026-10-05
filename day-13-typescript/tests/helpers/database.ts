import { pool } from "../../src/database/pool.js";

export async function resetTestDatabase(): Promise<void> {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("Database reset is only allowed in test environment.");
  }

  if (process.env.DB_NAME !== "web_dev_refresh_test") {
    throw new Error("Refusing to reset a non-test database.");
  }

  await pool.query("TRUNCATE TABLE users RESTART IDENTITY;");

  const users = [
    {
      name: "Ahmet Yılmaz",
      age: 27,
      email: "ahmet.yilmaz@example.com",
      isActive: true,
    },
    {
      name: "Zeynep Demir",
      age: 19,
      email: "zeynep.demir@example.com",
      isActive: true,
    },
    {
      name: "Mert Aydın",
      age: 26,
      email: "mert.aydin@example.com",
      isActive: false,
    },
    {
      name: "Emre Kaya",
      age: 28,
      email: "emre.kaya@example.com",
      isActive: true,
    },
  ];

  for (const user of users) {
    await pool.query(
      `INSERT INTO users (name, age, email, is_active)
       VALUES ($1, $2, $3, $4)`,
      [user.name, user.age, user.email, user.isActive],
    );
  }
}

export async function closeTestDatabase(): Promise<void> {
  await pool.end();
}
