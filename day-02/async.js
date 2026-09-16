let userData = [
  {
    id: 1,
    name: "Mustafa",
    age: 28,
    email: "user1@example.com",
    isActive: true,
  },
  {
    id: 2,
    name: "Abdullah",
    age: 19,
    email: "user2@example.com",
    isActive: true,
  },
  {
    id: 3,
    name: "Mehmet Burak",
    age: 26,
    email: "user3@example.com",
    isActive: false,
  },
  {
    id: 4,
    name: "Ali",
    age: 55,
    email: "user4@example.com",
    isActive: true,
  },
  {
    id: 5,
    name: "Şerife",
    age: 55,
    email: "user5@example.com",
    isActive: false,
  },
];

function getUser(id) {
  const promise = new Promise((resolve, reject) => {
    const findUser = userData.find((user) => user.id === id);
    if (findUser) {
      resolve(findUser);
    } else {
      reject("Kullanıcı bulunamadı!");
    }
  });
  return promise;
}

async function main(id) {
  try {
    const result = await getUser(id);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
main(1);
