import { useState, useEffect } from "react";

/**
 * @param {string} key - Ключ для хранения в localStorage.
 * @param {*} initialValue - Начальное значение.
 * @returns {[*, function]} - Массив, аналогичный результату useState.
 */
export function useLocalStorage(key, initialValue) {
  // TODO: Реализуйте хук.
  // 1. В useState используйте функцию для ленивой инициализации, чтобы чтение из localStorage происходило только один раз.
  //    - Внутри этой функции попробуйте прочитать значение из localStorage по ключу (`window.localStorage.getItem(key)`).
  //    - Если там что-то есть, используйте `JSON.parse()` для этого значения и верните его.
  //    - Если там пусто или произошла ошибка (используйте try...catch), верните `initialValue`.
  // 2. Используйте `useEffect` для сохранения нового значения в localStorage при его изменении.
  //    - Эффект должен срабатывать каждый раз, когда меняется `key` или `value`.
  //    - Внутри эффекта используйте `JSON.stringify()` для сохранения значения в localStorage.
  // 3. Верните массив `[value, setValue]`, как это делает `useState`.
}
