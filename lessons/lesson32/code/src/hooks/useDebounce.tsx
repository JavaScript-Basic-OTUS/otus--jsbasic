import { useState, useEffect } from "react";

/**
 * Хук, который возвращает значение с задержкой.
 * @param {*} value - Значение, которое нужно "отложить".
 * @param {number} delay - Задержка в миллисекундах.
 * @returns {*} - "Отложенное" значение.
 */
export function useDebounce(value, delay) {
  // TODO: Реализуйте хук.
  // 1. Создайте состояние `debouncedValue` для хранения "отложенного" значения.
  // 2. Используйте `useEffect` для установки таймера (`setTimeout`).
  //    - Эффект должен срабатывать, когда `value` или `delay` изменяются.
  //    - Внутри таймера, по истечении `delay`, обновите `debouncedValue` на текущее `value`.
  // 3. Не забудьте про функцию очистки в `useEffect`! Она должна отменять предыдущий
  //    таймер (`clearTimeout`), если `value` изменилось до того, как таймер сработал.
  // 4. Верните `debouncedValue`.

  // Заглушка
  return value;
}
