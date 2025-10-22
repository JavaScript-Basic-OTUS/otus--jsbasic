/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { useMemo } from "react";

export default function TodoList({ todos, filter }) {
  // БЕЗ useMemo: фильтрация происходит при каждом рендере
  // const visibleTodos = todos.filter(todo => {
  //   console.log("🔴 ФИЛЬТРАЦИЯ (без useMemo)"); // Это будет логироваться часто
  //   console.log("--------------------"); // Это будет логироваться часто
  //   return filter === "all" ||
  //          (filter === "completed" && todo.completed) ||
  //          (filter === "active" && !todo.completed);
  // });

  // С useMemo: фильтрация происходит только при изменении todos или filter
  const visibleTodos = useMemo(() => {
    console.log("🟢 ФИЛЬТРАЦИЯ (с useMemo)"); // Логируется только при изменении зависимостей
    return todos.filter(
      (todo) =>
        filter === "all" ||
        (filter === "completed" && todo.completed) ||
        (filter === "active" && !todo.completed)
    );
  }, [todos, filter]); // Зависимости: todos и filter

  return (
    <ul>
      {visibleTodos.map((todo) => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
