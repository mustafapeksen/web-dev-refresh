import express from "express";
import usersRouter from "./routes/users.routes.js";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);

app.listen(3000, () => {
  console.log("Server is running on 3000");
});