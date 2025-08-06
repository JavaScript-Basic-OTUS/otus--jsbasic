import { sum, isAdult } from "./utils.js";
import { createToken } from "./tokenService.js";

/** @type {User} */
const currentUser = {
  id: "u1",
  name: "Alice",
  age: 22,
  isActive: true,
};

const result = sum(5, 7);
console.log("Сумма:", result);

if (isAdult(currentUser)) {
  const token = createToken(currentUser.id);
  console.log("Токен:", token.token);
}
