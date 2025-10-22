---
title: Занятие 32
description: Переиспользование кода с кастомными хуками
---

# OTUS

## Javascript Basic

<!--v-->

### Вопросы?

<!--s-->

### Переиспользование кода с кастомными хуками

<!-- v -->

Проблема дублирования логики

```jsx
// ComponentOne.jsx
const [isHovered, setIsHovered] = useState(false);
const handleMouseEnter = () => setIsHovered(true);
const handleMouseLeave = () => setIsHovered(false);
<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
  ...
</div>;
```

```jsx
// ComponentTwo.jsx
const [isHovered, setIsHovered] = useState(false);
const handleMouseEnter = () => setIsHovered(true);
const handleMouseLeave = () => setIsHovered(false);
<div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
  ...
</div>;
```

<!-- v -->

Логика полностью идентична. Как ее переиспользовать?

<!-- v -->

Раньше для этого использовали:

- HOC (Higher-Order Components) - Компоненты высшего порядка.
- Render Props.

<!-- v -->

HOC (Higher-Order Components)

- Функция, которая принимает компонент и возвращает новый компонент
- Позволяет добавлять логику "снаружи"
- Используется для переиспользования поведения

<!-- v -->

```jsx
function withHover(WrappedComponent) {
  return function (props) {
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <WrappedComponent {...props} isHovered={isHovered} />
      </div>
    );
  };
}

function MyComponent({ isHovered }) {
  return <div>{isHovered ? "На меня навели курсор!" : "Наведите курсор"}</div>;
}

export default withHover(MyComponent);
```

<!-- v -->

Плюсы:

- Разделение обязанностей (UI отдельно, логика отдельно)
- Легко оборачивать несколько компонентов

Минусы:

- "Wrapper hell" (дерево компонентов сильно усложняется)
- Возможны конфликты props
- Логика скрыта внутри обёртки

<!-- v -->

Render Props

- Компонент принимает функцию как child
- Эта функция управляет тем, что будет отрисовано
- Позволяет гибко делиться состоянием и поведением

<!-- v -->

```jsx
function Hover({ children }) {
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children(isHovered)}
    </div>
  );
}

function App() {
  return (
    <Hover>
      {(isHovered) => (
        <div>{isHovered ? "На меня навели курсор!" : "Наведите курсор"}</div>
      )}
    </Hover>
  );
}
```

<!-- v -->

Плюсы:

- Гибкость — родитель решает, как отрисовать
- Чёткий контроль над данными

Минусы:

- Синтаксис иногда "шумный"
- Легко создать "пирамиду функций"

<!-- v -->

Оба подхода рабочие, но имеют недостатки

Хуки предложили более элегантное решение.

<!-- v -->

Что такое кастомные хуки?

Кастомный хук — это JavaScript-функция, имя которой начинается с use, и которая может вызывать другие хуки.

Это не часть React API. Это соглашение, которое позволяет извлекать логику компонента в переиспользуемые функции.

<!-- v -->

Зачем нужны кастомные хуки?

- Убираем дублирование логики
- Разделяем бизнес-логику и UI
- Повышаем читаемость и тестируемость

<!-- v -->

Правила хуков все еще действуют!

Вызывайте хуки только на верхнем уровне вашей React-функции.

Вызывайте хуки только из React-компонентов или из других кастомных хуков.

<!-- s -->

хук useToggle

<!-- v -->

Компонент с логикой внутри:

```jsx
import { useState } from "react";

function ToggleComponent() {
  const [isOn, setIsOn] = useState(false);
  const toggle = () => setIsOn((prevIsOn) => !prevIsOn);

  return <button onClick={toggle}>{isOn ? "Включено" : "Выключено"}</button>;
}
```

<!-- v -->

Извлекаем логику в хук:

```jsx
import { useState, useCallback } from "react";

export function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);
  const toggle = useCallback(() => setState((prevState) => !prevState), []);

  return [state, toggle];
}
```

<!-- v -->

Используем наш новый хук:

```jsx
import { useToggle } from "../hooks/useToggle";

function ToggleComponent() {
  const [isOn, toggle] = useToggle(false);

  return <button onClick={toggle}>{isOn ? "Включено" : "Выключено"}</button>;
}
```

<!-- v -->

Теперь useToggle можно использовать в любом компоненте!

<!-- v -->

хук useRequest

```jsx
function UserProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("[https://api.example.com/user/1](https://api.example.com/user/1)")
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, []);
  // ... рендер состояний
}
```

<!-- v -->

Создаем хук useRequest

```jsx
import { useState, useEffect } from "react";

export function useRequest(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => setError(err))
      .finally(() => setIsLoading(false));
  }, [url]);

  return { data, isLoading, error };
}
```

<!-- v -->

Используем useRequest в компоненте:

```jsx
import { useRequest } from "../hooks/useRequest";

function UserProfile({ userId }) {
  const {
    data: user,
    isLoading,
    error,
  } = useRequest(`https://api.example.com/user/${userId}`);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return <div>Имя пользователя: {user?.name}</div>;
}
```

<!-- v -->

хук useInput

```jsx
function useInput(initial = "") {
  const [value, setValue] = useState(initial);
  const onChange = (e) => setValue(e.target.value);
  return { value, onChange };
}
```

```jsx
function MyForm() {
  const props = useInput();
  return <input {...props} placeholder="Введите имя" />;
}
```

<!-- v -->

хук useLocalStorage

```jsx
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key)) ?? initialValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

<!-- v -->

Лучшие практики

- Имя должно начинаться с use
- Фокус на одной задаче. Не делайте один хук, который делает всё. Лучше несколько маленьких, которые можно комбинировать.
- Хук — чистая функция (без сайд-эффектов вне React API)
- Логику можно комбинировать: хуки вызывают хуки
- Выносите только повторяющийся код

<!-- s -->

[Практика](https://codesandbox.io/p/sandbox/t6st27)

<!-- s -->

Дополнительные материалы

- [Официальная документация по хукам](https://react.dev/reference/react/hooks)
- [Создание своего хука](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [Коллекция полезных кастомных хуков](https://usehooks.com/)
