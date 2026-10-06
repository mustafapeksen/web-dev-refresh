import express from "express";
import usersRouter from "./routes/users.routes.js";
import { errorMiddleware } from "./middleware/error.middleware.js";

export const app = express();

app.use(express.json());

app.use("/users", usersRouter);

app.use(errorMiddleware);
