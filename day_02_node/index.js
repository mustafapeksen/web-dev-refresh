import fs from "fs/promises";

async function main() {
  try {
    const resultJson = await fs.readFile("./users.json", "utf-8");
    const result = JSON.parse(resultJson);

    const activeUsers = result.filter((user) => user.isActive);
    const activeUsersName = activeUsers.map((user) => user.name);

    const totalAges = result.reduce(
      (accumulator, user) => accumulator + user.age,
      0,
    );
    const averageAges = totalAges / result.length;
    console.log("Active Users:" + "\n" + activeUsersName);
    console.log("Average Age: " + averageAges);
    console.log("Total Users: " + result.length);
  } catch (error) {
    console.log(error);
  }
}

main();
