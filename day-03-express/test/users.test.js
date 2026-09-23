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

test("GET /users?sortBy=age&order=asc return users with sorted by age", async () => {
  const response = await request(app).get("/users?sortBy=age&order=asc");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);

  assert.equal(
    response.body.every(
      (user, i) => i === 0 || response.body[i - 1].age <= user.age,
    ),
    true,
  );
});

test("GET /users?sortBy=age&order=desc return users with desc sorted by age", async () => {
  const response = await request(app).get("/users?sortBy=age&order=desc");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);

  assert.equal(
    response.body.every(
      (user, i) => i === 0 || response.body[i - 1].age >= user.age,
    ),
    true,
  );
});

test("GET /users?active=true&minAge=18 return min age 18 and active users", async () => {
  const response = await request(app).get("/users?active=true&minAge=18");

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);

  assert.equal(
    response.body.every((user) => user.isActive === true && user.age >= 18),
    true,
  );
});

test("GET /users?minAge=30&maxAge=20 return http request status 400", async () => {
  const response = await request(app).get("/users?minAge=30&maxAge=20");

  assert.equal(response.status, 400);
});

test("GET /users?sortBy=age&order=desc&limit=2 return 2 limited users with desc sorted", async () => {
  const response = await request(app).get(
    "/users?sortBy=age&order=desc&limit=2",
  );

  assert.equal(response.status, 200);
  assert.equal(Array.isArray(response.body), true);

  assert.equal(
    response.body.every(
      (user, i) => i === 0 || response.body[i - 1].age >= user.age,
    ),
    true,
  );

  assert.equal(response.body.length <= 2, true);
});

test("GET /users/stats return users stats", async () => {
  const response = await request(app).get("/users/stats");
  const userResponse = await request(app).get("/users");

  assert.equal(response.status, 200);
  const isObject = (item) =>
    Object.prototype.toString.call(item) === "[object Object]";
  assert.equal(isObject(response.body), true);

  const responseName = Object.keys(response.body).sort();
  const expectedNamee = [
    "activeUsers",
    "averageAge",
    "inactiveUsers",
    "totalUsers",
  ];
  assert.equal(
    expectedNamee.every((key) => responseName.includes(key)),
    true,
  );

  assert.equal(response.body.totalUsers, userResponse.body.length);
});

test("GET /users/:id return correct user", async () => {
  const userResponse = await request(app).get("/users");
  const idResponse = await request(app).get(
    "/users/" + userResponse.body[0].id,
  );

  assert.equal(idResponse.status, 200);

  assert.equal(idResponse.body.id, userResponse.body[0].id);
});

test("GET /users/:id undefined id", async () => {
  const userResponse = await request(app).get("/users");
  const maxId = Math.max(...userResponse.body.map((user) => user.id));
  const newID = maxId + 1000;
  const response = await request(app).get("/users/" + newID);

  assert.equal(response.status, 404);
});
