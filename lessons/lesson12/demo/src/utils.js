/**
 * Проверяет, является ли пользователь совершеннолетним
 * @param {User} user - Пользователь для проверки
 * @returns {boolean} true, если пользователь совершеннолетний
 */
export function isAdult(user) {
  return user.age >= 18;
}

/**
 * Складывает два числа
 * @param {number} a Первое число
 * @param {number} b Второе число
 * @returns {number} Сумма
 */
export function sum(a, b) {
  return a + b;
}
