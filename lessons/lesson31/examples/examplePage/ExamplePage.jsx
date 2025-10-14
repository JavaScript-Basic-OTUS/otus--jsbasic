/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
/* eslint-disable react/react-in-jsx-scope */
import React, { useState, memo, useMemo, useCallback } from "react";

const heavyDouble = (num) => {
  let result = 0;
  // Двойной цикл для большей задержки
  for (let i = 0; i < 100000; i++) {
    for (let j = 0; j < 10000; j++) {
      result = num * 2 + i + j; // Какая-то "полезная" работа
    }
  }
  return result;
};

export default function ExamplePage() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("Alla");
  const [isAdmin, setIsAdmin] = useState(false);
  const [dark, setDark] = useState(false);

  const themeStyle = {
    backgroundColor: dark ? "tomato" : "white",
  };

  const setDarkTheme = () => {
    setDark((prev) => !prev);
  };

  const memoUser = useMemo(
    () => ({
      name,
      isAdmin,
    }),
    [name, isAdmin]
  );

  const incrementCount = () => {
    setCount((count) => count + 1);
  };

  const resetCount = useCallback(() => {
    setCount(0);
  }, []);

  const doubleCount = useMemo(() => heavyDouble(count), [count]);

  return (
    <div style={{ ...themeStyle }}>
      <Title user={memoUser} resetCount={resetCount} />
      <CountInfo count={doubleCount} />
      <button onClick={incrementCount}> + 1 </button>
      <button onClick={setDarkTheme}>Dark</button>
    </div>
  );
}

const Title = React.memo(({ user, resetCount }) => {
  console.log("Title rendered");
  const { name, isAdmin } = user;

  return (
    <>
      <h1>{isAdmin ? name : "Example"}</h1>
      <button onClick={resetCount}>RESET</button>
    </>
  );
});

const CountInfo = ({ count }) => <h3>Count value {count}</h3>;
