/**
 * @typedef {Object} Token
 * @property {string} token
 * @property {number} expiresIn
 */

/**
 * Генерирует токен доступа для пользователя
 * @param {string} userId
 * @returns {Token}
 */
export function createToken(userId) {
  return {
    token: `token-${userId}-${Date.now()}`,
    expiresIn: 3600,
  };
}
