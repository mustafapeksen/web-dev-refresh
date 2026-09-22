import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import app from "../src/app.js";

test("GET /users returns users array", async () => {
  const response = await request(app).get("/users");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);
});

test("GET /users?limit=2 returns 2 users array", async () => {
  const response = await request(app).get("/users?limit=2");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);

  assert.equal(response.body.length, 2);
});

test("GET /users?limit=0 returns 400", async () => {
  const response = await request(app).get("/users?limit=0");

  assert.equal(response.status, 400);
});

test("GET /users?minAge=18abc returns 400", async () => {
  const response = await request(app).get("/users?minAge=18abc");

  assert.equal(response.status, 400);
});

test("GET /users?active=true returns only active users", async () => {
  const response = await request(app).get("/users?active=true");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);

  assert.equal(
    response.body.every((user) => user.isActive === true),
    true,
  );
});

test("GET /users?minAge=18 returns users aged 18 or older", async () => {
  const response = await request(app).get("/users?minAge=18");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);

  assert.equal(
    response.body.every((user) => user.age >= 18),
    true,
  );
});
