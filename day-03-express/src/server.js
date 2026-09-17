import express from "express";
import fs from "fs/promises";

const port = 3000;

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

async function getUsers() {
  const users = await fs.readFile("./data/users.json", "utf-8");
  return JSON.parse(users);
}

app.get("/users", async (req, res) => {
  try {
    const users = await getUsers();
    const isActive = req.query.active;
    if (isActive === undefined) {
      res.json(users);
    } else if (isActive === "true") {
      res.json(users.filter((user) => user.isActive === true));
    } else if (isActive === "false") {
      res.json(users.filter((user) => user.isActive === false));
    } else {
      res.status(400).json({
        message: "400 Bad Request",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const users = await getUsers();
    const user = users.find((user) => user.id === userId);
    if (user !== undefined) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

async function saveUsers(users) {
  const newUsers = JSON.stringify(users, null, 2);
  await fs.writeFile("./data/users.json", newUsers);
}

app.post("/users", async (req, res) => {
  const userData = req.body;
  if (!userData.name) {
    res.status(400).json({
      message: "Name required",
    });
    return;
  }
  if (!userData.age) {
    res.status(400).json({
      message: "Age required",
    });
    return;
  }
  if (!userData.email) {
    res.status(400).json({
      message: "E-mail required",
    });
    return;
  }
  if (userData.isActive === undefined) {
    res.status(400).json({
      message: "isActive required",
    });
    return;
  }

  try {
    const users = await getUsers();
    const usersId = users.map((user) => user.id);
    const currentMaxId = usersId.length > 0 ? Math.max(...usersId) : 0;
    const id = currentMaxId + 1;
    const newUser = {
      id,
      name: userData.name,
      age: userData.age,
      email: userData.email,
      isActive: userData.isActive,
    };
    users.push(newUser);
    await saveUsers(users);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
    return;
  }
});

app.listen(port, () => {
  console.log("Server started on port 3000");
});
