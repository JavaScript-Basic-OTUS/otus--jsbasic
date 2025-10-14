import { memo } from "react";

// Дочерний компонент, который мы хотим оптимизировать
export const CounterButton = memo(({ onClick, label }) => {
  console.log("Кнопка перерендерилась:", label);

  return <button onClick={onClick}>{label}</button>;
});
