import { Router, type Request, type Response } from "express";

import {
  validateCreateUserRequest,
  validatePatchUserRequest,
  validateUserId,
} from "../validators/user.validator.js";
import { createUser, patchUserFunction } from "../services/user.service.js";

import type {
  CreateUserResponse,
  GetUserResponse,
  PatchUserResponse,
  UserIdParam,
} from "../types/user.types.js";
import { getUserById } from "../services/user.service.js";

const usersRouter = Router();

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

    try {
      const user = await getUserById(idResult.data);
      if (user === undefined)
        return res.status(404).json({ message: "User not found" });

      return res.status(200).json({ data: user });
    } catch (error) {
      res.status(500).json({
        message: "Something went wrong",
      });
    }
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

    try {
      const newUser = await createUser(validation.data);

      return res.status(201).json({
        data: newUser,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
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
    try {
      const updatedUser = await patchUserFunction(patchUser, id);
      if (typeof updatedUser === "undefined") {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({ data: updatedUser });
    } catch (error) {
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  },
);

export default usersRouter;
