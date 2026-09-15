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

const result = userData.filter((user) => user.isActive === true);
console.log(result);

const result2 = userData.filter((user) => user.age > 18);
console.log(result2);

const result3 = userData.map((user) => user.name);
console.log(result3);

const result4 = userData.find((user) => user.id === 3);
console.log(result4);

const result5 = userData.some((user) => user.age > 25);
console.log(result5);

const ageSum = userData.reduce(
  (accumulator, user) => accumulator + user.age,
  0,
);
const result6 = ageSum / userData.length;
console.log(result6);

const copyUser = { ...result4, role: "developer" };
console.log(copyUser);
