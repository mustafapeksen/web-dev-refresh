import test, { beforeEach, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { copyFile, rm } from "node:fs/promises";

import app from "../src/app.js";

const usersTestFile = new URL("../src/data/users.test.json", import.meta.url);

const fixtureFile = new URL("./fixtures/users.json", import.meta.url);

beforeEach(async () => {
  await copyFile(fixtureFile, usersTestFile);
});

after(async () => {
  await rm(usersTestFile, { force: true });
});

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
  const expectedNames = [
    "activeUsers",
    "averageAge",
    "inactiveUsers",
    "totalUsers",
  ];
  assert.equal(
    expectedNames.every((key) => responseName.includes(key)),
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

test("POST /users creates a new user", async () => {
  const users = await request(app).get("/users");
  const usersCount = users.body.length;
  const newUser = {
    name: "Kadriye",
    age: 22,
    email: "kadriye@example.com",
    isActive: true,
  };
  const postRequest = await request(app).post("/users").send(newUser);
  assert.equal(postRequest.status, 201);

  assert.equal(postRequest.body.name, newUser.name);
  assert.equal(postRequest.body.age, newUser.age);
  assert.equal(postRequest.body.email, newUser.email);
  assert.equal(postRequest.body.isActive, newUser.isActive);

  const newUsers = (await request(app).get("/users")).body;

  assert.ok(postRequest.body.id, "User have an id!");
  const isUserExist = newUsers.some((user) => user.id === postRequest.body.id);
  assert.equal(isUserExist, true);

  const newUsersCount = newUsers.length;
  assert.equal(newUsersCount, usersCount + 1);
});

test("Isolation control test", async () => {
  const response = await request(app).get("/users");
  const users = response.body;

  const userEmail = "kadriye@example.com";

  const isUserExist = users.some((user) => user.email === userEmail);
  assert.equal(isUserExist, false);
});

test("PATCH /users/:id age regression tests", async () => {
  const userURL = "/users/6";
  const users = await request(app).get("/users");
  const usersLength = users.body.length;

  const oldUserInfo = await request(app).get(userURL);
  const age = 18;
  const userPatchData = { age };
  const patchResponse = await request(app).patch(userURL).send(userPatchData);
  assert.equal(patchResponse.status, 200);
  assert.equal(patchResponse.body.user.age, age);
  assert.equal(oldUserInfo.body.name, patchResponse.body.user.name);
  assert.equal(oldUserInfo.body.email, patchResponse.body.user.email);
  assert.equal(oldUserInfo.body.isActive, patchResponse.body.user.isActive);

  const newUserInfo = await request(app).get(userURL);
  assert.equal(newUserInfo.body.age, age);

  const newUsers = await request(app).get("/users");
  const newUsersLength = newUsers.body.length;
  assert.equal(usersLength, newUsersLength);
});

test("PATCH isActive control test", async () => {
  const userURL = "/users/4";

  const oldUserInfo = await request(app).get(userURL);

  const userPatchData = { isActive: false };
  const patchResponse = await request(app).patch(userURL).send(userPatchData);

  assert.equal(patchResponse.status, 200);
  assert.equal(patchResponse.body.user.isActive, false);
  assert.equal(oldUserInfo.body.name, patchResponse.body.user.name);

  const updatedUser = await request(app).get(userURL);
  assert.equal(updatedUser.body.isActive, false);
});

test("PATCH /users/id 404 error control", async () => {
  const userPatchData = { name: "Tarık" };
  const users = await request(app).get("/users");
  const nonexistentId  = Math.max(...users.body.map((user) => user.id)) + 1;
  const response = await request(app)
    .patch(`/users/${nonexistentId }`)
    .send(userPatchData);

  assert.equal(response.status, 404);
});

test("PATCH isolation control test", async () => {
  const user = await request(app).get("/users/6");
  const age = 27;

  assert.equal(user.body.age, age);
});
