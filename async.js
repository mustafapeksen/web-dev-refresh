let userData = [
  {
    id: 1,
    name: "Mustafa",
    age: 28,
    email: "gs33peksen@gmail.com",
    isActive: true,
  },
  {
    id: 2,
    name: "Abdullah",
    age: 19,
    email: "abdullahpeksen33@gmail.com",
    isActive: true,
  },
  {
    id: 3,
    name: "Mehmet Burak",
    age: 26,
    email: "mehmetpeksen3377@gmail.com",
    isActive: false,
  },
  {
    id: 4,
    name: "Ali",
    age: 55,
    email: "cinali1971@hotmail.com",
    isActive: true,
  },
  {
    id: 5,
    name: "Şerife",
    age: 55,
    email: "serifepeksen3370@gmail.com",
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
