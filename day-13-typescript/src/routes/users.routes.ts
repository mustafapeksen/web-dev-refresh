import { Router, type Request, type Response } from "express";

import {
  validateCreateUserRequest,
  validatePatchUserRequest,
  validateUserId,
} from "../validators/user.validator.js";
import {
  createUser,
  deleteUserService,
  getUsersService,
  patchUserFunction,
} from "../services/user.service.js";

import type {
  CreateUserResponse,
  DeleteUserResponse,
  GetUserResponse,
  PatchUserResponse,
  UserIdParam,
  UsersResponse,
} from "../types/user.types.js";
import { getUserById } from "../services/user.service.js";
import { DuplicateEmailError } from "../errors/user.errors.js";

const usersRouter = Router();

usersRouter.get(
  "/",
  async (
    req: Request<unknown, UsersResponse, unknown>,
    res: Response<UsersResponse>,
  ) => {
    const users = await getUsersService();
    if (typeof users === "undefined") {
      return res.status(404).json({ message: "Users not found" });
    }
    return res.status(200).json({ data: users });
  },
);

usersRouter.get(
  "/:id",
  async (
    req: Request<UserIdParam, GetUserResponse, unknown>,
    res: Response<GetUserResponse>,
  ) => {
    const idResult = validateUserId(req.params.id);

    if (!idResult.valid) {
      return res.status(400).json({ message: idResult.message });
    }

    const user = await getUserById(idResult.data);
    if (user === undefined)
      return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ data: user });
  },
);

usersRouter.post(
  "/",
  async (
    req: Request<{}, CreateUserResponse, unknown>,
    res: Response<CreateUserResponse>,
  ) => {
    const validation = validateCreateUserRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        message: validation.message,
      });
    }

    const newUser = await createUser(validation.data);

    return res.status(201).json({
      data: newUser,
    });
  },
);

usersRouter.patch(
  "/:id",
  async (
    req: Request<UserIdParam, PatchUserResponse, unknown>,
    res: Response<PatchUserResponse>,
  ) => {
    const validation = validatePatchUserRequest(req.body);

    if (!validation.valid) {
      return res.status(400).json({
        message: validation.message,
      });
    }
    const patchUser = validation.data;
    const idResult = validateUserId(req.params.id);

    if (!idResult.valid) {
      return res.status(400).json({ message: idResult.message });
    }
    const id = idResult.data;

    const updatedUser = await patchUserFunction(patchUser, id);
    if (typeof updatedUser === "undefined") {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ data: updatedUser });
  },
);

usersRouter.delete(
  "/:id",
  async (
    req: Request<UserIdParam, DeleteUserResponse, unknown>,
    res: Response<DeleteUserResponse>,
  ) => {
    const idResult = validateUserId(req.params.id);

    if (!idResult.valid) {
      return res.status(400).json({ message: idResult.message });
    }

    const deletedUser = await deleteUserService(idResult.data);

    if (deletedUser === undefined) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(204).send();
  },
);

export default usersRouter;
