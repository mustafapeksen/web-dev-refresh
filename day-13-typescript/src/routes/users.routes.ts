import {
  Router,
  type Request,
  type Response,
} from "express";

import { validateCreateUserRequest } from "../validators/user.validator.js";
import { createUser } from "../services/user.service.js";

import type { CreateUserResponse } from "../types/user.types.js";

const usersRouter = Router();

usersRouter.post(
  "/",
  async (
    req: Request<{}, CreateUserResponse, unknown>,
    res: Response<CreateUserResponse>,
  ) => {
    const validation =
      validateCreateUserRequest(req.body);

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

export default usersRouter;