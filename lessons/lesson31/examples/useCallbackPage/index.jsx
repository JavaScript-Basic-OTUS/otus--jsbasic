/* eslint-disable react/react-in-jsx-scope */
import { useCallback, useState } from "react";

import { CounterButton } from "./CounterButton";

function UseCallbackPage1() {
  const [counter, setCounter] = useState(0);

  const incrementCounter = useCallback(() => {
    setCounter(counter + 1);
  }, [counter]);

  return (
    <>
      <h1>useCallback</h1>
      <h3>{counter}</h3>
      <button onClick={incrementCounter}> + 1 </button>
    </>
  );
}

function UseCallbackPage() {
  const [counter, setCounter] = useState(0);
  const [dummy, setDummy] = useState(0);

  // Функция не меняется между рендерами
  const incrementCounter = useCallback(() => {
    setCounter((prev) => prev + 1); // Используем функциональное обновление
  }, []); // Пустые зависимости - функция стабильна

  // Без useCallback - создается новая функция при каждом рендере
  const badIncrement = () => {
    setCounter((prev) => prev + 1);
  };

  return (
    <div>
      <h1>useCallback</h1>
      <h3>Счетчик: {counter}</h3>

      {/* С useCallback - кнопка не перерендеривается лишний раз */}
      <CounterButton onClick={incrementCounter} label="+1 (с useCallback)" />

      {/* Без useCallback - кнопка перерендеривается всегда */}
      <CounterButton onClick={badIncrement} label="+1 (без useCallback)" />

      <button onClick={() => setDummy((d) => d + 1)}>
        Принудительный перерендер ({dummy})
      </button>

      <p>Откройте консоль и нажимайте Принудительный перерендер</p>
    </div>
  );
}

export default UseCallbackPage;
