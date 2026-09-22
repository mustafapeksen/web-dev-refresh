import express from "express";
import usersRouter from "./routes/users.js";


const app = express();
app.use(express.json());
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

export default app;