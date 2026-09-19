import express from "express";
import usersRouter from "./routes/users.js";
const port = 3000;

const app = express();
app.use(express.json());
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

app.listen(port, () => {
  console.log("Server started on port 3000");
});
