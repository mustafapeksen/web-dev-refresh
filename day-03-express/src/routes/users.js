import express from "express";
import { getUsers, saveUsers } from "../repositories/usersRepository.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res) => {
  try {
    const users = await getUsers();

    const { active, minAge, maxAge, sortBy, order, limit } = req.query;

    // active validation
    if (active !== undefined && active !== "true" && active !== "false") {
      return res.status(400).json({ message: "400 Bad Request" });
    }

    // minAge validation
    let parsedMinAge = null;

    if (minAge !== undefined) {
      if (minAge === "") {
        return res.status(400).json({ message: "400 Bad Request" });
      }

      parsedMinAge = Number(minAge);

      if (!Number.isInteger(parsedMinAge) || parsedMinAge < 0) {
        return res.status(400).json({ message: "400 Bad Request" });
      }
    }

    // maxAge validation
    let parsedMaxAge = null;

    if (maxAge !== undefined) {
      if (maxAge === "") {
        return res.status(400).json({ message: "400 Bad Request" });
      }

      parsedMaxAge = Number(maxAge);

      if (!Number.isInteger(parsedMaxAge) || parsedMaxAge < 0) {
        return res.status(400).json({ message: "400 Bad Request" });
      }
    }

    if (
      parsedMinAge !== null &&
      parsedMaxAge !== null &&
      parsedMinAge > parsedMaxAge
    ) {
      return res.status(400).json({ message: "400 Bad Request" });
    }

    // sorting validation
    const allowedSortFields = ["id", "name", "age"];

    if (sortBy !== undefined && !allowedSortFields.includes(sortBy)) {
      return res.status(400).json({ message: "400 Bad Request" });
    }

    if (order !== undefined && order !== "asc" && order !== "desc") {
      return res.status(400).json({ message: "400 Bad Request" });
    }

    // limit validation
    let parsedLimit = null;

    if (limit !== undefined) {
      if (limit === "") {
        return res.status(400).json({ message: "400 Bad Request" });
      }

      parsedLimit = Number(limit);

      if (
        !Number.isInteger(parsedLimit) ||
        parsedLimit < 1 ||
        parsedLimit > 100
      ) {
        return res.status(400).json({ message: "400 Bad Request" });
      }
    }

    // processing
    let filteredUsers = [...users];

    if (active !== undefined) {
      const activeValue = active === "true";

      filteredUsers = filteredUsers.filter(
        (user) => user.isActive === activeValue,
      );
    }

    if (parsedMinAge !== null) {
      filteredUsers = filteredUsers.filter((user) => user.age >= parsedMinAge);
    }

    if (parsedMaxAge !== null) {
      filteredUsers = filteredUsers.filter((user) => user.age <= parsedMaxAge);
    }

    if (sortBy !== undefined) {
      const currentOrder = order ?? "asc";
      const sortOrder = currentOrder === "desc" ? -1 : 1;

      filteredUsers.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * sortOrder;
        if (a[sortBy] > b[sortBy]) return 1 * sortOrder;
        return 0;
      });
    }

    // limit yalnızca gerçekten verilmişse uygulanır
    if (parsedLimit !== null) {
      filteredUsers = filteredUsers.slice(0, parsedLimit);
    }

    return res.status(200).json(filteredUsers);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Something went wrong",
    });
  }
});

usersRouter.get("/stats", async (req, res) => {
  try {
    const users = await getUsers();

    const activeUsers = users.filter((user) => user.isActive === true);
    const inactiveUsers = users.filter((user) => user.isActive === false);

    const totalAges = users.reduce(
      (accumulator, user) => accumulator + user.age,
      0,
    );
    const averageAge = users.length > 0 ? totalAges / users.length : 0;

    res.status(200).json({
      totalUsers: users.length,
      activeUsers: activeUsers.length,
      inactiveUsers: inactiveUsers.length,
      averageAge: averageAge,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

usersRouter.get("/:id", async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId))
      return res.status(400).json({ message: "Invalid request body" });

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

const allowedCreateKeys = ["name", "age", "email", "isActive"];

function validateCreateUserInput(input) {
  if (input === null) {
    return {
      valid: false,
      message: "Please do not send empty information!",
    };
  }

  if (typeof input !== "object") {
    return {
      valid: false,
      message: "Input must be an object!",
    };
  }

  if (Object.keys(input).length <= 0) {
    return { valid: false, message: "Please use object keys!" };
  }

  if (!Object.keys(input).every((key) => allowedCreateKeys.includes(key))) {
    return { valid: false, message: "Please use correct object keys!" };
  }

  if (!("name" in input)) {
    return {
      valid: false,
      message: "Name is required",
    };
  }

  if (typeof input.name !== "string") {
    return {
      valid: false,
      message: "Name must be a string",
    };
  }

  if (input.name.trim().length === 0) {
    return {
      valid: false,
      message: "Name cannot be empty",
    };
  }

  if (!("email" in input)) {
    return {
      valid: false,
      message: "Email is required!",
    };
  }

  if (typeof input.email !== "string") {
    return {
      valid: false,
      message: "Email must be a string",
    };
  }

  if (input.email.trim().length === 0) {
    return {
      valid: false,
      message: "Email cannot be empty",
    };
  }

  if (!("isActive" in input)) {
    return {
      valid: false,
      message: "isActive is required!",
    };
  }

  if (typeof input.isActive !== "boolean") {
    return { valid: false, message: "isActive must be boolean!" };
  }

  if (!("age" in input)) {
    return { valid: false, message: "Age is required!" };
  }

  if (typeof input.age !== "number") {
    return { valid: false, message: "Age must be a number!" };
  }

  if (!Number.isInteger(input.age)) {
    return { valid: false, message: "Age must be an integer" };
  }

  if (input.age < 1 || input.age > 120) {
    return {
      valid: false,
      message: "Age must be between 1 and 120",
    };
  }

  return {
    valid: true,
  };
}

usersRouter.post("/", async (req, res) => {
  const userData = req.body;
  const validation = validateCreateUserInput(userData);
  if (!validation.valid)
    return res.status(400).json({ message: validation.message });

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

const allowedKeys = ["name", "age", "email", "isActive"];

function isUpdateUserInput(input) {
  return (
    input !== null &&
    typeof input === "object" &&
    Object.keys(input).length > 0 &&
    Object.keys(input).every((key) => allowedKeys.includes(key)) &&
    (!("name" in input) || typeof input.name === "string") &&
    (!("email" in input) || typeof input.email === "string") &&
    (!("isActive" in input) || typeof input.isActive === "boolean") &&
    (!("age" in input) ||
      (typeof input.age === "number" &&
        Number.isInteger(input.age) &&
        input.age >= 1 &&
        input.age <= 120))
  );
}

usersRouter.patch("/:id", async (req, res) => {
  try {
    const userUpdatedData = req.body;
    if (!isUpdateUserInput(userUpdatedData))
      return res.status(400).json({ message: "Invalid request body" });

    const users = await getUsers();
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId))
      return res.status(400).json({ message: "Invalid request body" });

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const currentUser = users[userIndex];

    const updatedUser = {
      id: currentUser.id,
      name: userUpdatedData.name ?? currentUser.name,
      age: userUpdatedData.age ?? currentUser.age,
      email: userUpdatedData.email ?? currentUser.email,
      isActive: userUpdatedData.isActive ?? currentUser.isActive,
    };

    users[userIndex] = updatedUser;
    await saveUsers(users);
    res.status(200).json({
      message: "User is updated",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const users = await getUsers();
    const id = Number(req.params.id);
    if (!Number.isInteger(id))
      return res.status(400).json({ message: "Invalid request body" });

    const userIndex = users.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      res.status(404).json({
        message: "This user is not found",
      });
      return;
    }

    const [deletedUser] = users.splice(userIndex, 1);
    await saveUsers(users);
    res.status(200).json({
      message: "User is deleted",
      user: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
});

export default usersRouter;
