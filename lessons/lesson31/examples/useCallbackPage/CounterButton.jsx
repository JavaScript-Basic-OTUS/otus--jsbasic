/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable react/react-in-jsx-scope */
import { memo } from "react";

// Дочерний компонент, который мы хотим оптимизировать
export const CounterButton = memo(({ onClick, label }) => {
  console.log("Кнопка перерендерилась:", label);

  return <button onClick={onClick}>{label}</button>;
});
