import { pool } from "./pool.js";
import { readFile } from "node:fs/promises";

const sql = await readFile("migrations/001_create_users.sql", "utf8");

pool.query(sql);
await pool.end();
