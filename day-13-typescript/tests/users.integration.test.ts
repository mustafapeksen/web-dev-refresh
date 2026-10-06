import test, { after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

import { app } from "../src/app.js";
import { resetTestDatabase, closeTestDatabase } from "./helpers/database.js";

beforeEach(async () => {
  await resetTestDatabase();
});

after(async () => {
  await closeTestDatabase();
});

test("GET /users returns users", async () => {
  const response = await request(app).get("/users");

  assert.equal(response.status, 200);
});

test("GET /users/:id returns 200 when user exists", async () => {
  const response = await request(app).get("/users/2");

  assert.equal(response.status, 200);
  assert.equal(response.body.data.id, 2);
});

test("PATCH /users/:id update user age", async () => {
  const userURL = "/users/2";
  const body = { age: 20 };
  const patchResponse = await request(app).patch(userURL).send(body);

  assert.equal(patchResponse.status, 200);
  assert.equal(patchResponse.body.data.age, 20);
});

test("DELETE /users/:id delete user test", async () => {
  const userURL = "/users/2";
  const response = await request(app).delete(userURL);

  assert.equal(response.status, 204);
});

test("GET /users/:id returns 400 when id is invalid", async () => {
  const userURL = "/users/2asd";
  const response = await request(app).get(userURL);

  assert.equal(response.status, 400);
});

test("GET /users/:id returns 404 when user does not exist", async () => {
  const userURL = "/users/999";
  const response = await request(app).get(userURL);

  assert.equal(response.status, 404);
});

test("POST /users returns 201 when body is valid", async () => {
  const body = {
    name: "Şerife",
    age: 55,
    email: "serife@example.com",
    isActive: true,
  };
  const postResponse = await request(app).post("/users").send(body);
  const getResponse = await request(app).get("/users");
  const latestIndex = getResponse.body.data.length - 1;
  assert.equal(postResponse.status, 201);
  assert.deepStrictEqual(
    postResponse.body.data,
    getResponse.body.data[latestIndex],
  );
});

test("POST /users returns 400 when body is invalid", async () => {
  const body = {
    name: "Şerife",
    age: 551,
    email: "serife@example.com",
    isActive: true,
  };

  const postResponse = await request(app).post("/users").send(body);
  assert.equal(postResponse.status, 400);
});

test("POST /users returns 400 when body contains an extra field", async () => {
  const body = {
    id: 4,
    name: "Şerife",
    age: 55,
    email: "serife@example.com",
    isActive: true,
  };

  const postResponse = await request(app).post("/users").send(body);
  assert.equal(postResponse.status, 400);
});

test("PATCH /users/:id returns 400 when body is invalid", async () => {
  const userURL = "/users/2";
  const body = { age: "20" };
  const patchResponse = await request(app).patch(userURL).send(body);
  const getResponse = await request(app).get(userURL);

  assert.equal(patchResponse.status, 400);
  assert.equal(getResponse.body.data.age, 19);
});

test("PATCH /users/:id returns 404 when user does not exist", async () => {
  const userURL = "/users/999";
  const body = { age: 20 };
  const patchResponse = await request(app).patch(userURL).send(body);

  assert.equal(patchResponse.status, 404);
});

test("DELETE /users/:id returns 400 when id is invalid", async () => {
  const userURL = "/users/2sad";
  const response = await request(app).delete(userURL);

  assert.equal(response.status, 400);
});

test("DELETE /users/:id returns 404 when user does not exist", async () => {
  const userURL = "/users/999";
  const response = await request(app).delete(userURL);

  assert.equal(response.status, 404);
});

test("DELETE /users/:id removes the user from the repository", async () => {
  const userURL = "/users/2";
  const deleteResponse = await request(app).delete(userURL);

  const getResponse = await request(app).get(userURL);

  assert.equal(deleteResponse.status, 204);
  assert.equal(getResponse.status, 404);
});

test("POST /users returns 409 when email already exists", async () => {
  const newUser = {
    name: "Duplicate Test",
    age: 25,
    email: "duplicate@example.com",
    isActive: true,
  };

  const firstCreateRequest = await request(app).post("/users").send(newUser);
  const secondCreateRequest = await request(app).post("/users").send(newUser);

  assert.equal(firstCreateRequest.status, 201);
  assert.equal(secondCreateRequest.status, 409);
  assert.deepEqual(secondCreateRequest.body, {
    message: "Email already exists",
  });
});
